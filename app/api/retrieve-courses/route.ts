// Example API route structure you'll need to create
export async function GET() {
  try {
    // Your Supabase query to get courses for the current user
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', userId) // if you have user authentication
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json({
      success: true,
      courses: courses
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
  }
}