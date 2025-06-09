// For App Router (/app/api/save-course/route.ts)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, courseName, courseDescription, courseLink } = body;

    // Validate required fields
    if (!email || !courseName) {
      return NextResponse.json(
        { success: false, error: 'Email and course name are required' },
        { status: 400 }
      );
    }

    // Insert course into database
    const { data, error } = await supabase
      .from('courses')
      .insert([
        {
          email: email,
          coursename: courseName,
          coursedescrption: courseDescription || null,
          courselink: courseLink || null,
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save course to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Course saved successfully',
      data: data
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

