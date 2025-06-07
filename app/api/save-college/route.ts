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
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Session is invalid or expired' },
        { status: 401 }
      );
    }

    const colleges = await request.json();

    if (!Array.isArray(colleges) || colleges.length === 0) {
      return NextResponse.json(
        { error: 'Input must be a non-empty array of colleges' },
        { status: 400 }
      );
    }

    // TODO: Save the colleges array to your database or storage here.

    return NextResponse.json({ message: 'Colleges saved successfully', colleges });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to save colleges',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}