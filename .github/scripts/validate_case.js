/**
 * Case Directory Validation Script
 * 
 * This script validates new or modified case directories in PRs:
 * 1. Checks that new directories are numbered as current max number + 1
 * 2. Validates YAML file format matches template requirements
 * 3. Verifies referenced images exist in the files
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Array to collect errors
const errors = [];

// Helper function: collect errors
function collectError(message, file = null) {
  errors.push({ message, file });
}

try {
  // Get changed files list and main branch info from standard input
  const input = fs.readFileSync(0, 'utf-8').trim();
  const lines = input.split('\n');

  // First line contains existing directory info from main branch
  const mainBranchDirsInfo = lines[0];
  let caseDirs = [];
  let maxDirNum = 0;

  try {
    const mainBranchInfo = JSON.parse(mainBranchDirsInfo);
    caseDirs = mainBranchInfo.caseDirs;
    maxDirNum = mainBranchInfo.maxDirNum;
  } catch (e) {
    collectError(`Failed to parse main branch info: ${e.message}`);
    process.exit(1);
  }

  // Remaining lines are changed files
  const changedFiles = lines.slice(1).filter(f => f.trim() !== '');
  console.log("Changed files detected:", changedFiles);
  
  if (changedFiles.length === 0) {
    console.log("No files changed. Skipping validation.");
    process.exit(0);
  }

  // Extract directory numbers from changed files
  const newDirPattern = /^cases\/(\d+)(\/|$)/;
  const changedDirsSet = new Set();

  changedFiles.forEach(filePath => {
    const match = filePath.match(newDirPattern);
    if (match) {
      changedDirsSet.add(parseInt(match[1]));
    }
  });
  
  const changedDirs = Array.from(changedDirsSet);
  console.log("Directory numbers detected in PR:", changedDirs);

  if (changedDirs.length === 0) {
    console.log("No case directories found in PR.");
    process.exit(0);
  }

  // Categorize directories as new or modified
  const newAddedDirs = changedDirs.filter(d => !caseDirs.includes(d));
  const modifiedExistingDirs = changedDirs.filter(d => caseDirs.includes(d));
  
  console.log("New directories to validate:", newAddedDirs);
  console.log("Modified existing directories:", modifiedExistingDirs);
  
  // Validation 1: Directory naming - new directories must be numbered as current max + 1
  newAddedDirs.forEach(dirNum => {
    if (dirNum !== maxDirNum + 1) {
      const dirPath = `cases/${dirNum}`;
      collectError(`New case number ${dirNum} error, should be ${maxDirNum + 1}`, dirPath);
    }
  });

  // All directories needing content validation: new + modified
  const dirsToCheckContent = [...newAddedDirs, ...modifiedExistingDirs];
  
  if (dirsToCheckContent.length === 0) {
    console.log("No directories need content validation.");
    process.exit(0);
  }

  // Validation 2 & 3: YAML format and image files
  const templateFile = 'case-template/case.yaml';
  
  let templateData;
  try {
    const templateContent = fs.readFileSync(templateFile, 'utf8');
    templateData = yaml.load(templateContent);
  } catch (e) {
    collectError(`Could not read template YAML: ${e.message}`);
    process.exit(1);
  }

  // Extract template object (supports both array and object formats)
  const templateItem = Array.isArray(templateData) ? templateData[0] : templateData;
  
  if (!templateItem || typeof templateItem !== 'object') {
    collectError("Template YAML is not properly formatted");
    process.exit(1);
  }
  
  // Get required fields (excluding optional ones)
  const optionalFields = ['prompt_note', 'prompt_note_en', 'reference_note', 'reference_note_en', 'submitter', 'submitter_link'];
  const requiredFields = Object.keys(templateItem).filter(field => !optionalFields.includes(field));
  console.log("Required fields:", requiredFields);

  // Helper function: validate single case
  function validateCase(caseItem, yamlFile, caseNumber = 1) {
    // Check required fields
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!caseItem[field]) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      collectError(`Required fields missing: ${missingFields.join(', ')}`, yamlFile);
    }
    
    // Check if referenced image files exist
    if (caseItem.image) {
      const imagePath = path.join(path.dirname(yamlFile), caseItem.image);
      try {
        const exists = fs.existsSync(imagePath);
        if (!exists) {
          collectError(`Image file '${caseItem.image}' does not exist`, yamlFile);
        }
      } catch (e) {
        collectError(`Error checking image file: ${e.message}`, yamlFile);
      }
    }
  }

  // Check each directory needing content validation
  let directoriesChecked = 0;
  
  dirsToCheckContent.forEach(dirNum => {
    const dirPath = `cases/${dirNum}`;
    console.log(`Checking directory: ${dirPath}`);
    directoriesChecked++;
    
    // Find yaml files
    const yamlFiles = [];
    try {
      fs.readdirSync(dirPath).forEach(file => {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          yamlFiles.push(path.join(dirPath, file));
        }
      });
      console.log(`Found YAML files in ${dirPath}:`, yamlFiles);
    } catch (e) {
      collectError(`Could not read directory ${dirPath}: ${e.message}`, dirPath);
      return;
    }
    
    if (yamlFiles.length === 0) {
      collectError(`No YAML file found in ${dirPath}`, dirPath);
      return;
    }
    
    yamlFiles.forEach(yamlFile => {
      let caseData;
      try {
        const content = fs.readFileSync(yamlFile, 'utf8');
        caseData = yaml.load(content);
      } catch (e) {
        collectError(`Could not parse ${yamlFile}: ${e.message}`, yamlFile);
        return;
      }
      
      if (caseData && typeof caseData === 'object') {
        // If single object, validate directly
        validateCase(caseData, yamlFile);
      } else {
        collectError(`${yamlFile} contains invalid YAML structure`, yamlFile);
      }
    });
  });
  
  console.log(`Checked ${directoriesChecked} directories for validation.`);
  
  // Check for errors and output results
  if (errors.length > 0) {
    console.error("\n========== VALIDATION ERRORS ==========");
    
    // Group errors by file
    const fileErrors = {};
    errors.forEach(error => {
      if (error.file) {
        if (!fileErrors[error.file]) {
          fileErrors[error.file] = [];
        }
        fileErrors[error.file].push(error.message);
        
        // Output GitHub Actions format error annotations
        console.error(`::error file=${error.file}::${error.message}`);
      } else {
        console.error(`::error::${error.message}`);
      }
    });
    
    console.error("\n========== VALIDATION FAILED ==========");
    process.exit(1);
  } else {
    // all case validations passed
    process.exit(0);
  }
} catch (e) {
  console.error(`::error::Unexpected error: ${e.message}`);
  process.exit(1);
} 