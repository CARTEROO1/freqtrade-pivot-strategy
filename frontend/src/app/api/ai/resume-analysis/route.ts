import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    const analysis = await aiService.analyzeResume(resumeText);

    return NextResponse.json({ 
      success: true,
      analysis 
    });

  } catch (error) {
    console.error('Error in resume analysis API:', error);
    
    if (error instanceof Error && error.message.includes('API key not configured')) {
      return NextResponse.json(
        { 
          error: 'AI service not configured. Please set up Moonshot API key.',
          analysis: null 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to analyze resume',
        analysis: null 
      },
      { status: 500 }
    );
  }
} 