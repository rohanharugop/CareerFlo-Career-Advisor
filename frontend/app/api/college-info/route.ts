// app/api/college-info/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;
    
    console.log('Received prompt:', prompt);
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // For now, let's return mock data to test the connection
    // const mockResponse = {
    //   college: {
    //     name: "Test College",
    //     CourseName: "Computer Science Engineering",
    //     Fees: 150000,
    //     ExpectedKCETCutoff: 5000,
    //     Placement: ["TCS", "Infosys", "Wipro"]
    //   }
    // };

    // Uncomment this section when Flask server is ready

    const flaskResponse = await fetch('http://localhost:5000/college-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!flaskResponse.ok) {
      throw new Error(`Flask server error: ${flaskResponse.status}`);
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data);


    // Return mock data for testing
    // return NextResponse.json(flaskResponse);
    
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