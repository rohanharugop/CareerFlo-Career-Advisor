"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const name = formData.get("name") as string
  const age = Number.parseInt(formData.get("age") as string)
  const gender = formData.get("gender") as string
  const education_status = formData.get("education_status") as string
  const stream = (formData.get("stream") as string) || null

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    name,
    age,
    gender,
    education_status,
    stream,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true, redirectUrl: "/dashboard" }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return { success: true, redirectUrl: "/" }
}
