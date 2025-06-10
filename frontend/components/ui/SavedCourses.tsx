'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, RefreshCw, ExternalLink } from "lucide-react"

// Types
interface Course {
  id: string
  email: string
  coursename: string
  coursedescrption: string | null
  courselink: string | null
  created_at: string
}

export default function SavedCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [showCourses, setShowCourses] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSavedCourses = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/get-saved-courses')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch courses')
      }
      
      setCourses(data.courses)
      setShowCourses(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            My Saved Courses
          </CardTitle>
          <CardDescription>View your saved course preferences</CardDescription>
        </div>
        <Button 
          onClick={fetchSavedCourses}
          disabled={loading}
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Load Courses"}
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            <p className="font-medium">Error loading courses:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {showCourses && courses.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No saved courses found</p>
            <p className="text-sm">Start by saving some courses to see them here.</p>
          </div>
        )}

        {showCourses && courses.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {courses.length} saved course{courses.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">
                      {course.coursename}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.coursedescrption && (
                      <div>
                        <span className="text-muted-foreground text-sm">Description:</span>
                        <p className="text-sm mt-1 line-clamp-3">
                          {course.coursedescrption}
                        </p>
                      </div>
                    )}
                    
                    {course.courselink && (
                      <Button size="sm" className="w-full" asChild>
                        <a 
                          href={course.courselink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                          View Course
                        </a>
                      </Button>
                    )}
                    
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Saved on {new Date(course.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}