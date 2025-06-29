"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import SavedCollegesSection from "@/components/SavedCollegesSection"
import { createClient } from "@/lib/supabase/client"
import {
  GraduationCap,
  Search,
  ArrowLeft,
  ArrowRight,
  Home,
  BookOpen,
  DollarSign,
  TrendingUp,
  Building2,
  RefreshCw,
  Bookmark,
  User,
  Hash,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

interface College {
  name: string
  CourseName: string
  Fees: number
  ExpectedKCETCutoff: number
  CompanyNames: string[]
}

interface CollegeResponse {
  college: College
}

interface FormData {
  interest: string
  kcetRank: string
  description: string
  background: string
}

export default function Foundation() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    interest: "",
    kcetRank: "",
    description: "",
    background: "General",
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
        const {
          data: { session },
        } = await supabase.auth.getSession()

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
        console.error("Error fetching saved colleges:", error)
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const isFormValid = () => {
    return (
      formData.interest.trim() || formData.kcetRank.trim() || formData.description.trim() || formData.background.trim()
    )
  }

  const formatFormDataForAPI = () => {
    const parts = []
    if (formData.interest.trim()) parts.push(`Interest: ${formData.interest}`)
    if (formData.kcetRank.trim()) parts.push(`KCET Rank: ${formData.kcetRank}`)
    if (formData.description.trim()) parts.push(`Description: ${formData.description}`)
    if (formData.background.trim()) parts.push(`Background: ${formData.background}`)
    return parts.join(", ")
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    setShowResults(false)

    try {
      const userInput = formatFormDataForAPI()

      const response = await fetch("/api/college-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      })

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("Non-JSON response:", textResponse)
        throw new Error("Server returned HTML instead of JSON. Check if API route exists.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch college information")
      }

      // Normalize response to always be an array of colleges
      if (Array.isArray(data)) {
        console.log("Received array of colleges:", data)
        setColleges(data)
      } else if (data.colleges && Array.isArray(data.colleges)) {
        // If backend returns { colleges: [...] }
        console.log("Received colleges array in object:", data.colleges)
        setColleges(data.colleges)
      } else if (data.college) {
        // If backend returns { college: {...} }
        console.log("Received single college in object:", data.college)
        setColleges([data.college])
      } else if (data.College) {
        // If backend returns { College: {...} }
        console.log("Received single College in object:", data.College)
        setColleges([data.College])
      } else if (typeof data === "object" && Object.keys(data).length > 0) {
        // If backend returns a single college object directly
        console.log("Received single college object:", data)
        setColleges([data])
      } else if (typeof data === "string") {
        // If Flask returns raw text, show it as an error or parse it
        console.log("Raw response from Flask:", data)
        setError("Received text response from server. Please check Flask server response format.")
      } else {
        // If the response is different format, handle accordingly
        console.log("Unexpected response format:", data)
        setError("Received unexpected response format from server")
      }

      setSubmitted(true)
    } catch (err) {
      console.error("Error fetching college info:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch college information")
    } finally {
      setLoading(false)
    }
  }

  const checkHealth = async () => {
    try {
      const response = await fetch("/api/health")

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("Non-JSON response:", textResponse)
        alert("API route not found - server returned HTML instead of JSON")
        return
      }

      const data = await response.json()
      console.log("Health check:", data)
      alert(`Next.js: ${data.nextjs}, Flask: ${data.status}`)
    } catch (err) {
      console.error("Health check failed:", err)
      alert("Health check failed")
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
      background: "General",
    })
    setShowResults(false)
  }

  const refreshSavedColleges = async () => {
    setLoadingSavedColleges(true)
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

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
      console.error("Error refreshing saved colleges:", error)
    } finally {
      setLoadingSavedColleges(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      {/* Back to Roadmap Button */}
      <div className="fixed top-1/2 left-6 transform -translate-y-1/2 z-50">
        <Button
          className="bg-slate-800/90 backdrop-blur-sm border border-purple-400/50 hover:border-purple-300 hover:bg-purple-900/30 text-white px-4 py-3 rounded-xl shadow-xl transition-all duration-300 hover:shadow-purple-500/20 hover:scale-105"
          onClick={() => (window.location.href = "/roadmap")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back to Roadmap</span>
        </Button>
      </div>

      {/* Go to Specialization Button */}
      <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50">
        <Button
          className="bg-slate-800/90 backdrop-blur-sm border border-blue-400/50 hover:border-blue-300 hover:bg-blue-900/30 text-white px-4 py-3 rounded-xl shadow-xl transition-all duration-300 hover:shadow-blue-500/20 hover:scale-105"
          onClick={() => (window.location.href = "/roadmap/specialization")}
        >
          <span className="font-medium">Specialization</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/50">
        <div className="flex w-full justify-between">
          <a className="flex items-center justify-center" href="#">
            <Button
              className="bg-slate-800/90 backdrop-blur-sm border border-purple-400/50 hover:border-purple-300 hover:bg-purple-900/30 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/20"
              onClick={() => (window.location.href = "/dashboard")}
            >
              <Home className="w-5 h-5 mr-3" />
              <span className="font-semibold text-lg">Dashboard</span>
            </Button>
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-20 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 items-center">
              <div className="space-y-8 max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered College Recommendations
                </div>
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Find Your Perfect College Match
                </h1>
                <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                  Discover colleges and universities tailored to your interests, goals, and academic profile. Our
                  intelligent system provides personalized recommendations to guide your educational journey.
                </p>
              </div>

              {/* Saved Colleges Section */}
              {!loadingSavedColleges && (
                <div className="max-w-6xl mx-auto w-full mb-12">
                  <SavedCollegesSection savedColleges={savedColleges} />
                </div>
              )}

              {!submitted ? (
                <div className="mx-auto w-full max-w-4xl">
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
                    <CardHeader className="text-center pb-8">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-white mb-3">
                        Tell Us About Your Preferences
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-lg">
                        Share your academic interests and goals to receive personalized college recommendations
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-8">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                          <label htmlFor="interest" className="flex items-center text-sm font-semibold text-slate-300">
                            <BookOpen className="w-4 h-4 mr-2 text-purple-400" />
                            Interest/Field of Study
                          </label>
                          <Input
                            id="interest"
                            placeholder="e.g., Mathematics, Computer Science, AI"
                            value={formData.interest}
                            onChange={(e) => handleInputChange("interest", e.target.value)}
                            disabled={loading}
                            className="h-12 bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-purple-400 focus:ring-purple-400/20 rounded-lg"
                          />
                        </div>

                        <div className="space-y-3">
                          <label htmlFor="kcetRank" className="flex items-center text-sm font-semibold text-slate-300">
                            <Hash className="w-4 h-4 mr-2 text-blue-400" />
                            KCET Rank
                          </label>
                          <Input
                            id="kcetRank"
                            placeholder="e.g., 1000, 5000, 15000"
                            value={formData.kcetRank}
                            onChange={(e) => handleInputChange("kcetRank", e.target.value)}
                            disabled={loading}
                            className="h-12 bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-purple-400 focus:ring-purple-400/20 rounded-lg"
                          />
                        </div>

                        <div className="space-y-3">
                          <label
                            htmlFor="description"
                            className="flex items-center text-sm font-semibold text-slate-300"
                          >
                            <FileText className="w-4 h-4 mr-2 text-green-400" />
                            Description
                          </label>
                          <Input
                            id="description"
                            placeholder="Tell us about your preferences, goals, or specific requirements"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            disabled={loading}
                            className="h-12 bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-purple-400 focus:ring-purple-400/20 rounded-lg"
                          />
                        </div>

                        <div className="space-y-3">
                          <label
                            htmlFor="background"
                            className="flex items-center text-sm font-semibold text-slate-300"
                          >
                            <User className="w-4 h-4 mr-2 text-orange-400" />
                            Background/Category
                          </label>
                          <Select
                            value={formData.background}
                            onValueChange={(value) => handleInputChange("background", value)}
                            disabled={loading}
                          >
                            <SelectTrigger className="h-12 bg-slate-900/50 border-slate-600 text-white focus:border-purple-400 focus:ring-purple-400/20 rounded-lg">
                              <SelectValue placeholder="Select your category" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="General" className="text-white hover:bg-slate-700">
                                General
                              </SelectItem>
                              <SelectItem value="SC/ST" className="text-white hover:bg-slate-700">
                                SC/ST
                              </SelectItem>
                              <SelectItem value="OBC" className="text-white hover:bg-slate-700">
                                OBC
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                          onClick={handleSubmit}
                          className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 rounded-xl shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]"
                          disabled={loading || !isFormValid()}
                        >
                          {loading ? (
                            <>
                              <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                              Analyzing Your Preferences...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 mr-3" />
                              Get AI College Suggestions
                            </>
                          )}
                        </Button>
                    </CardContent>
                  </Card>

                  {error && (
                    <Card className="mt-6 bg-red-900/20 border-red-500/50">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-red-300 mb-1">Error Occurred</p>
                            <p className="text-red-400">{error}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="space-y-12">
                  <div
                    className={`text-center transition-all duration-700 ${
                      showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium mb-6">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Analysis Complete
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-8">Your Personalized College Recommendations</h2>
                    <div className="max-w-3xl mx-auto">
                      <p className="text-slate-400 mb-6 text-lg">Based on your academic profile and preferences:</p>
                      <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
                        <CardContent className="p-6 space-y-4">
                          {formData.interest.trim() && (
                            <div className="flex justify-between items-center py-2">
                              <div className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-2 text-purple-400" />
                                <span className="font-semibold text-purple-300">Interest:</span>
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-purple-500/20 text-purple-200 border-purple-500/30"
                              >
                                {formData.interest}
                              </Badge>
                              
                            </div>
                          )}
                          {formData.kcetRank.trim() && (
                            <div className="flex justify-between items-center py-2">
                              <div className="flex items-center">
                                <Hash className="w-4 h-4 mr-2 text-blue-400" />
                                <span className="font-semibold text-blue-300">KCET Rank:</span>
                              </div>
                              <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-500/30">
                                {formData.kcetRank}
                              </Badge>
                            </div>
                          )}
                          {formData.description.trim() && (
                            <div className="flex justify-between items-center py-2">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-green-400" />
                                <span className="font-semibold text-green-300">Description:</span>
                              </div>
                              <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-500/30">
                                {formData.description}
                              </Badge>
                            </div>
                          )}
                          {formData.background.trim() && (
                            <div className="flex justify-between items-center py-2">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-orange-400" />
                                <span className="font-semibold text-orange-300">Background:</span>
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-orange-500/20 text-orange-200 border-orange-500/30"
                              >
                                {formData.background}
                              </Badge>
                              
                            </div>
                          )}
                          <Badge
                                variant="secondary"
                                className="bg-purple-500/20 text-purple-200 border-purple-500/30"
                              >
                                <span className="text-xs">Note: The AI can make mistakes. Please check official sources for clarification.</span>
                              </Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {error && (
                    <Card
                      className={`max-w-3xl mx-auto bg-red-900/20 border-red-500/50 transition-all duration-700 ${
                        showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-red-300 mb-1">Error Occurred</p>
                            <p className="text-red-400">{error}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex flex-col space-y-8 max-w-5xl mx-auto">
                    {colleges.length > 0 ? (
                      colleges.map((college, index) => (
                        <Card
                          key={index}
                          className={`bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 ${
                            showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                          }`}
                          style={{
                            transitionDelay: `${200 + index * 150}ms`,
                          }}
                        >
                          <CardHeader className="pb-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-white text-2xl font-bold mb-2 flex items-center">
                                  <GraduationCap className="w-6 h-6 mr-3 text-purple-400" />
                                  {college.name || `College ${index + 1}`}
                                </CardTitle>
                                <CardDescription className="text-purple-300 text-lg font-medium">
                                  {college.CourseName || "Course information"}
                                </CardDescription>
                              </div>
                              <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 border-purple-500/30">
                                #{index + 1}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                              <div className="flex items-center space-x-3 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                  <DollarSign className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                  <p className="text-sm text-slate-400 font-medium">Annual Fees</p>
                                  <p className="text-white font-bold text-lg">
                                    {college.Fees ? `₹${college.Fees.toLocaleString("en-IN")}` : "Not specified"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                  <TrendingUp className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-sm text-slate-400 font-medium">KCET Cutoff</p>
                                  <p className="text-white font-bold text-lg">
                                    {college.ExpectedKCETCutoff || "Not specified"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50 md:col-span-1">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                  <Building2 className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm text-slate-400 font-medium mb-2">Top Recruiters</p>
                                  <div className="flex flex-wrap gap-1">
                                    {college.CompanyNames?.length ? (
                                      college.CompanyNames.slice(0, 3).map((company, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-xs bg-purple-500/10 text-purple-200 border-purple-500/30"
                                        >
                                          {company}
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-slate-500 text-sm">Not specified</span>
                                    )}
                                    {college.CompanyNames?.length > 3 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-slate-500/10 text-slate-300 border-slate-500/30"
                                      >
                                        +{college.CompanyNames.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card
                        className={`bg-slate-800/50 backdrop-blur-sm border-slate-700/50 transition-all duration-700 ${
                          showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                      >
                        <CardContent className="text-center py-16">
                          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-slate-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-slate-300 mb-2">No Colleges Found</h3>
                          <p className="text-slate-400 text-lg mb-1">No colleges match your current criteria.</p>
                          <p className="text-slate-500 text-sm">
                            Try adjusting your search parameters for better results.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div
                    className={`flex flex-col sm:flex-row gap-6 justify-center items-center mt-16 transition-all duration-700 ${
                      showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${400 + colleges.length * 150}ms` }}
                  >
                    <Button
                      onClick={resetForm}
                      className="bg-slate-700/80 hover:bg-slate-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 hover:scale-105 shadow-lg"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Search Again</span>
                    </Button>

                    <Button
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 hover:scale-105 shadow-lg hover:shadow-green-500/25"
                      disabled={colleges.length === 0}
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/save-college", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(colleges),
                          })
                          if (res.redirected) {
                            window.location.href = res.url
                            return
                          }
                          const data = await res.json()
                          if (res.ok) {
                            alert("Colleges saved successfully!")
                            // Refresh saved colleges after saving
                            await refreshSavedColleges()
                          } else {
                            alert(data.error || "Failed to save colleges")
                          }
                        } catch (err) {
                          alert("Failed to save colleges")
                        }
                      }}
                    >
                      <Bookmark className="w-5 h-5" />
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
