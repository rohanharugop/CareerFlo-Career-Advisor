"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Specialization() {
  const [submitted, setSubmitted] = useState(false)
  const [userInput, setUserInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-black-500 via-black-4 00 to-black-600 text-green">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex w-full justify-between">
          <a className="flex items-center justify-center" href="#">
            <span className="font-bold text-xl text-">Student Portal</span>
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
                      />
                    </div>
                    <Button type="submit" className="w-full bg-purple-300 hover:bg-purple-500 text-black border-2 border-purple-900">
                      Find College courses
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Here's a list of Online courses we found for you</h2>
                    <p className="text-gray-300 mt-2">
                      Based on your criteria: <span className="font-medium text-white">{userInput}</span>
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
                   <Card className={`relative bg-black border-0 shadow-lg transform transition-all duration-500 ease-out `}>
                       <CardHeader className="bg-black">
                              <CardTitle className="text-white text-xl font-bold">Course Name</CardTitle>
                              <CardDescription className="text-purple-300 text-base">Course description in 1 line</CardDescription>
                            </CardHeader>
                            <CardContent className="bg-black">
                              <p className="mb-4 text-purple-200 text-lg">Course name</p>
                              <ul className="list-disc list-inside space-y-3 text-base">
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Some additional info:</span>                                </li>
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Some additional info</span>                                 </li>
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Some additional info</span>                                 </li>
                              </ul>
                          <p className="text-sm font-medium mb-2 text-white">Learn more:</p>
                          <div className="flex flex-col space-y-1">
                            <a href="https://msrit.edu/" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-green-400 text-sm underline">
                              Check it out
                            </a>
                            
                          </div>

                            </CardContent>
                    </Card>
                    
                    <Card className={`relative bg-black border-0 shadow-lg transform transition-all duration-500 ease-out `}>
                       <CardHeader className="bg-black">
                              <CardTitle className="text-white text-xl font-bold">Course Name</CardTitle>
                              <CardDescription className="text-purple-300 text-base">Course description in 1 line</CardDescription>
                            </CardHeader>
                            <CardContent className="bg-black">
                              <p className="mb-4 text-purple-200 text-lg">Course name</p>
                              <ul className="list-disc list-inside space-y-3 text-base">
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Some additional info:</span>                                </li>
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Some additional info</span>                                 </li>
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Some additional info</span>                                 </li>
                              </ul>
                          <p className="text-sm font-medium mb-2 text-white">Learn more:</p>
                          <div className="flex flex-col space-y-1">
                            <a href="https://msrit.edu/" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-green-400 text-sm underline">
                              Check it out
                            </a>
                            
                          </div>

                            </CardContent>
                    </Card>
                    
                    <Card className={`relative bg-black border-0 shadow-lg transform transition-all duration-500 ease-out `}>
                       <CardHeader className="bg-black">
                              <CardTitle className="text-white text-xl font-bold">Course Name</CardTitle>
                              <CardDescription className="text-purple-300 text-base">Course description in 1 line</CardDescription>
                            </CardHeader>
                            <CardContent className="bg-black">
                              <p className="mb-4 text-purple-200 text-lg">Course name</p>
                              <ul className="list-disc list-inside space-y-3 text-base">
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Some additional info:</span>                                </li>
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Some additional info</span>                                 </li>
                                <li className="text-gray-300 hover:text-purple-300 transition-colors">
                                  <span className="font-bold text-white">Some additional info</span>                                 </li>
                              </ul>
                          <p className="text-sm font-medium mb-2 text-white">Learn more:</p>
                          <div className="flex flex-col space-y-1">
                            <a href="https://msrit.edu/" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-green-400 text-sm underline">
                              Check it out
                            </a>
                            
                          </div>

                            </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-center mt-8">
                    <Button onClick={() => setSubmitted(false)} className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500">
                      Regenerate
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