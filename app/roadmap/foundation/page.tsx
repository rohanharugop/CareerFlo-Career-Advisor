"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SavedCollegesSection from "@/components/SavedCollegesSection"
import { createClient } from "@/lib/supabase/client"

interface College {
  name: string;
  CourseName: string;
  Fees: number;
  ExpectedKCETCutoff: number;
  CompanyNames: string[];
}

interface CollegeResponse {
  college: College;
}

interface FormData {
  interest: string;
  kcetRank: string;
  description: string;
  background: string;
}

export default function Foundation() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    interest: "",
    kcetRank: "",
    description: "",
    background: ""
  })
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [savedColleges, setSavedColleges] = useState<any[]>([])
  const [loadingSavedColleges, setLoadingSavedColleges] = useState(true)

  // Fetch saved colleges on component mount
  useEffect(() => {
    const fetchSavedColleges = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          const { data: savedCollegesData } = await supabase
            .from("college")
            .select("*")
            .eq("email", session.user.email)
            .order("created_at", { ascending: false })
            .limit(3)
          
          setSavedColleges(savedCollegesData || [])
        }
      } catch (error) {
        console.error('Error fetching saved colleges:', error)
      } finally {
        setLoadingSavedColleges(false)
      }
    }

    fetchSavedColleges()
  }, [])

  // Trigger animation when results are ready
  useEffect(() => {
    if (submitted && colleges.length > 0) {
      const timer = setTimeout(() => setShowResults(true), 100)
      return () => clearTimeout(timer)
    } else if (!submitted) {
      setShowResults(false)
    }
  }, [submitted, colleges.length])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isFormValid = () => {
    return formData.interest.trim() || formData.kcetRank.trim() || formData.description.trim() || formData.background.trim()
  }

  const formatFormDataForAPI = () => {
    const parts = []
    if (formData.interest.trim()) parts.push(`Interest: ${formData.interest}`)
    if (formData.kcetRank.trim()) parts.push(`KCET Rank: ${formData.kcetRank}`)
    if (formData.description.trim()) parts.push(`Description: ${formData.description}`)
    if (formData.background.trim()) parts.push(`Background: ${formData.background}`)
    return parts.join(', ')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    setShowResults(false)
    
    try {
      const userInput = formatFormDataForAPI()
      
      const response = await fetch('/api/college-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
      })

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned HTML instead of JSON. Check if API route exists.');
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch college information')
      }
      
      // Normalize response to always be an array of colleges
      if (Array.isArray(data)) {
        console.log('Received array of colleges:', data)
        setColleges(data)
      } else if (data.colleges && Array.isArray(data.colleges)) {
        // If backend returns { colleges: [...] }
        console.log('Received colleges array in object:', data.colleges)
        setColleges(data.colleges)
      } else if (data.college) {
        // If backend returns { college: {...} }
        console.log('Received single college in object:', data.college)
        setColleges([data.college])
      } else if (data.College) {
        // If backend returns { College: {...} }
        console.log('Received single College in object:', data.College)
        setColleges([data.College])
      } else if (typeof data === 'object' && Object.keys(data).length > 0) {
        // If backend returns a single college object directly
        console.log('Received single college object:', data)
        setColleges([data])
      } else if (typeof data === 'string') {
        // If Flask returns raw text, show it as an error or parse it
        console.log('Raw response from Flask:', data)
        setError('Received text response from server. Please check Flask server response format.')
      } else {
        // If the response is different format, handle accordingly
        console.log('Unexpected response format:', data)
        setError('Received unexpected response format from server')
      }
      
      setSubmitted(true)
    } catch (err) {
      console.error('Error fetching college info:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch college information')
    } finally {
      setLoading(false)
    }
  }

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/health')
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        alert('API route not found - server returned HTML instead of JSON');
        return;
      }
      
      const data = await response.json()
      console.log('Health check:', data)
      alert(`Next.js: ${data.nextjs}, Flask: ${data.status}`)
    } catch (err) {
      console.error('Health check failed:', err)
      alert('Health check failed')
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setColleges([])
    setError("")
    setFormData({
      interest: "",
      kcetRank: "",
      description: "",
      background: ""
    })
    setShowResults(false)
  }

  const refreshSavedColleges = async () => {
    setLoadingSavedColleges(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data: savedCollegesData } = await supabase
          .from("college")
          .select("*")
          .eq("email", session.user.email)
          .order("created_at", { ascending: false })
          .limit(3)
        
        setSavedColleges(savedCollegesData || [])
      }
    } catch (error) {
      console.error('Error refreshing saved colleges:', error)
    } finally {
      setLoadingSavedColleges(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Back to Roadmap Button */}
      <div className="fixed top-1/2 left-6 transform -translate-y-1/2 z-50">
        <Button
          className="bg-gray-900 border border-purple-400 hover:border-purple-300 hover:bg-purple-900/20 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200"
          onClick={() => window.location.href = "/roadmap"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Roadmap</span>
        </Button>
      </div>

      {/* Go to Specialization Button */}
      <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50">
        <Button
          className="bg-gray-900 border border-blue-400 hover:border-blue-300 hover:bg-blue-900/20 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200"
          onClick={() => window.location.href = "/roadmap/specialization"}
        >
          <span className="font-medium">Specialization</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </div>

      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex w-full justify-between">
          <a className="flex items-center justify-center" href="#">
            <Button
              className="bg-gray-900 border border-purple-400 hover:border-purple-300 hover:bg-purple-900/20 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200"
              onClick={() => window.location.href = "/dashboard"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold text-lg">Dashboard</span>  
            </Button>
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-8 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 items-center">
              <div className="space-y-6 max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
                  Find the right college or university for you
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  Search for colleges and universities that match your interests and career goals. Our personalized roadmap will guide you through the process.
                </p>
              </div>
              
              {/* Saved Colleges Section */}
              {!loadingSavedColleges && (
                <div className="max-w-4xl mx-auto w-full mb-8">
                  <SavedCollegesSection savedColleges={savedColleges} />
                </div>
              )}
              
              {!submitted ? (
                <div className="mx-auto w-full max-w-2xl">
                  <div className="space-y-8">
                    <div className="space-y-3 text-center">
                      <h2 className="text-2xl font-semibold text-white">
                        Tell us about your preferences
                      </h2>
                      <p className="text-gray-400">
                        Fill in to get personalized college recommendations
                      </p>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="interest" className="text-sm font-medium text-gray-300">
                          Interest/Field of Study
                        </label>
                        <Input
                          id="interest"
                          placeholder="e.g., Computer Science, Mechanical Engineering, Medicine"
                          value={formData.interest}
                          onChange={(e) => handleInputChange('interest', e.target.value)}
                          disabled={loading}
                          className="h-12 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="kcetRank" className="text-sm font-medium text-gray-300">
                          KCET Rank
                        </label>
                        <Input
                          id="kcetRank"
                          placeholder="e.g., 5000, 15000"
                          value={formData.kcetRank}
                          onChange={(e) => handleInputChange('kcetRank', e.target.value)}
                          disabled={loading}
                          className="h-12 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-300">
                          Description
                        </label>
                        <Input
                          id="description"
                          placeholder="e.g., Tell us more about your preferences, goals, or specific requirements"
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          disabled={loading}
                          className="h-12 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="background" className="text-sm font-medium text-gray-300">
                          Background/Category
                        </label>
                        <Input
                          id="background"
                          placeholder="e.g., General, SC/ST, OBC, Rural, Urban"
                          value={formData.background}
                          onChange={(e) => handleInputChange('background', e.target.value)}
                          disabled={loading}
                          className="h-12 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-400"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full h-12 text-base bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200 disabled:opacity-50" 
                      disabled={loading || !isFormValid()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {loading ? 'Searching...' : 'Find College Courses'}
                    </Button>
                  </div>
                  
                  {error && (
                    <div className="mt-6 p-4 bg-red-900/20 border border-red-600 text-red-400 rounded-lg">
                      <p className="font-medium">Error:</p>
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  <div className={`text-center transition-all duration-500 ${
                    showResults ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <h2 className="text-3xl font-bold text-white mb-6">College Courses and Programs</h2>
                    <div className="max-w-2xl mx-auto">
                      <p className="text-gray-400 mb-4">Based on your criteria:</p>
                      <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                        {formData.interest.trim() && (
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-purple-300">Interest:</span>
                            <span className="text-white">{formData.interest}</span>
                          </div>
                        )}
                        {formData.kcetRank.trim() && (
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-purple-300">KCET Rank:</span>
                            <span className="text-white">{formData.kcetRank}</span>
                          </div>
                        )}
                        {formData.description.trim() && (
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-purple-300">Description:</span>
                            <span className="text-white">{formData.description}</span>
                          </div>
                        )}
                        {formData.background.trim() && (
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-purple-300">Background:</span>
                            <span className="text-white">{formData.background}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className={`max-w-2xl mx-auto mb-6 p-4 bg-red-900/20 border border-red-600 text-red-400 rounded-lg transition-all duration-500 ${
                      showResults ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <p className="font-medium">Error:</p>
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
                    {colleges.length > 0 ? (
                      colleges.map((college, index) => (
                        <Card 
                          key={index}
                          className={`bg-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300 ${
                            showResults 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 translate-y-4'
                          }`}
                          style={{
                            transitionDelay: `${100 + (index * 100)}ms`
                          }}
                        >
                          <CardHeader className="pb-4">
                            <CardTitle className="text-white text-xl font-bold">{college.name || `College ${index + 1}`}</CardTitle>
                            <CardDescription className="text-purple-300 text-base">{college.CourseName || 'Course information'}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <div>
                                  <p className="text-sm text-gray-400">Fees</p>
                                  <p className="text-white font-medium">{college.Fees ? `₹${college.Fees.toLocaleString('en-IN')}` : 'Not specified'}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <div>
                                  <p className="text-sm text-gray-400">KCET Cutoff</p>
                                  <p className="text-white font-medium">{college.ExpectedKCETCutoff || 'Not specified'}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-2 md:col-span-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <div>
                                  <p className="text-sm text-gray-400">Placement Companies</p>
                                  <p className="text-white font-medium text-sm leading-relaxed">
                                    {college.CompanyNames?.length ? college.CompanyNames.join(', ') : 'Not specified'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card className={`bg-gray-900 border-gray-700 transition-all duration-500 ${
                        showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}>
                        <CardContent className="text-center py-12">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-1.007-6-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <p className="text-gray-400 text-lg">No colleges found matching your criteria.</p>
                          <p className="text-gray-500 text-sm mt-2">Please try with different search terms.</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  
                  {/* Action Buttons - Centered */}
                  <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 transition-all duration-500 ${
                    showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`} style={{ transitionDelay: `${300 + (colleges.length * 100)}ms` }}>
                    
                    <Button 
                      onClick={resetForm}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Search Again</span>
                    </Button>

                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                      disabled={colleges.length === 0}
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/save-college', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(colleges),
                          });
                          if (res.redirected) {
                            window.location.href = res.url;
                            return;
                          }
                          const data = await res.json();
                          if (res.ok) {
                            alert('Colleges saved successfully!');
                            // Refresh saved colleges after saving
                            await refreshSavedColleges();
                          } else {
                            alert(data.error || 'Failed to save colleges');
                          }
                        } catch (err) {
                          alert('Failed to save colleges');
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span>Save Colleges</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}