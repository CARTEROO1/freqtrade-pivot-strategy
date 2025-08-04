import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { description, jobTitle, companyName } = await request.json();

    if (!description || !jobTitle || !companyName) {
      return NextResponse.json(
        { error: 'Description, job title, and company name are required' },
        { status: 400 }
      );
    }

    const enhancedDescription = await aiService.enhanceJobDescription(
      description, 
      jobTitle, 
      companyName
    );

    return NextResponse.json({ 
      success: true,
      enhancedDescription 
    });

  } catch (error) {
    console.error('Error in description enhancement API:', error);
    
    if (error instanceof Error && error.message.includes('API key not configured')) {
      return NextResponse.json(
        { 
          error: 'AI service not configured. Please set up Moonshot API key.',
          enhancedDescription: null 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to enhance description',
        enhancedDescription: null 
      },
      { status: 500 }
    );
  }
} 