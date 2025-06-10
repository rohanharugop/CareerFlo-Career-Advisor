"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateProfile } from "@/lib/actions"

export function QuestionnaireForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    education_status: "",
    stream: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formDataToSubmit = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value)
      })

      const result = await updateProfile(formDataToSubmit)

      if (result.success && result.redirectUrl) {
        router.push(result.redirectUrl)
      } else if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Let&apos;s get to know you!</CardTitle>
        <CardDescription>
          Step {step} of {formData.education_status === "12th pass" ? 3 : 2}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleRadioChange("gender", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Educational Background</Label>
                <RadioGroup
                  value={formData.education_status}
                  onValueChange={(value) => handleRadioChange("education_status", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12th pass" id="12th-pass" />
                    <Label htmlFor="12th-pass">Recent 12th Pass</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="college student" id="college-student" />
                    <Label htmlFor="college-student">Present College Student</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 3 && formData.education_status === "12th pass" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Stream</Label>
                <RadioGroup
                  value={formData.stream}
                  onValueChange={(value) => handleRadioChange("stream", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Science" id="science" />
                    <Label htmlFor="science">Science</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Commerce" id="commerce" />
                    <Label htmlFor="commerce">Commerce</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Arts" id="arts" />
                    <Label htmlFor="arts">Arts</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                Back
              </Button>
            )}

            {step < (formData.education_status === "12th pass" ? 3 : 2) ? (
              <Button type="button" onClick={nextStep} className={step === 1 ? "ml-auto" : ""} disabled={isSubmitting}>
                Next
              </Button>
            ) : (
              <Button type="submit" className={step === 1 ? "ml-auto" : ""} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
