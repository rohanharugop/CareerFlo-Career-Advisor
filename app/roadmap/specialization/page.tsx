'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CourseRecommendationPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
    setRecommendation('');
    setShowResults(false);

    try {
      const response = await fetch('/api/course-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setRecommendation(data.response);
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setRecommendation('');
    setError('');
    setPrompt('');
    setShowResults(false);
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

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex w-full justify-between">
          <a className="flex items-center justify-center" href="#">
            <span className="font-bold text-xl">Course Recommendation Portal</span>
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
                  Get personalized course recommendations
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-in slide-in-from-top-6 duration-700 delay-200">
                  Describe your interests, goals, or specific topics you'd like to explore. Our AI will recommend the perfect courses for your learning journey.
                  <br />
                </p>
              </div>
              
              {!submitted ? (
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
                      {loading ? 'Getting Recommendations...' : 'Get Course Recommendations'}
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
                    <h2 className="text-2xl font-bold">Here are your personalized course recommendations</h2>
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
                              Recommended Courses
                            </CardTitle>
                            <CardDescription className="text-purple-300 text-base">
                              Tailored recommendations based on your interests and goals
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="bg-black p-6">
                            <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-base">
                              {recommendation}
                            </div>
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
                            <p className="text-purple-200">No recommendations found. Please try with a different query.</p>
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
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}