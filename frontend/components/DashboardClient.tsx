"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from"@/components/Separator"
import { 
  Home, 
  User, 
  BookOpen, 
  LogOut, 
  GraduationCap, 
  Building2,
  FileText,
  MapPin,
  Calendar,
  Mail,
  School,
  Trophy,
  Target,
  ArrowRight,
  ExternalLink,
  Star,
  Users,
  BookMarked,
  UserCircle,
  Sparkles
} from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import SavedCollegesSection from "@/components/SavedCollegesSection"
import EditProfileModal from "@/components/EditProfileModal"

interface Profile {
  id: string
  name: string
  age: number
  gender: string
  education_status: string
  stream?: string
  institution?: string
}

interface DashboardClientProps {
  initialProfile: Profile
  userEmail: string
  savedColleges: any[]
  savedCourses: any[]
  handleSignOut: () => Promise<void>
}

export default function DashboardClient({ 
  initialProfile, 
  userEmail, 
  savedColleges, 
  savedCourses, 
  handleSignOut 
}: DashboardClientProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile)

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Student Portal
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Your academic journey starts here
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-muted-foreground">Online</span>
            </div>
            <ThemeToggle />
            <Separator orientation="vertical" className="h-6" />
            <form action={handleSignOut}>
              <Button type="submit" variant="ghost" className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors">
                <LogOut size={18} />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Enhanced Sidebar */}
        <aside className="hidden md:flex w-72 flex-col border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold text-lg">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{profile.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{profile.education_status}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Navigation
              </div>
              
              <Button variant="secondary" className="w-full justify-start h-11 font-medium shadow-sm" asChild>
                <a href="/dashboard" className="flex items-center gap-3">
                  <Home size={18} />
                  <span>Dashboard</span>
                  <Badge variant="secondary" className="ml-auto">Current</Badge>
                </a>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start h-11 hover:bg-muted/80 transition-colors" asChild>
                <a href="/profile" className="flex items-center gap-3">
                  <User size={18} />
                  <span>Profile</span>
                </a>
              </Button>
              
              <Separator className="my-4" />
              
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Academic Tools
              </div>
              
              <Button variant="ghost" className="w-full justify-start h-11 hover:bg-muted/80 transition-colors" asChild>
                <a href="/roadmap/foundation" className="flex items-center gap-3">
                  <Building2 size={18} />
                  <span>College Suggestions</span>
                  <ArrowRight size={14} className="ml-auto opacity-50" />
                </a>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start h-11 hover:bg-muted/80 transition-colors" asChild>
                <a href="/roadmap/specialization" className="flex items-center gap-3">
                  <BookMarked size={18} />
                  <span>Course Recommendations</span>
                  <ArrowRight size={14} className="ml-auto opacity-50" />
                </a>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start h-11 hover:bg-muted/80 transition-colors" asChild>
                <a href="https://ai-resume-maker-vocq.onrender.com/" className="flex items-center gap-3">
                  <FileText size={18} />
                  <span>Resume Builder</span>
                  <ExternalLink size={14} className="ml-auto opacity-50" />
                </a>
              </Button>
            </nav>
          </div>
          
          {/* Sidebar Footer */}
          <div className="mt-auto p-6 border-t bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy size={16} />
              <span>Academic Year 2024-25</span>
            </div>
          </div>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Welcome back, {profile.name}!
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <a href="/roadmap">
                    <Target size={18} />
                    Build Roadmap
                  </a>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-500/20">
                      <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {savedColleges?.length || 0}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Saved Colleges</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-500/20">
                      <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {savedCourses?.length || 0}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">Enrolled Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-purple-500/20">
                      <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">92%</p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Profile Complete</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Profile Information */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-orange-500/20">
                      <UserCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-orange-800 dark:text-orange-200 flex items-center gap-2">
                        <Sparkles size={20} className="text-orange-600 dark:text-orange-400" />
                        Profile Information
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1 text-orange-600 dark:text-orange-400">
                        <Mail size={14} />
                        {userEmail}
                      </CardDescription>
                    </div>
                  </div>
                  <EditProfileModal 
                    profile={profile} 
                    onProfileUpdate={handleProfileUpdate}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-orange-800 dark:text-orange-200">
                        <Users size={18} className="text-orange-600 dark:text-orange-400" />
                        Personal Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-100/70 dark:bg-orange-900/30 border border-orange-200/50 dark:border-orange-800/50">
                          <span className="text-orange-700 dark:text-orange-300 font-medium">Full Name</span>
                          <span className="font-semibold text-orange-900 dark:text-orange-100">{profile.name}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-100/70 dark:bg-orange-900/30 border border-orange-200/50 dark:border-orange-800/50">
                          <span className="text-orange-700 dark:text-orange-300 font-medium">Age</span>
                          <Badge variant="secondary" className="bg-orange-200 text-orange-800 border-orange-300 dark:bg-orange-800 dark:text-orange-200 dark:border-orange-700">{profile.age} years</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-100/70 dark:bg-orange-900/30 border border-orange-200/50 dark:border-orange-800/50">
                          <span className="text-orange-700 dark:text-orange-300 font-medium">Gender</span>
                          <span className="font-semibold text-orange-900 dark:text-orange-100">{profile.gender}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-orange-800 dark:text-orange-200">
                        <School size={18} className="text-orange-600 dark:text-orange-400" />
                        Educational Background
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-100/70 dark:bg-orange-900/30 border border-orange-200/50 dark:border-orange-800/50">
                          <span className="text-orange-700 dark:text-orange-300 font-medium">Status</span>
                          <Badge variant="outline" className="bg-orange-200/70 text-orange-800 border-orange-400 dark:bg-orange-800/70 dark:text-orange-200 dark:border-orange-600">
                            {profile.education_status}
                          </Badge>
                        </div>
                        {profile.stream && (
                          <div className="flex items-center justify-between p-3 rounded-lg bg-orange-100/70 dark:bg-orange-900/30 border border-orange-200/50 dark:border-orange-800/50">
                            <span className="text-orange-700 dark:text-orange-300 font-medium">Stream</span>
                            <span className="font-semibold text-orange-900 dark:text-orange-100">{profile.stream}</span>
                          </div>
                        )}
                        {profile.institution && (
                          <div className="flex items-center justify-between p-3 rounded-lg bg-orange-100/70 dark:bg-orange-900/30 border border-orange-200/50 dark:border-orange-800/50">
                            <span className="text-orange-700 dark:text-orange-300 font-medium">Institution</span>
                            <span className="font-semibold flex items-center gap-2 text-orange-900 dark:text-orange-100">
                              <MapPin size={14} className="text-orange-600 dark:text-orange-400" />
                              {profile.institution}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Saved Colleges Section */}
            <SavedCollegesSection savedColleges={savedColleges} />

            {/* Enhanced Saved Courses Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-indigo-500/20">
                    <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                      <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
                      Your Learning Journey
                    </CardTitle>
                    <CardDescription className="text-indigo-600 dark:text-indigo-400">
                      Courses you have saved or enrolled in
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {savedCourses && savedCourses.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {savedCourses.map((course) => (
                        <Card key={course.id} className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-indigo-500 hover:border-l-indigo-600 bg-white/70 dark:bg-indigo-950/30 border-indigo-200/50 dark:border-indigo-800/50">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-indigo-500/10 flex-shrink-0">
                                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-indigo-900 dark:text-indigo-100">
                                  {course.coursename}
                                </h4>
                                {course.coursedescrption && (
                                  <p className="text-sm text-indigo-700 dark:text-indigo-300 line-clamp-3 mb-4">
                                    {course.coursedescrption}
                                  </p>
                                )}
                              </div>
                            </div>
                            {course.courselink && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-700 dark:group-hover:bg-indigo-900/50 dark:group-hover:border-indigo-700 dark:group-hover:text-indigo-300 transition-colors border-indigo-300 text-indigo-700 dark:border-indigo-700 dark:text-indigo-300" 
                                asChild
                              >
                                <a href={course.courselink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                  <span>View Course</span>
                                  <ExternalLink size={14} />
                                </a>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="p-4 rounded-full bg-indigo-100/70 dark:bg-indigo-900/50 w-fit mx-auto mb-6">
                        <GraduationCap className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-indigo-800 dark:text-indigo-200">Start Your Learning Journey</h3>
                      <p className="text-indigo-600 dark:text-indigo-400 mb-6">
                        Discover courses tailored to your interests and career goals
                      </p>
                      <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                        <a href="/roadmap/specialization">
                          <BookOpen size={18} />
                          Explore Courses
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Enhanced Mobile Navigation */}
      <div className="md:hidden flex border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button variant="secondary" className="flex-1 flex flex-col items-center py-3 h-auto min-w-0 rounded-none border-r" asChild>
          <a href="/dashboard">
            <Home size={20} />
            <span className="text-xs mt-1 font-medium">Dashboard</span>
          </a>
        </Button>
        <Button variant="ghost" className="flex-1 flex flex-col items-center py-3 h-auto min-w-0 rounded-none border-r" asChild>
          <a href="/profile">
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Button>
        <Button variant="ghost" className="flex-1 flex flex-col items-center py-3 h-auto min-w-0 rounded-none border-r" asChild>
          <a href="/courses">
            <BookOpen size={20} />
            <span className="text-xs mt-1">Courses</span>
          </a>
        </Button>
        <Button variant="ghost" className="flex-1 flex flex-col items-center py-3 h-auto min-w-0 rounded-none" asChild>
          <a href="/roadmap">
            <Target size={20} />
            <span className="text-xs mt-1">Roadmap</span>
          </a>
        </Button>
      </div>
    </div>
  )
}