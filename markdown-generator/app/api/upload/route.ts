import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Handle POST requests to /api/upload
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get the uploaded file
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Get the filename
    const filename = formData.get('filename') as string;
    if (!filename) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Define the examples directory path (one level up from project root)
    const projectRoot = path.resolve(process.cwd());
    const examplesDir = path.join(projectRoot, '..', 'examples');
    
    // Ensure the examples directory exists
    if (!existsSync(examplesDir)) {
      await mkdir(examplesDir, { recursive: true });
    }
    
    // Write the file to the examples directory
    const filePath = path.join(examplesDir, filename);
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully',
      path: `./examples/${filename}` 
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 