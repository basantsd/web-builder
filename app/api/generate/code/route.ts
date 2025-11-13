// API Route: Generate Code with AI

import { NextRequest, NextResponse } from 'next/server';
import { aiRouter } from '@/lib/ai/ai-router';
import { TaskType } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, taskType, qualityLevel, projectDNA } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const taskT = (taskType as TaskType) || 'code_generation';
    const quality = qualityLevel || 'standard';

    // Build system prompt with project context
    const systemPrompt = projectDNA
      ? `You are an expert software engineer. Generate high-quality code following these project standards:

**Tech Stack:**
- Framework: ${projectDNA.techStack.frontend.framework}
- Language: ${projectDNA.techStack.frontend.language}
- Styling: ${projectDNA.techStack.frontend.styling}

**Coding Standards:**
- Naming conventions: ${JSON.stringify(projectDNA.architecture.namingConventions)}
- Code style: ${JSON.stringify(projectDNA.codingStandards.codeStyle)}

Generate clean, production-ready code that follows these standards.`
      : 'You are an expert software engineer. Generate clean, production-ready code.';

    // Use AI router to generate code
    const response = await aiRouter.chat(
      {
        type: taskT,
        qualityLevel: quality,
      },
      {
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }
    );

    return NextResponse.json({
      success: true,
      code: response.content,
      usage: response.usage,
      model: response.model,
      provider: response.provider,
    });
  } catch (error: any) {
    console.error('Error generating code:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate code',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
