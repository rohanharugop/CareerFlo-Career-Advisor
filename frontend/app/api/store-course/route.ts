// app/api/store-course/route.ts (for App Router)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CourseData {
  coursename: string;
  coursedescrption?: string;
  courselink?: string;
}

interface RequestBody {
  course: CourseData;
}

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client and get session
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Check session validity
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Session is invalid or expired' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    const body: RequestBody = await request.json();
    const { course } = body;

    if (!course || !course.coursename) {
      return NextResponse.json(
        { success: false, error: 'Course name is required' },
        { status: 400 }
      );
    }

    // Insert course into Supabase
    const { data, error } = await supabase
      .from('courses')
      .insert({
        email: userEmail,
        coursename: course.coursename,
        coursedescrption: course.coursedescrption || null,
        courselink: course.courselink || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to store course' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Course stored successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}