import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
        { error: 'Unauthorized: Session is invalid or expired' },
        { status: 401 }
      );
    }

    const email = session.user.email;

    const colleges = await request.json();

    if (!Array.isArray(colleges) || colleges.length === 0) {
      return NextResponse.json(
        { error: 'Input must be a non-empty array of colleges' },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const now = new Date().toISOString();
    const collegeRows = colleges.map((college: any) => ({
      email,
      name: college.name || college.College || '',
      course_name:
        college.course_name || college.CourseName || college.Course || '',
      fees: college.fees ?? college.Fees ?? null,
      expected_kcet_cutoff:
        college.expected_kcet_cutoff ??
        college.ExpectedKCETCutoff ??
        college['Average Cutoff'] ??
        null,
      company_names: college.company_names || college.Placement || [],
      created_at: now,
      updated_at: now,
    }));

    // Insert into Supabase
    const { error: insertError } = await supabase.from('college').insert(collegeRows);

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to save colleges', message: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Colleges saved successfully' });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to save colleges',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}