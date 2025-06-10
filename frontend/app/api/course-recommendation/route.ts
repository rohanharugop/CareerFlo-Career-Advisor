// app/api/course-recommendation/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface FlaskResponse {
  result: {
    CourseName: string;
    CourseDescrption: string;
    CourseLink: string;
  };
}

interface CourseRecommendation {
  CourseName: string;
  CourseDescrption: string;
  CourseLink: string;
}

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

    // Call Flask API
    const flaskResponse = await fetch('http://localhost:5000/recommend-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!flaskResponse.ok) {
      const errorText = await flaskResponse.text();
      throw new Error(`Flask server error: ${flaskResponse.status} - ${errorText}`);
    }

    const flaskData: FlaskResponse = await flaskResponse.json();
    
    // Extract the course data from the nested result structure
    const courseData = flaskData.result;

    // Validate that we have the expected course data structure
    if (!courseData.CourseName || !courseData.CourseDescrption || !courseData.CourseLink) {
      console.warn('Incomplete course data received:', courseData);
    }

    // Return the course recommendation data
    return NextResponse.json({
      success: true,

      course: courseData
    });

    // return NextResponse.json(courseData);

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