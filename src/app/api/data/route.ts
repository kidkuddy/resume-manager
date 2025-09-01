import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ResumeData } from '@/types';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/resume.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(DATA_FILE_PATH, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    // If file doesn't exist or is corrupt, return default structure
    const defaultData: ResumeData = {
      experiences: [],
      projects: [],
      certifications: [],
      activities: [],
      skills: [],
      education: [],
      templates: []
    };
    
    // Try to create the file with default data
    try {
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(defaultData, null, 2));
    } catch (writeError) {
      console.error('Could not create data file:', writeError);
    }
    
    return NextResponse.json(defaultData);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ResumeData = await request.json();
    
    // Validate the data structure
    const requiredFields = ['experiences', 'projects', 'certifications', 'activities', 'skills', 'education', 'templates'];
    for (const field of requiredFields) {
      if (!Array.isArray(data[field as keyof ResumeData])) {
        return NextResponse.json(
          { error: `Invalid data structure: ${field} must be an array` },
          { status: 400 }
        );
      }
    }
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    
    // Write data to file
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
