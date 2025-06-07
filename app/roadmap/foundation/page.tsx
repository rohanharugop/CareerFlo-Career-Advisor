"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
  budget: string;
  background: string;
}

export default function Foundation() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    interest: "",
    kcetRank: "",
    budget: "",
    background: ""
  })
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResults, setShowResults] = useState(false)

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
    return formData.interest.trim() || formData.kcetRank.trim() || formData.budget.trim() || formData.background.trim()
  }

  const formatFormDataForAPI = () => {
    const parts = []
    if (formData.interest.trim()) parts.push(`Interest: ${formData.interest}`)
    if (formData.kcetRank.trim()) parts.push(`KCET Rank: ${formData.kcetRank}`)
    if (formData.budget.trim()) parts.push(`Budget: ${formData.budget}`)
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
      budget: "",
      background: ""
    })
    setShowResults(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex w-full justify-between">
          <a className="flex items-center justify-center" href="#">
            <span className="font-bold text-xl">Student Portal</span>
          </a>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkHealth}
            className="text-xs"
          >
            Check Connection
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="space-y-4 max-w-3xl mx-auto text-center transform transition-all duration-700 ease-out">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-in slide-in-from-top-4 duration-700">
                  Find the right college or university for you
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-in slide-in-from-top-6 duration-700 delay-200">
                  Search for colleges and universities that match your interests and career goals. Our personalized roadmap will guide you through the process.
                  <br />
                </p>
              </div>
              
              {!submitted ? (
                <div className="mx-auto w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-700 delay-300">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="goal" className="text-lg font-medium text-center block">
                        Tell us about your preferences
                      </label>
                      <p className="text-sm text-gray-500 text-center">
                        Fill in to get personalized college recommendations
                      </p>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="interest" className="text-sm font-medium">
                          Interest/Field of Study
                        </label>
                        <Input
                          id="interest"
                          placeholder="e.g., Computer Science, Mechanical Engineering, Medicine"
                          value={formData.interest}
                          onChange={(e) => handleInputChange('interest', e.target.value)}
                          disabled={loading}
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="kcetRank" className="text-sm font-medium">
                          KCET Rank
                        </label>
                        <Input
                          id="kcetRank"
                          placeholder="e.g., 5000, 15000"
                          value={formData.kcetRank}
                          onChange={(e) => handleInputChange('kcetRank', e.target.value)}
                          disabled={loading}
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="budget" className="text-sm font-medium">
                          Budget (Annual Fees)
                        </label>
                        <Input
                          id="budget"
                          placeholder="e.g., ₹50,000, ₹2 lakhs, Under 1 lakh"
                          value={formData.budget}
                          onChange={(e) => handleInputChange('budget', e.target.value)}
                          disabled={loading}
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="background" className="text-sm font-medium">
                          Background/Category
                        </label>
                        <Input
                          id="background"
                          placeholder="e.g., General, SC/ST, OBC, Rural, Urban"
                          value={formData.background}
                          onChange={(e) => handleInputChange('background', e.target.value)}
                          disabled={loading}
                          className="h-12"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full h-12 text-base" 
                      disabled={loading || !isFormValid()}
                    >
                      {loading ? 'Searching...' : 'Find College Courses'}
                    </Button>
                  </div>
                  
                  {error && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded animate-in slide-in-from-bottom-2 duration-300">
                      <p className="font-medium">Error:</p>
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`text-center transform transition-all duration-700 ease-out ${
                    showResults ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}>
                    <h2 className="text-2xl font-bold">Here's a list of College Courses and Programs</h2>
                    <div className="mt-4">
                      <p className="text-gray-500 mb-2">Based on your criteria:</p>
                      <ul className="text-sm text-white space-y-1 max-w-md mx-auto">
                        {formData.interest.trim() && (
                          <li className="flex items-center justify-center">
                            <span className="font-medium text-white">Interest:</span>
                            <span className="ml-2">{formData.interest}</span>
                          </li>
                        )}
                        {formData.kcetRank.trim() && (
                          <li className="flex items-center justify-center">
                            <span className="font-medium text-white">KCET Rank:</span>
                            <span className="ml-2">{formData.kcetRank}</span>
                          </li>
                        )}
                        {formData.budget.trim() && (
                          <li className="flex items-center justify-center">
                            <span className="font-medium text-white">Budget:</span>
                            <span className="ml-2">{formData.budget}</span>
                          </li>
                        )}
                        {formData.background.trim() && (
                          <li className="flex items-center justify-center">
                            <span className="font-medium text-white">Background:</span>
                            <span className="ml-2">{formData.background}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  {error && (
                    <div className={`max-w-2xl mx-auto mb-4 p-4 bg-red-100 border border-purple-400 text-red-700 rounded transform transition-all duration-500 ease-out delay-200 ${
                      showResults ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      <p className="font-medium">Error:</p>
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
                    {colleges.length > 0 ? (
                      colleges.map((college, index) => (
                        <div key={index} className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-800 to-purple-600 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                          <Card 
                            className={`relative bg-black border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform ${
                              showResults 
                                ? 'translate-x-0 opacity-100' 
                                : '-translate-x-full opacity-0'
                            }`}
                            style={{
                              transitionDelay: `${300 + (index * 150)}ms`
                            }}
                          >
                            <CardHeader className="bg-black">
                              <CardTitle className="text-white text-xl font-bold">{college.name || `College ${index + 1}`}</CardTitle>
                              <CardDescription className="text-purple-300 text-base">{college.CourseName || 'Course information'}</CardDescription>
                            </CardHeader>
                            <CardContent className="bg-black">
                              <p className="mb-4 text-purple-200 text-lg">{college.CourseName}</p>
                              <ul className="list-disc list-inside space-y-3 text-base">
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Fees:</span> {college.Fees ? `₹${college.Fees.toLocaleString('en-IN')}` : 'Not specified'}
                                </li>
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Expected KCET Cutoff:</span> {college.ExpectedKCETCutoff || 'Not specified'}
                                </li>
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Placement Companies:</span> {college.CompanyNames?.length ? college.CompanyNames.join(', ') : 'Not specified'}
                                </li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      ))
                    ) : (
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-800 to-purple-600 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <Card className={`relative bg-black border-0 shadow-lg transform transition-all duration-500 ease-out ${
                          showResults ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                        }`}>
                          <CardContent className="text-center py-8 bg-black">
                            <p className="text-purple-200">No colleges found matching your criteria. Please try with different search terms.</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex justify-center mt-8 transform transition-all duration-700 ease-out ${
                    showResults ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} style={{ transitionDelay: `${500 + (colleges.length * 150)}ms` }}>
                    <Button 
                      onClick={resetForm}
                      className="bg-purple-900 hover:bg-purple-500 transition-colors-text duration-300"
                    >
                      Search Again
                    </Button>
                  </div>

                  {/* Save Colleges Button */}
                  <div className={`flex justify-center mt-4 transform transition-all duration-700 ease-out ${
                    showResults ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
                  }`} style={{ transitionDelay: `${600 + (colleges.length * 150)}ms` }}>
                    <Button
                      className="bg-green-700 hover:bg-green-600 text-white"
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
                          } else {
                            alert(data.error || 'Failed to save colleges');
                          }
                        } catch (err) {
                          alert('Failed to save colleges');
                        }
                      }}
                    >
                      Save Colleges
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