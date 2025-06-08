// app/api/recommend-course/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic } = body;
    
    console.log('Received topic:', topic);
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Call Flask API
    const flaskResponse = await fetch('http://localhost:5000/recommend-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    if (!flaskResponse.ok) {
      // Handle Flask API errors
      const errorData = await flaskResponse.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: errorData.error || `Flask server error: ${flaskResponse.status}`,
          message: errorData.message || 'Failed to get course recommendation'
        },
        { status: flaskResponse.status }
      );
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data);
    console.log('API Response:', data); // Debug log

    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}