// app/api/profiles/[id]/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
)

interface UpdateProfileData {
  name?: string
  age?: number
  gender?: string
  education_status?: string
  stream?: string
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the profile ID from the URL params
    const profileId = params.id

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(profileId)) {
      return NextResponse.json(
        { error: 'Invalid profile ID format' },
        { status: 400 }
      )
    }

    // Parse request body
    const body: UpdateProfileData = await request.json()

    // Validate that at least one field is provided
    const allowedFields = ['name', 'age', 'gender', 'education_status', 'stream']
    const updateFields = Object.keys(body).filter(key => allowedFields.includes(key))
    
    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'At least one field must be provided for update' },
        { status: 400 }
      )
    }

    // Validate age if provided
    if (body.age !== undefined && (body.age < 0 || body.age > 150)) {
      return NextResponse.json(
        { error: 'Age must be between 0 and 150' },
        { status: 400 }
      )
    }

    // Prepare update data with updated_at timestamp
    const updateData = {
      ...body,
      updated_at: new Date().toISOString()
    }

    // Update the profile in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', profileId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      
      // Handle specific error cases
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Return the updated profile
    return NextResponse.json({
      message: 'Profile updated successfully',
      data: data
    })

  } catch (error) {
    console.error('API error:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: Add PATCH method as an alternative to PUT
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // PATCH can use the same logic as PUT for partial updates
  return PUT(request, { params })
}