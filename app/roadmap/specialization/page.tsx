"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Course {
  CourseName: string;
  CourseDescrption: string;
  CourseLink: string;
}

export default function Specialization() {
  const [submitted, setSubmitted] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState<Course | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userInput.trim()) {
      setError("Please enter your interests and career goals")
      return
    }

    setLoading(true)
    setError("")
    
    try {
      const response = await fetch('/api/recommend-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: userInput }),
      })

      // Check if response is HTML (common when server is down)
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response received:', text.substring(0, 200))
        throw new Error('Server returned non-JSON response. Make sure your Flask server is running on port 5000.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`)
      }

      console.log('API Response:', data) // Debug log

      // Parse the response from your Flask API - expecting single course
      if (data.response && data.response.CourseName) {
        setCourse(data.response)
        setSubmitted(true)
      } else {
        console.error('Unexpected response format:', data)
        throw new Error('Invalid response format from server')
      }
      
    } catch (err) {
      console.error('Error fetching course recommendations:', err)
      if (err instanceof Error) {
        if (err.message.includes('fetch')) {
          setError('Unable to connect to server. Please make sure your Flask API is running.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setCourse(null)
    setError("")
    setUserInput("")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-black-500 via-black-400 to-black-600 text-green">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex w-full justify-between">
          <a className="flex items-center justify-center" href="#">
            <span className="font-bold text-xl text-white">Student Portal</span>
          </a>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="space-y-4 max-w-3xl mx-auto text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-900">
                  Find the best online courses and programs for your specialization
                </h1>
                <p className="text-black-900 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tell us your interests and career goals, and we'll help you find the right online courses and programs to enhance your skills.
                  <br />
                </p>
              </div>
              
              {!submitted ? (
                <div className="mx-auto w-full max-w-xl">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="goal" className="text-sm font-medium text-white">
                        Find the right courses and programs for your specialization
                      </label>
                      <Input
                        id="goal"
                        placeholder="Enter your interests, career goals, and any specific skills you want to develop."
                        className="w-full p-4 h-24 bg-white/10 border-2 border-purple-400/50 text-white placeholder:text-gray-300"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    
                    {error && (
                      <div className="text-red-400 text-sm text-center">
                        {error}
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-300 hover:bg-purple-500 text-black border-2 border-purple-900"
                      disabled={loading}
                    >
                      {loading ? "Finding Courses..." : "Find College courses"}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Here's an online course we found for you</h2>
                    <p className="text-gray-300 mt-2">
                      Based on your criteria: <span className="font-medium text-white">{userInput}</span>
                    </p>
                  </div>
                  
                  {course ? (
                    <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
                      <Card className="relative bg-black border-0 shadow-lg transform transition-all duration-500 ease-out">
                        <CardHeader className="bg-black">
                          <CardTitle className="text-white text-xl font-bold">
                            {course.CourseName}
                          </CardTitle>
                          <CardDescription className="text-purple-300 text-base">
                            {course.CourseDescrption}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="bg-black">
                          <p className="mb-4 text-purple-200 text-lg">
                            {course.CourseDescrption}
                          </p>
                          
                          <p className="text-sm font-medium mb-2 text-white">Learn more:</p>
                          <div className="flex flex-col space-y-1">
                            <a 
                              href={course.CourseLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-purple-300 hover:text-green-400 text-sm underline"
                            >
                              Check it out
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center text-gray-300">
                      <p>No course found. Please try with different keywords.</p>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-8">
                    <Button 
                      onClick={handleReset} 
                      className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500"
                    >
                      Search Again
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