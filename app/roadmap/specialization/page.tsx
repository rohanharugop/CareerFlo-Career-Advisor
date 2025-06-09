'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    if (e.key === 'Enter' && !loading) {
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
      <div className="space-y-6">
        {/* Course Information */}
        <div className="space-y-4">
          <div className="border border-purple-800 rounded-lg p-6 bg-gray-900">
            <div className="space-y-4">
              {/* Course Name */}
              <div>
                <h3 className="text-2xl font-bold text-purple-300 mb-2">
                  {course.CourseName}
                </h3>
              </div>

              {/* Course Description */}
              {course.CourseDescrption && (
                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Course Description
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{course.CourseDescrption}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-700 flex flex-col sm:flex-row gap-3">
                {/* Course Link */}
                {course.CourseLink && (
                  <a 
                    href={course.CourseLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Access Course
                  </a>
                )}

                {/* Save Course Button */}
                <Button
                  onClick={handleSaveCourse}
                  disabled={saving}
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save Course
                    </>
                  )}
                </Button>
              </div>

              {/* Save Message */}
              {saveMessage && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  saveMessage.includes('successfully') 
                    ? 'bg-green-900/50 border border-green-700 text-green-300' 
                    : 'bg-red-900/50 border border-red-700 text-red-300'
                }`}>
                  {saveMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="h-6 w-6 text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-purple-300 font-medium mb-1">Recommendation Note</h4>
              <p className="text-gray-300 text-sm">
                This course has been specifically selected based on your learning goals and interests. 
                You can save it to your profile for future reference.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSavedCourses = () => {
    return (
      <div className="space-y-4">
        {savedCourses.map((course, index) => (
          <div key={course.id} className="border border-blue-800 rounded-lg p-6 bg-gray-900">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-blue-300 mb-2">
                  {course.coursename}
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  Saved on: {new Date(course.created_at).toLocaleDateString()}
                </p>
              </div>

              {course.coursedescrption && (
                <div>
                  <p className="text-gray-300 leading-relaxed">{course.coursedescrption}</p>
                </div>
              )}

              {course.courselink && (
                <div className="pt-2">
                  <a 
                    href={course.courselink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Access Course
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex w-full justify-between">
          <a className="flex items-center justify-center" href="#">
            <span className="font-bold text-xl">Course Recommendation Portal</span>
          </a>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkHealth}
              className="text-xs"
            >
              Check Connection
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetrieveCourses}
              disabled={retrieving}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            >
              {retrieving ? (
                <>
                  <svg className="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  My Courses
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="space-y-4 max-w-3xl mx-auto text-center transform transition-all duration-700 ease-out">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-in slide-in-from-top-4 duration-700">
                  Get personalized course recommendations
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-in slide-in-from-top-6 duration-700 delay-200">
                  Describe your interests, goals, or specific topics you'd like to explore. Our AI will recommend the perfect course for your learning journey.
                  <br />
                </p>
              </div>

              {/* Retrieve Message */}
              {retrieveMessage && (
                <div className={`max-w-2xl mx-auto p-3 rounded-lg text-sm text-center ${
                  retrieveMessage.includes('Found') 
                    ? 'bg-blue-900/50 border border-blue-700 text-blue-300' 
                    : 'bg-yellow-900/50 border border-yellow-700 text-yellow-300'
                }`}>
                  {retrieveMessage}
                </div>
              )}

              {/* Show Saved Courses */}
              {showSavedCourses && savedCourses.length > 0 && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-blue-300 mb-2">Your Saved Courses</h2>
                    <p className="text-gray-400 text-sm">Courses you've saved for future reference</p>
                  </div>
                  {renderSavedCourses()}
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => setShowSavedCourses(false)}
                      variant="outline"
                      className="border-blue-600 text-blue-300 hover:bg-blue-600 hover:text-white"
                    >
                      Hide Saved Courses
                    </Button>
                  </div>
                </div>
              )}
              
              {!submitted && !showSavedCourses ? (
                <div className="mx-auto w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-700 delay-300">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="prompt" className="text-lg font-medium text-center block">
                        What would you like to learn?
                      </label>
                      <p className="text-sm text-gray-500 text-center">
                        Describe your learning goals and interests in detail
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., 'I want to learn web development to build my own startup', 'Machine learning for data analysis', 'Digital marketing to grow my business', or 'Python programming for automation'"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-32 text-base"
                        rows={4}
                        disabled={loading}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full h-12 text-base" 
                      disabled={loading || !prompt.trim()}
                    >
                      {loading ? 'Getting Recommendations...' : 'Get Course Recommendation'}
                    </Button>
                  </div>
                  
                  {error && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded animate-in slide-in-from-bottom-2 duration-300">
                      <p className="font-medium">Error:</p>
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              ) : submitted && !showSavedCourses ? (
                <div className="space-y-6">
                  <div className={`text-center transform transition-all duration-700 ease-out ${
                    showResults ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}>
                    <h2 className="text-2xl font-bold">Here is your personalized course recommendation</h2>
                    <div className="mt-4">
                      <p className="text-gray-500 mb-2">Based on your request:</p>
                      <div className="text-sm text-white max-w-2xl mx-auto bg-gray-800 p-3 rounded-lg">
                        <span className="font-medium text-purple-300">Your Query:</span>
                        <span className="ml-2 text-gray-200">{prompt}</span>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className={`max-w-2xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded transform transition-all duration-500 ease-out delay-200 ${
                      showResults ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      <p className="font-medium">Error:</p>
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
                    {recommendation ? (
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-800 to-purple-600 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <Card 
                          className={`relative bg-black border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform ${
                            showResults 
                              ? 'translate-x-0 opacity-100' 
                              : '-translate-x-full opacity-0'
                          }`}
                          style={{
                            transitionDelay: '300ms'
                          }}
                        >
                          <CardHeader className="bg-black">
                            <CardTitle className="text-white text-xl font-bold flex items-center">
                              <svg className="h-6 w-6 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              Course Recommendation
                            </CardTitle>
                            <CardDescription className="text-purple-300 text-base">
                              Tailored recommendation based on your interests and goals
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="bg-black p-6">
                            {renderRecommendation(recommendation)}
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-800 to-purple-600 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <Card className={`relative bg-black border-0 shadow-lg transform transition-all duration-500 ease-out ${
                          showResults ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                        }`}>
                          <CardContent className="text-center py-8 bg-black">
                            <p className="text-purple-200">No recommendation found. Please try with a different query.</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex justify-center mt-8 transform transition-all duration-700 ease-out ${
                    showResults ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} style={{ transitionDelay: '500ms' }}>
                    <Button 
                      onClick={resetForm}
                      className="bg-purple-900 hover:bg-purple-500 transition-colors duration-300"
                    >
                      Search Again
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}