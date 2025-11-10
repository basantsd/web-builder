// API Route: Create Project with DNA Generation

import { NextRequest, NextResponse } from 'next/server';
import { dnaGenerator } from '@/lib/ai/dna-generator';
import { ProjectSetupForm } from '@/types/project';

export async function POST(request: NextRequest) {
  try {
    const body: ProjectSetupForm = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Generate Project DNA using AI
    const dna = await dnaGenerator.generateProjectDNA(body);

    // In a real app, you would:
    // 1. Save to database
    // 2. Create initial project structure
    // 3. Generate starter files
    // For now, just return the DNA

    return NextResponse.json({
      success: true,
      project: {
        id: dna.projectId,
        name: body.name,
        description: body.description,
        dna,
      },
      message: 'Project DNA generated successfully',
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      {
        error: 'Failed to create project',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
