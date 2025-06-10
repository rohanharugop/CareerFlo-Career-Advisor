"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, BookmarkCheck } from "lucide-react"

interface College {
  id?: string
  name: string
  course_name: string
  fees?: string
  expected_kcet_cutoff?: string
  company_names?: string[]
  created_at?: string
}

interface SavedCollegesSectionProps {
  savedColleges: College[] | null
}

export default function SavedCollegesSection({ savedColleges }: SavedCollegesSectionProps) {
  const [showSavedColleges, setShowSavedColleges] = useState(false)

  const collegeCount = savedColleges?.length || 0

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      <Button 
        variant="outline" 
        onClick={() => setShowSavedColleges(!showSavedColleges)}
        className="mb-4 flex items-center gap-2"
      >
        <BookmarkCheck size={18} />
        <span>
          Saved Colleges {collegeCount > 0 && `(${collegeCount})`}
        </span>
        {showSavedColleges ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </Button>

      {/* Saved Colleges Card - Only shown when toggled */}
      {showSavedColleges && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Colleges</CardTitle>
            <CardDescription>Your saved college recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {!savedColleges || savedColleges.length === 0 ? (
              <div className="text-muted-foreground">No colleges saved yet.</div>
            ) : (
              <div className="grid gap-4">
                {savedColleges.map((college, idx) => (
                  <div key={college.id || idx} className="border rounded p-4">
                    <div className="font-semibold">{college.name}</div>
                    <div className="text-sm">{college.course_name}</div>
                    <div className="text-sm">Fees: {college.fees ?? "N/A"}</div>
                    <div className="text-sm">Expected KCET Cutoff: {college.expected_kcet_cutoff ?? "N/A"}</div>
                    <div className="text-sm">Companies: {(college.company_names || []).join(", ")}</div>
                    <div className="text-xs text-muted-foreground">Saved on: {college.created_at ? new Date(college.created_at).toLocaleString() : "N/A"}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}