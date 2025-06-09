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
      <div className="flex min-h-screen flex-col">
        <header className="px-4 lg:px-6 h-14 flex items-center animate-in fade-in duration-600">
          <div className="flex w-full justify-between">
            <a className="flex items-center justify-center" href="#">
              <span className="font-bold text-xl">CareerFlo</span>
            </a>
          </div>
        </header>
        
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="space-y-4 animate-in slide-in-from-left duration-800">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl transition-all duration-300 hover:text-shadow-purple hover:drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                    Welcome to CareerFlo:
                  </h1>
                  <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Design a fundamental career plan using AI helpers and visual guides.
                  </p>
                </div>
                <div className="mx-auto w-full max-w-lg animate-in slide-in-from-right duration-800 delay-200">
                  <div className="bg-gradient-to-br from-green-400/70 via-blue-400/30 to-green-400/70 backdrop-blur-md rounded-xl p-10 shadow-2xl transition-all duration-300 hover:shadow-green-700/40 hover:scale-105 hover:bg-gradient-to-br hover:from-green-300/70 hover:via-blue-400/80 hover:to-green-700/80">
                    <AuthForm />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}