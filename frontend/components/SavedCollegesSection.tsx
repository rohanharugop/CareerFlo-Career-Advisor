"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, 
  ChevronUp, 
  BookmarkCheck, 
  Building2,
  GraduationCap,
  IndianRupee,
  Trophy,
  Briefcase,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Users
} from "lucide-react"

interface College {
  id?: string
  name: string
  course_name: string
  fees?: string
  expected_kcet_cutoff?: string
  company_names?: string[] | string
  created_at?: string
}

interface SavedCollegesSectionProps {
  savedColleges: College[] | null
}

export default function SavedCollegesSection({ savedColleges }: SavedCollegesSectionProps) {
  const [showSavedColleges, setShowSavedColleges] = useState(false)

  const collegeCount = savedColleges?.length || 0

  return (
    <div className="mb-8">
      {/* Enhanced Toggle Button */}
      <Button 
        variant="outline" 
        onClick={() => setShowSavedColleges(!showSavedColleges)}
        className="mb-6 h-12 px-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
            <BookmarkCheck size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Saved Colleges
            </span>
            {collegeCount > 0 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {collegeCount} {collegeCount === 1 ? 'college' : 'colleges'} saved
              </span>
            )}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {collegeCount > 0 && (
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              {collegeCount}
            </Badge>
          )}
          {showSavedColleges ? 
            <ChevronUp size={18} className="text-slate-600 dark:text-slate-400" /> : 
            <ChevronDown size={18} className="text-slate-600 dark:text-slate-400" />
          }
        </div>
      </Button>

      {/* Enhanced Saved Colleges Card */}
      {showSavedColleges && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-600/10 dark:to-purple-600/10 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Your College Collection
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Star size={14} />
                  Curated recommendations based on your preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {!savedColleges || savedColleges.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="p-6 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 w-fit mx-auto mb-6">
                    <Building2 className="h-16 w-16 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    No colleges saved yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Start building your dream college list by exploring our recommendations and saving the ones that match your goals.
                  </p>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200" asChild>
                    <a href="/roadmap/foundation" className="flex items-center gap-2">
                      <TrendingUp size={18} />
                      Explore Colleges
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Users size={16} />
                    <span>{collegeCount} {collegeCount === 1 ? 'college' : 'colleges'} in your collection</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                    <Trophy size={12} className="mr-1" />
                    Curated List
                  </Badge>
                </div>

                <div className="grid gap-6">
                  {savedColleges.map((college, idx) => (
                    <Card key={college.id || idx} className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/30 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20">
                      <CardContent className="p-6">
                        <div className="space-y-5">
                          {/* College Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 group-hover:from-blue-200 group-hover:to-blue-300 dark:group-hover:from-blue-800/40 dark:group-hover:to-blue-700/40 transition-all duration-300">
                                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                                  {college.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <GraduationCap size={16} className="text-slate-500 dark:text-slate-400" />
                                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                                    {college.course_name}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              <MapPin size={12} className="mr-1" />
                              Saved
                            </Badge>
                          </div>

                          {/* College Details Grid */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-100 dark:border-green-900/30">
                                <div className="p-2 rounded-lg bg-green-500/10">
                                  <IndianRupee size={16} className="text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide">
                                    Annual Fees
                                  </p>
                                  <p className="text-sm font-bold text-green-800 dark:text-green-300">
                                    {college.fees || "Not specified"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-100 dark:border-orange-900/30">
                                <div className="p-2 rounded-lg bg-orange-500/10">
                                  <Trophy size={16} className="text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-orange-700 dark:text-orange-400 uppercase tracking-wide">
                                    KCET Cutoff
                                  </p>
                                  <p className="text-sm font-bold text-orange-800 dark:text-orange-300">
                                    {college.expected_kcet_cutoff || "Not available"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border border-purple-100 dark:border-purple-900/30">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 rounded-lg bg-purple-500/10">
                                    <Briefcase size={16} className="text-purple-600 dark:text-purple-400" />
                                  </div>
                                  <p className="text-xs font-medium text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                                    Top Recruiters
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {(() => {
                                    // Handle different data formats
                                    let companies: (string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined)[] = [];
                                    if (Array.isArray(college.company_names)) {
                                      companies = college.company_names.filter(c => c && c.trim());
                                    } else if (typeof college.company_names === 'string' && college.company_names.trim()) {
                                      companies = college.company_names.split(',').map(c => c.trim()).filter(c => c);
                                    }
                                    
                                    return companies.length > 0 ? (
                                      <>
                                        {companies.slice(0, 3).map((company: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, companyIdx: Key | null | undefined) => (
                                          <Badge 
                                            key={companyIdx} 
                                            variant="outline" 
                                            className="text-xs bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                          >
                                            {company}
                                          </Badge>
                                        ))}
                                        {companies.length > 3 && (
                                          <Badge variant="secondary" className="text-xs">
                                            +{companies.length - 3} more
                                          </Badge>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-sm text-purple-600 dark:text-purple-400 italic">
                                        No recruiters data available
                                      </span>
                                    );
                                  })()}
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 border border-slate-200 dark:border-slate-800">
                                <div className="p-2 rounded-lg bg-slate-500/10">
                                  <Calendar size={16} className="text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-slate-700 dark:text-slate-400 uppercase tracking-wide">
                                    Saved On
                                  </p>
                                  <p className="text-sm font-bold text-slate-800 dark:text-slate-300">
                                    {college.created_at ? new Date(college.created_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    }) : "Unknown date"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}