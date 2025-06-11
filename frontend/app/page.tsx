import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth-form"

export default async function Home() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(59,130,246,0.02)_50%,transparent_51%)] bg-[length:20px_20px]" />
        
        <header className="relative z-10 px-6 lg:px-8 h-16 flex items-center animate-in fade-in duration-600 border-b border-gray-800/50 backdrop-blur-sm">
          <div className="flex w-full justify-between items-center">
            <a className="flex items-center justify-center group" href="#">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <span className="font-semibold text-xl text-white group-hover:text-blue-400 transition-colors duration-200">
                CareerFlo
              </span>
            </a>
            <div className="text-sm text-gray-400 hidden sm:block">
              Your AI-powered career companion
            </div>
          </div>
        </header>
        
        <main className="relative z-10 flex-1 flex items-center justify-center">
          <section className="w-full py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-6 md:px-8 max-w-7xl">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="space-y-8 animate-in slide-in-from-left duration-800">
                  <div className="space-y-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                      AI-Powered Career Planning
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
                      Welcome to{" "}
                      <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                        CareerFlo
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
                      Transform your career journey with intelligent planning tools, personalized guidance, 
                      and visual roadmaps designed to unlock your professional potential.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>AI-driven insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Visual career mapping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Personalized guidance</span>
                    </div>
                  </div>
                </div>
                
                <div className="mx-auto w-full max-w-md animate-in slide-in-from-right duration-800 delay-200">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
                    
                    {/* Main card */}
                    <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                      <div className="mb-6 text-center">
                        <h2 className="text-2xl font-semibold text-white mb-2">Get Started</h2>
                        <p className="text-gray-400 text-sm">
                          Sign in to access your personalized career dashboard
                        </p>
                      </div>
                      
                      <AuthForm />
                      
                      <div className="mt-6 pt-6 border-t border-gray-700/50">
                        <p className="text-xs text-center text-gray-500">
                          By continuing, you agree to our Terms of Service and Privacy Policy
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
              <div className="mb-2 sm:mb-0">
                © 2025 CareerFlo. All rights reserved.
              </div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-gray-300 transition-colors duration-200">Privacy</a>
                <a href="#" className="hover:text-gray-300 transition-colors duration-200">Terms</a>
                <a href="#" className="hover:text-gray-300 transition-colors duration-200">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}