'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  ExternalLink, 
  Save, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Target, 
  Zap,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle,
  XCircle,
  Loader2,
  GraduationCap,
  Star,
  TrendingUp,
  Award,
  FileText,
  Globe
} from 'lucide-react';

interface CourseRecommendation {
  CourseName: string;
  CourseDescrption: string;
  CourseLink: string;
}

interface SavedCourse {
  id: number;
  coursename: string;
  coursedescrption: string;
  courselink: string;
  created_at: string;
  user_id?: string;
}

interface ApiResponse {
  success: boolean;
  course: CourseRecommendation;
  error?: string;
}

interface SaveCourseResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

interface RetrieveCoursesResponse {
  success: boolean;
  courses?: SavedCourse[];
  error?: string;
}

export default function CourseRecommendationPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<CourseRecommendation | null>(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // New state for saved courses
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [showSavedCourses, setShowSavedCourses] = useState(false);
  const [retrieving, setRetrieving] = useState(false);
  const [retrieveMessage, setRetrieveMessage] = useState('');

  // Trigger animation when results are ready
  useEffect(() => {
    if (submitted && recommendation) {
      const timer = setTimeout(() => setShowResults(true), 100);
      return () => clearTimeout(timer);
    } else if (!submitted) {
      setShowResults(false);
    }
  }, [submitted, recommendation]);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendation(null);
    setShowResults(false);
    setSaveMessage('');

    try {
      const response = await fetch('/api/course-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
      } else if (data.success && data.course) {
        setRecommendation(JSON.parse(JSON.stringify(data.course)));
        setSubmitted(true);
      } else {
        setError('No course recommendation received');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async () => {
    if (!recommendation) return;

    setSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch('/api/store-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: {
            coursename: recommendation.CourseName,
            coursedescrption: recommendation.CourseDescrption,
            courselink: recommendation.CourseLink,
          }
        }),
      });

      const data: SaveCourseResponse = await response.json();

      if (data.success) {
        setSaveMessage('Course saved successfully! 🎉');
      } else {
        setSaveMessage(`Failed to save course: ${data.error}`);
      }
    } catch (err: any) {
      setSaveMessage(`Error saving course: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // New function to retrieve saved courses
  const handleRetrieveCourses = async () => {
    setRetrieving(true);
    setRetrieveMessage('');
    
    try {
      const response = await fetch('/api/retrieve-courses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: RetrieveCoursesResponse = await response.json();

      if (data.success && data.courses) {
        setSavedCourses(data.courses);
        setShowSavedCourses(true);
        setRetrieveMessage(`Found ${data.courses.length} saved courses`);
      } else {
        setRetrieveMessage(data.error || 'No courses found');
        setSavedCourses([]);
      }
    } catch (err: any) {
      setRetrieveMessage(`Error retrieving courses: ${err.message}`);
      setSavedCourses([]);
    } finally {
      setRetrieving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setRecommendation(null);
    setError('');
    setPrompt('');
    setShowResults(false);
    setSaveMessage('');
    setShowSavedCourses(false);
    setRetrieveMessage('');
  };

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/health');
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        alert('API route not found - server returned HTML instead of JSON');
        return;
      }
      
      const data = await response.json();
      console.log('Health check:', data);
      alert(`Next.js: ${data.nextjs}, Flask: ${data.status}`);
    } catch (err) {
      console.error('Health check failed:', err);
      alert('Health check failed');
    }
  };

  const renderRecommendation = (course: CourseRecommendation) => {
    return (
      <div className="space-y-8">
        {/* Course Information */}
        <div className="space-y-6">
          <div className="relative overflow-hidden border border-purple-500/30 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
            <div className="relative p-8 space-y-6">
              {/* Course Header */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {course.CourseName}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-purple-300">
                    <Star className="h-4 w-4" />
                    <span>AI Recommended</span>
                  </div>
                </div>
              </div>

              {/* Course Description */}
              {course.CourseDescrption && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <h4 className="text-lg font-semibold text-purple-300">Course Overview</h4>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-gray-200 leading-relaxed">{course.CourseDescrption}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* Course Link */}
                {course.CourseLink && (
                  <a 
                    href={course.CourseLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Access Course
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                )}

                {/* Save Course Button */}
                <Button
                  onClick={handleSaveCourse}
                  disabled={saving}
                  className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Saving Course...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Save Course
                    </>
                  )}
                </Button>
              </div>

              {/* Save Message */}
              {saveMessage && (
                <div className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300 ${
                  saveMessage.includes('successfully') 
                    ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-300' 
                    : 'bg-red-900/30 border-red-500/30 text-red-300'
                }`}>
                  {saveMessage.includes('successfully') ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <span className="font-medium">{saveMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
          <div className="relative flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-indigo-300 font-semibold mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Personalized Recommendation
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                This course has been specifically curated based on your learning goals and interests using advanced AI analysis. 
                Save it to your profile to track your learning journey and access it anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSavedCourses = () => {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Your Learning Library
          </h2>
          <p className="text-gray-400">Courses you've saved for your learning journey</p>
        </div>
        
        <div className="grid gap-6">
          {savedCourses.map((course, index) => (
            <div key={course.id} className="group relative overflow-hidden border border-blue-500/30 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
              <div className="relative p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-blue-300 mb-2 group-hover:text-blue-200 transition-colors duration-300">
                        {course.coursename}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Saved on {new Date(course.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Award className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>

                {course.coursedescrption && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-gray-200 leading-relaxed text-sm">{course.coursedescrption}</p>
                  </div>
                )}

                {course.courselink && (
                  <div className="flex justify-start">
                    <a 
                      href={course.courselink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
                    >
                      <Globe className="h-4 w-4 mr-2 group-hover/link:rotate-12 transition-transform duration-300" />
                      Access Course
                      <ArrowRight className="h-3 w-3 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Foundation Redirect Button */}
      <a
        href="/roadmap/foundation"
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 group flex items-center px-4 py-3 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
      >
        <TrendingUp className="h-4 w-4 mr-1 group-hover:rotate-12 transition-transform duration-300" />
        My colleges
      </a>

      {/* Resume Maker Redirect Button */}
      <a
        href="https://ai-resume-maker-vocq.onrender.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 group flex items-center px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
      >
        <FileText className="h-4 w-4 mr-1 group-hover:rotate-12 transition-transform duration-300" />
        Build My Resume
      </a>

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-8 h-16 flex items-center border-b border-slate-800/50 backdrop-blur-sm">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Course Recommendation
            </span>
          </div>
          <div className="flex items-center space-x-3">
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-6 md:px-8">
            <div className="grid gap-8 items-center">
              {/* Hero Section */}
              <div className="space-y-6 max-w-4xl mx-auto text-center transform transition-all duration-700 ease-out">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-in slide-in-from-top-4 duration-700">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                      Discover The best
                    </span>
                    <br />
                    <span className="text-white">Course for you</span>
                  </h1>
                  <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-top-6 duration-700 delay-200">
                    Transform your style of learning with AI-powered course recommendations. Describe your goals, 
                    and we will help find the perfect course to accelerate your learning journey.
                  </p>
                </div>

                {/* Stats or Features */}
                <div className="flex flex-wrap justify-center gap-6 pt-4 animate-in slide-in-from-bottom-4 duration-700 delay-400">
                  <div className="flex items-center space-x-2 text-purple-300">
                    <Zap className="h-5 w-5" />
                    <span className="text-sm font-medium">AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-300">
                    <Target className="h-5 w-5" />
                    <span className="text-sm font-medium">Personalized</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-300">
                    <Award className="h-5 w-5" />
                    <span className="text-sm font-medium">Quality Curated</span>
                  </div>
                </div>
              </div>

              {/* Retrieve Message */}
              {retrieveMessage && (
                <div className={`max-w-2xl mx-auto flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300 ${
                  retrieveMessage.includes('Found') 
                    ? 'bg-blue-900/30 border-blue-500/30 text-blue-300' 
                    : 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300'
                }`}>
                  {retrieveMessage.includes('Found') ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                  <span className="font-medium">{retrieveMessage}</span>
                </div>
              )}

              {/* Show Saved Courses */}
              {showSavedCourses && savedCourses.length > 0 && (
                <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  {renderSavedCourses()}
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => setShowSavedCourses(false)}
                      variant="outline"
                      className="border-blue-500/50 text-blue-300 hover:bg-blue-600 hover:text-white transition-all duration-300 group"
                    >
                      <EyeOff className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Hide Saved Courses
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Search Form */}
              {!submitted && !showSavedCourses && (
                <div className="mx-auto w-full max-w-3xl animate-in slide-in-from-bottom-4 duration-700 delay-300">
                  <div className="space-y-8">
                    <div className="space-y-3 text-center">
                      <h2 className="text-2xl font-bold text-white flex items-center justify-center">
                        <Search className="h-6 w-6 mr-3 text-purple-400" />
                        What would you like to learn?
                      </h2>
                      <p className="text-gray-400">
                        Describe your learning goals, interests, or specific skills you want to develop
                      </p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
                      <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                        <div className="space-y-6">
                          <div className="relative">
                            <textarea
                              id="prompt"
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="e.g., 'I want to learn web development to build my own startup', 'Machine learning for data analysis', 'Digital marketing to grow my business', or 'Python programming for automation'"
                              className="w-full p-6 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-400 resize-none h-32 text-base leading-relaxed transition-all duration-300"
                              rows={4}
                              disabled={loading}
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                              Press Enter to search • Shift+Enter for new line
                            </div>
                          </div>
                          
                          <Button 
                            onClick={handleSubmit} 
                            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl group" 
                            disabled={loading || !prompt.trim()}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                Analyzing your request...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                                Get AI Course Recommendation
                                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Example Prompts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {[
                        { icon: <Globe className="h-4 w-4" />, text: "Web Development for Beginners" },
                        { icon: <TrendingUp className="h-4 w-4" />, text: "Data Science & Analytics" },
                        { icon: <Sparkles className="h-4 w-4" />, text: "Digital Marketing Strategy" },
                        { icon: <Zap className="h-4 w-4" />, text: "Python Programming" }
                      ].map((example, index) => (
                        <button
                          key={index}
                          onClick={() => setPrompt(`I want to learn ${example.text.toLowerCase()}`)}
                          className="flex items-center space-x-2 p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg transition-all duration-300 text-left text-sm text-gray-300 hover:text-white group"
                        >
                          <span className="text-purple-400 group-hover:scale-110 transition-transform duration-300">
                            {example.icon}
                          </span>
                          <span>{example.text}</span>
                        </button>
                      ))}
                    </div>
                    
                    {error && (
                      <div className="flex items-center space-x-3 p-4 bg-red-900/30 border border-red-500/30 text-red-300 rounded-xl animate-in slide-in-from-bottom-2 duration-300">
                        <XCircle className="h-5 w-5 text-red-400" />
                        <div>
                          <p className="font-medium">Error occurred</p>
                          <p className="text-sm">{error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Results Section */}
              {submitted && !showSavedCourses && (
                <div className="space-y-8">
                  <div className={`text-center transform transition-all duration-700 ease-out ${
                    showResults ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold text-white flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 mr-3 text-emerald-400" />
                        Your Perfect Course Match
                      </h2>
                      <div className="max-w-3xl mx-auto">
                        <p className="text-gray-400 mb-4">Based on your learning goals:</p>
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
                          <div className="flex items-start space-x-3">
                            <Target className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                              <span className="font-medium text-purple-300">Your Query:</span>
                              <p className="text-gray-200 mt-1">{prompt}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className={`max-w-3xl mx-auto flex items-center space-x-3 p-4 bg-red-900/30 border border-red-500/30 text-red-300 rounded-xl transform transition-all duration-500 ease-out delay-200 ${
                      showResults ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      <XCircle className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="font-medium">Error occurred</p>
                        <p className="text-sm">{error}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-8 max-w-5xl mx-auto">
                    {recommendation ? (
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-800 to-blue-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <Card 
                          className={`relative bg-transparent border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform ${
                            showResults 
                              ? 'translate-x-0 opacity-100' 
                              : '-translate-x-full opacity-0'
                          }`}
                          style={{
                            transitionDelay: '300ms'
                          }}
                        >
                          <CardHeader className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm rounded-t-2xl border-b border-slate-700/50">
                            <CardTitle className="text-white text-2xl font-bold flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                                <GraduationCap className="h-5 w-5 text-white" />
                              </div>
                              Course Recommendation
                            </CardTitle>
                            <CardDescription className="text-purple-300 text-lg">
                              AI-curated learning path tailored for your success
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm p-8 rounded-b-2xl">
                            {renderRecommendation(recommendation)}
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-red-800 to-orange-600 rounded-2xl blur-lg opacity-30"></div>
                        <Card className={`relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border-0 shadow-2xl transform transition-all duration-500 ease-out ${
                          showResults ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                        }`}>
                          <CardContent className="text-center py-12">
                            <div className="space-y-4">
                              <XCircle className="h-16 w-16 text-red-400 mx-auto" />
                              <h3 className="text-xl font-semibold text-red-300">No Recommendation Found</h3>
                              <p className="text-gray-400 max-w-md mx-auto">
                                We couldn't find a suitable course match. Please try rephrasing your query with more specific details about your learning goals.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex justify-center mt-12 transform transition-all duration-700 ease-out ${
                    showResults ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} style={{ transitionDelay: '500ms' }}>
                    <Button 
                      onClick={resetForm}
                      className="group bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <RotateCcw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Search for Another Course
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>Powered by AI • Designed for learners • Built for success</p>
          </div>
        </div>
      </footer>
    </div>
  );
}