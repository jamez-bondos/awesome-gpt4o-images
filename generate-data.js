// generate-data.js - Node.js script to generate JSON data from YAML files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate JSON data file for the GitHub Pages website
 */
function generateWebsiteData() {
    console.log('📊 Generating website data from cases...');
    
    const casesDir = path.join(__dirname, 'cases');
    
    if (!fs.existsSync(casesDir)) {
        console.error('❌ Cases directory not found!');
        process.exit(1);
    }
    
    // Read all case directories
    const entries = fs.readdirSync(casesDir);
    const numericDirs = entries.filter(dir => {
        const fullPath = path.join(casesDir, dir);
        return fs.statSync(fullPath).isDirectory() && !isNaN(dir);
    });
    
    console.log(`📁 Found ${numericDirs.length} case directories`);
    
    const cases = [];
    const errors = [];
    
    // Process each case directory
    for (const dirName of numericDirs) {
        try {
            const caseNumber = parseInt(dirName);
            const caseDir = path.join(casesDir, dirName);
            
            console.log(`📝 Processing Case ${caseNumber}...`);
            
            // Read case.yml
            const caseYmlPath = path.join(caseDir, 'case.yml');
            if (!fs.existsSync(caseYmlPath)) {
                errors.push(`Case ${caseNumber}: case.yml not found`);
                continue;
            }
            
            const caseData = yaml.load(fs.readFileSync(caseYmlPath, 'utf8'));
            
            // Read ATTRIBUTION.yml
            const attributionPath = path.join(caseDir, 'ATTRIBUTION.yml');
            let attributionData = {};
            if (fs.existsSync(attributionPath)) {
                attributionData = yaml.load(fs.readFileSync(attributionPath, 'utf8'));
            } else {
                // Fallback attribution data
                attributionData = {
                    image_author: '@jamez-bondos',
                    image_author_link: 'https://github.com/jamez-bondos',
                    prompt_author: caseData.author || 'Unknown',
                    prompt_author_link: caseData.author_link || '#'
                };
            }
            
            // Find image file
            const imageFiles = fs.readdirSync(caseDir).filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext);
            });
            
            const imageFile = caseData.image || imageFiles[0] || 'case.png';
            
            // Extract tags from title and content
            const tags = extractTags(caseData.title, caseData.title_en, caseData.prompt, caseData.prompt_en);
            
            // Build case object for website
            const websiteCase = {
                id: caseNumber,
                title: caseData.title || caseData.title_en || `Case ${caseNumber}`,
                title_en: caseData.title_en || caseData.title || `Case ${caseNumber}`,
                author: caseData.author || 'Unknown',
                author_link: caseData.author_link || '#',
                source_links: caseData.source_links || [],
                image: `cases/${caseNumber}/${imageFile}`,
                alt_text: caseData.alt_text || caseData.title || `Case ${caseNumber}`,
                alt_text_en: caseData.alt_text_en || caseData.title_en || `Case ${caseNumber}`,
                prompt: caseData.prompt || '',
                prompt_en: caseData.prompt_en || caseData.prompt || '',
                prompt_note: caseData.prompt_note || '',
                prompt_note_en: caseData.prompt_note_en || caseData.prompt_note || '',
                reference_note: caseData.reference_note || '',
                reference_note_en: caseData.reference_note_en || caseData.reference_note || '',
                submitter: caseData.submitter || '',
                submitter_link: caseData.submitter_link || '',
                attribution: attributionData,
                tags: tags,
                hasReference: !!(caseData.reference_note || caseData.reference_note_en),
                createdAt: fs.statSync(caseDir).birthtime.toISOString()
            };
            
            cases.push(websiteCase);
            
        } catch (error) {
            errors.push(`Case ${dirName}: ${error.message}`);
            console.error(`❌ Error processing case ${dirName}:`, error.message);
        }
    }
    
    // Sort cases by number (descending)
    cases.sort((a, b) => b.id - a.id);
    
    // Generate website data
    const websiteData = {
        metadata: {
            totalCases: cases.length,
            lastUpdated: new Date().toISOString(),
            version: '1.0.0'
        },
        cases: cases,
        stats: {
            totalCases: cases.length,
            contributors: [...new Set(cases.map(c => c.author))].length,
            categories: [...new Set(cases.flatMap(c => c.tags))].length,
            withReference: cases.filter(c => c.hasReference).length
        }
    };
    
    // Write JSON file for website
    const outputPath = path.join(__dirname, 'docs', 'data', 'cases.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(websiteData, null, 2));
    
    console.log(`✅ Successfully generated data for ${cases.length} cases`);
    console.log(`📊 Stats: ${websiteData.stats.contributors} contributors, ${websiteData.stats.categories} categories`);
    
    if (errors.length > 0) {
        console.log(`⚠️  ${errors.length} errors encountered:`);
        errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log(`💾 Data saved to: ${outputPath}`);
    
    return websiteData;
}

/**
 * Extract tags from case content
 */
function extractTags(title, titleEn, prompt, promptEn) {
    const text = `${title || ''} ${titleEn || ''} ${prompt || ''} ${promptEn || ''}`.toLowerCase();
    
    const tagMap = {
        // Art styles
        'anime': ['anime', 'manga', 'chibi'],
        'pixar': ['pixar', '3d'],
        'ghibli': ['ghibli', 'studio ghibli'],
        'cartoon': ['cartoon', 'toon'],
        'realistic': ['realistic', 'photorealistic', 'photo'],
        'minimalist': ['minimalist', 'minimal'],
        'vintage': ['vintage', 'retro'],
        'steampunk': ['steampunk'],
        
        // Objects/Items
        'figure': ['figure', 'figurine', 'toy', 'collectible'],
        'sticker': ['sticker', 'emoji'],
        'poster': ['poster', 'advertisement', 'ad'],
        'card': ['card', 'trading card'],
        'logo': ['logo', 'brand'],
        'icon': ['icon', 'emoji'],
        
        // Techniques
        'paper-craft': ['paper craft', 'papercraft', 'origami'],
        'pixel-art': ['pixel', '8-bit', 'retro'],
        'portrait': ['portrait', 'selfie', 'face'],
        'isometric': ['isometric', 'iso'],
        'silhouette': ['silhouette'],
        
        // Themes
        'wedding': ['wedding', 'marriage', 'proposal'],
        'business': ['business', 'professional', 'office'],
        'fantasy': ['fantasy', 'magical', 'fairy'],
        'sci-fi': ['sci-fi', 'science fiction', 'futuristic'],
        'food': ['food', 'cooking', 'restaurant'],
        'nature': ['nature', 'landscape', 'outdoor'],
        'architecture': ['building', 'architecture', 'city']
    };
    
    const tags = [];
    
    for (const [tag, keywords] of Object.entries(tagMap)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            tags.push(tag);
        }
    }
    
    // Add special tags based on content analysis
    if (text.includes('chibi') || text.includes('q-version')) tags.push('chibi');
    if (text.includes('3d')) tags.push('3d');
    if (text.includes('2d')) tags.push('2d');
    if (text.includes('black and white') || text.includes('b&w')) tags.push('black-white');
    if (text.includes('color')) tags.push('colorful');
    
    return [...new Set(tags)]; // Remove duplicates
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateWebsiteData();
}