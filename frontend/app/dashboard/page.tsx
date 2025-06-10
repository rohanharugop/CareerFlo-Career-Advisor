import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import DashboardClient from "@/components/DashboardClient"

export default async function Dashboard() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
  const { data: savedColleges } = await supabase.from("college").select("*").eq("email", session.user.email).order("created_at", { ascending: false }).limit(3)
  const { data: savedCourses } = await supabase.from("courses").select("*").eq("email", session.user.email).limit(3)

  // If no profile, redirect to questionnaire
  if (!profile) {
    redirect("/questionnaire")
  }

  // Server action for sign out
  async function handleSignOut() {
    "use server"
    const supabase = createClient()
    try {
      await supabase.auth.signOut({ scope: 'global' })
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      cookieStore.getAll().forEach(cookie => {
        if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
          cookieStore.delete(cookie.name)
        }
      })
    } catch (error) {
      console.error('Sign out error:', error)
    }
    revalidatePath('/', 'layout')
    revalidatePath('/dashboard', 'page')
    redirect("/")
  }

  return (
    <DashboardClient
      initialProfile={profile}
      userEmail={session.user.email!}
      savedColleges={savedColleges || []}
      savedCourses={savedCourses || []}
      handleSignOut={handleSignOut}
    />
  )
}