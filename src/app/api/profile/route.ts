import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Profile } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'resume.json');

async function loadData() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist, return empty structure
    return {
      profile: null,
      experiences: [],
      projects: [],
      certifications: [],
      activities: [],
      skills: [],
      education: [],
      templates: []
    };
  }
}

async function saveData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await loadData();
    return NextResponse.json(data.profile);
  } catch (error) {
    console.error('Error loading profile:', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json();
    const data = await loadData();
    
    const now = new Date().toISOString();
    const profile: Profile = {
      ...profileData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    data.profile = profile;
    await saveData(data);
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const updates = await request.json();
    const data = await loadData();
    
    if (!data.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    const updatedProfile: Profile = {
      ...data.profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    data.profile = updatedProfile;
    await saveData(data);
    
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const data = await loadData();
    data.profile = null;
    await saveData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
}
