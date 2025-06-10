import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { QuestionnaireForm } from "@/components/questionnaire-form"

export default async function QuestionnairePage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Check if user already has a profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // If profile exists and has name, redirect to dashboard
  if (profile?.name) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex w-full justify-between">
          <a className="flex items-center justify-center" href="#">
            <span className="font-bold text-xl">Student Portal</span>
          </a>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <QuestionnaireForm />
      </main>
    </div>
  )
}
