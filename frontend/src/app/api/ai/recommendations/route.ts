import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { userProfile, jobs } = await request.json();

    if (!userProfile || !jobs) {
      return NextResponse.json(
        { error: 'User profile and jobs are required' },
        { status: 400 }
      );
    }

    const recommendations = await aiService.getJobRecommendations(userProfile, jobs);

    return NextResponse.json({ 
      success: true,
      recommendations 
    });

  } catch (error) {
    console.error('Error in AI recommendations API:', error);
    
    if (error instanceof Error && error.message.includes('API key not configured')) {
      return NextResponse.json(
        { 
          error: 'AI service not configured. Please set up Moonshot API key.',
          recommendations: [] 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to get AI recommendations',
        recommendations: [] 
      },
      { status: 500 }
    );
  }
} 