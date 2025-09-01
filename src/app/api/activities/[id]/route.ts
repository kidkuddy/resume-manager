import { NextRequest, NextResponse } from 'next/server';
import { dataManager } from '@/lib/data-manager';
import { z } from 'zod';

const ActivityUpdateSchema = z.object({
  title: z.string().min(1),
  organization: z.string().min(1),
  type: z.enum(['volunteering', 'speaking', 'mentoring', 'community', 'other']),
  role: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  location: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  impact: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = ActivityUpdateSchema.parse(body);
    
    const activity = await dataManager.updateActivity(params.id, validatedData);
    return NextResponse.json(activity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid activity data', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Failed to update activity:', error);
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dataManager.deleteActivity(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete activity:', error);
    return NextResponse.json(
      { error: 'Failed to delete activity' },
      { status: 500 }
    );
  }
}
