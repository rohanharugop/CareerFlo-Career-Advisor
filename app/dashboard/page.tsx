import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, User, BookOpen, Edit, LogOut } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import SavedCollegesSection from "@/components/SavedCollegesSection"

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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b sticky top-0 z-10 bg-background">
        <div className="flex w-full justify-between items-center">
          <a className="flex items-center justify-center" href="#">
            <span className="font-bold text-xl">Student Portal</span>
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action={handleSignOut}>
              <Button type="submit" variant="ghost" className="flex items-center gap-2">
                <LogOut size={18} />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r p-4 bg-background">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/dashboard" className="flex items-center gap-2">
                <Home size={18} />
                Dashboard
              </a>
            </Button>
            <Button variant="secondary" className="w-full justify-start" asChild>
              <a href="/profile" className="flex items-center gap-2">
                <User size={18} />
                Profile
              </a>
            </Button>
            
            
            {/* Divider */}
            <div className="h-px bg-border my-2"></div>
            
            {/* Additional options */}
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/roadmap/foundation" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building">
                  <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                  <path d="M9 22v-4h6v4" />
                  <path d="M8 6h.01" />
                  <path d="M16 6h.01" />
                  <path d="M12 6h.01" />
                  <path d="M12 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 10h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 10h.01" />
                  <path d="M8 14h.01" />
                </svg>
                College Suggestions
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/roadmap/specialization" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks">
                  <path d="m3 17 2 2 4-4" />
                  <path d="m3 7 2 2 4-4" />
                  <path d="M13 6h8" />
                  <path d="M13 12h8" />
                  <path d="M13 18h8" />
                </svg>
                Course Recommendations
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/resume-builder" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                  <line x1="10" x2="8" y1="9" y2="9" />
                </svg>
                Resume Builder
              </a>
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Welcome, {profile.name}!</h1>

            {/* Profile Information */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your personal details</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Edit size={16} />
                  Edit Profile
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Personal Details</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Name</div>
                        <div className="font-medium">{profile.name}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Age</div>
                        <div className="font-medium">{profile.age}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Gender</div>
                        <div className="font-medium">{profile.gender}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Email</div>
                        <div className="font-medium">{session.user.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Educational Background</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Status</div>
                        <div className="font-medium">{profile.education_status}</div>
                      </div>
                      {profile.stream && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-muted-foreground">Stream</div>
                          <div className="font-medium">{profile.stream}</div>
                        </div>
                      )}
                      {profile.institution && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-muted-foreground">Institution</div>
                          <div className="font-medium">{profile.institution}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Colleges Section with Toggle */}
            <SavedCollegesSection savedColleges={savedColleges} />

            {/* Bottom centered Build Roadmap button */}
            <div className="flex justify-center mt-20 mb-12">
              <Button size="lg" className="px-8" asChild>
                <a href="/roadmap">Build Roadmap</a>
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden flex border-t bg-background overflow-x-auto">
        <Button variant="ghost" className="flex-1 flex flex-col items-center py-2 h-16 min-w-16" asChild>
          <a href="/dashboard">
            <Home size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
        </Button>
        <Button variant="ghost" className="flex-1 flex flex-col items-center py-2 h-16 min-w-16" asChild>
          <a href="/profile">
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Button>
        <Button variant="ghost" className="flex-1 flex flex-col items-center py-2 h-16 min-w-16" asChild>
          <a href="/courses">
            <BookOpen size={20} />
            <span className="text-xs mt-1">Courses</span>
          </a>
        </Button>
        <Button variant="ghost" className="flex-1 flex flex-col items-center py-2 h-16 min-w-16" asChild>
          <a href="/roadmap">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
            <span className="text-xs mt-1">More</span>
          </a>
        </Button>
      </div>
    </div>
  )
}