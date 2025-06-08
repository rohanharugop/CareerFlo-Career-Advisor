'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, RefreshCw } from "lucide-react"

// Types
interface College {
  id: string
  name: string
  course_name: string
  fees: number
  expected_kcet_cutoff: number
  company_names: string[]
  created_at: string
}

export default function SavedColleges() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(false)
  const [showColleges, setShowColleges] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSavedColleges = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/get-saved-colleges')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch colleges')
      }
      
      setColleges(data.colleges)
      setShowColleges(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching colleges:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap size={20} />
            My Saved Colleges
          </CardTitle>
          <CardDescription>View your saved college preferences</CardDescription>
        </div>
        <Button 
          onClick={fetchSavedColleges}
          disabled={loading}
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Load Colleges"}
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            <p className="font-medium">Error loading colleges:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {showColleges && colleges.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No saved colleges found</p>
            <p className="text-sm">Start by saving some colleges to see them here.</p>
          </div>
        )}

        {showColleges && colleges.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {colleges.length} saved college{colleges.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {colleges.map((college) => (
                <Card key={college.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{college.name}</CardTitle>
                    <CardDescription className="font-medium text-blue-600">
                      {college.course_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Fees:</span>
                        <p className="font-medium">₹{college.fees?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">KCET Cutoff:</span>
                        <p className="font-medium">{college.expected_kcet_cutoff || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {college.company_names && college.company_names.length > 0 && (
                      <div>
                        <span className="text-muted-foreground text-sm">Top Recruiters:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {college.company_names.slice(0, 3).map((company, index) => (
                            <span 
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
                            >
                              {company}
                            </span>
                          ))}
                          {college.company_names.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full">
                              +{college.company_names.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Saved on {new Date(college.created_at).toLocaleDateString()}
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