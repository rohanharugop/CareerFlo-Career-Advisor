"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  ArrowLeft, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Target, 
  TrendingUp, 
  Award,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Code,
  Briefcase
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Roadmap() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [lastClickedNode, setLastClickedNode] = useState<number>(1); // Track last clicked node
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/");
          return;
        }
        
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
          
        if (data) {
          setProfile(data);
        } else {
          router.push("/questionnaire");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, supabase]);

  const handleNodeClick = (nodeNumber: number, href: string) => {
    setLastClickedNode(nodeNumber);
    
    // Check if it's an external URL
    if (href.startsWith('http://') || href.startsWith('https://')) {
      window.open(href, '_blank');
    } else {
      router.push(href);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-slate-400 animate-pulse">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white">
      {/* Enhanced Header */}
      <header className="px-6 lg:px-8 h-16 flex items-center border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/dashboard")}
              className="hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <MapPin size={20} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">Your Learning Roadmap</span>
                <p className="text-xs text-gray-500 dark:text-slate-400">Personalized career journey</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
              <Clock size={16} />
              <span>Last updated today</span>
            </div>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/dashboard")}
              className="hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Home size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl">
                <Target size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Your Career Roadmap
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Sparkles size={16} className="text-yellow-400" />
                  <span className="text-gray-600 dark:text-slate-400">AI-powered personalized journey</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed max-w-3xl">
              Based on your profile and preferences, we've created a personalized learning roadmap to help you achieve your career goals. 
              Each milestone is carefully curated to build upon your existing skills and guide you towards success.
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-between mb-8 p-4 bg-white/80 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <TrendingUp size={20} className="text-green-400" />
              <span className="text-gray-700 dark:text-slate-300">Progress Tracking</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-sm text-gray-600 dark:text-slate-400">Step {lastClickedNode} Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-slate-400">Personalized for you</span>
              </div>
            </div>
          </div>

          {/* Enhanced Roadmap Visualization */}
          <div 
            className="relative w-full h-[600px] mb-16 cursor-pointer rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/60 dark:from-slate-900/30 dark:to-slate-800/30 border border-gray-300/60 dark:border-slate-700/50 p-8 shadow-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            
            {/* SVG Road Path */}
            <svg 
              className="absolute inset-0 w-full h-full transition-all duration-300" 
              viewBox="0 0 1000 500" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                filter: isHovered 
                  ? "drop-shadow(0px 8px 25px rgba(59, 130, 246, 0.3))" 
                  : "drop-shadow(0px 4px 15px rgba(59, 130, 246, 0.1))" 
              }}
            >

              {/* Enhanced Purple backdrop with gradient */}
              <defs>
                <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="roadGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Glowing base layer */}
              <path 
                d="M50,250 C180,60 400,440 500,250 C600,60 820,250 940,250" 
                stroke="url(#roadGradient)" 
                strokeWidth={isHovered ? "80" : "60"}
                strokeLinecap="round"
                opacity={isHovered ? "0.8" : "0.6"}
                className="transition-all duration-300"
              />

              {/* Main road surface */}
              <path 
                d="M60,250 C180,60 400,440 500,250 C600,60 820,250 940,250" 
                stroke="#374151" 
                className="dark:stroke-slate-800 stroke-gray-400"
                strokeWidth="50"
                strokeLinecap="round"
              />
              
              {/* Road center line */}
              <path 
                d="M60,250 C180,60 400,440 500,250 C600,60 820,250 940,250" 
                stroke="#fbbf24" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="15,15"
                opacity="0.8"
              />
               
            </svg>

            {/* Enhanced Interactive Points */}
            <div className="absolute top-[240px] left-[100px] transform -translate-x-1/2 -translate-y-1/2">
              <RoadmapNode 
                number={1}
                title="College Suggestions"
                description="Find the right college for you"
                active={lastClickedNode === 1}
                href="/roadmap/foundation"
                onClick={handleNodeClick}
                icon={<Building2 size={20} />}
                color="from-emerald-500 to-teal-600"
              />
            </div>

            <div className="absolute top-[420px] left-[630px] transform -translate-x-1/2 -translate-y-1/2">
              <RoadmapNode 
                number={2}
                title="Online Courses"
                description="Develop foundational skills"
                active={lastClickedNode === 2}
                href="/roadmap/specialization"
                onClick={handleNodeClick}
                icon={<Code size={20} />}
                color="from-blue-500 to-indigo-600"
              />
            </div>

            <div className="absolute top-[300px] left-[1120px] transform -translate-x-1/2 -translate-y-1/2">
              <RoadmapNode 
                number={3}
                title="Build My Portfolio"
                description="Create a portfolio to showcase your skills"
                active={lastClickedNode === 3}
                href="https://ai-resume-maker-vocq.onrender.com/"
                onClick={handleNodeClick}
                icon={<Briefcase size={20} />}
                color="from-purple-500 to-pink-600"
              />
            </div>
          </div>

          {/* Enhanced Roadmap Description */}
          <Card className="mb-8 bg-white/80 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 shadow-lg">
            <CardContent className="pt-8">
              <div className="flex items-center gap-3 mb-6">
                <Award size={24} className="text-yellow-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Personalized Learning Journey</h2>
              </div>
              <p className="mb-6 text-gray-700 dark:text-slate-300 leading-relaxed">
                This roadmap is designed based on your academic background and career interests. 
                Click on each milestone to explore detailed learning resources and recommendations tailored specifically for your goals.
              </p>
              
              <div className="grid gap-6 md:grid-cols-3 mt-8">
                <div className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-gradient-to-br from-gray-50/80 to-gray-100/60 dark:from-slate-800/50 dark:to-slate-900/50 hover:from-gray-100/90 hover:to-gray-200/70 dark:hover:from-slate-700/50 dark:hover:to-slate-800/50 transition-all duration-300 group shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg group-hover:scale-110 transition-transform">
                      <GraduationCap size={20} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">College Recommendations</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">Find the ideal college for you with our RAG recommendation system powered by AI analysis.</p>
                  <div className="flex items-center gap-2 mt-3 text-emerald-600 dark:text-emerald-400 text-sm">
                    <ArrowRight size={14} />
                    <span>Get personalized matches</span>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-gradient-to-br from-gray-50/80 to-gray-100/60 dark:from-slate-800/50 dark:to-slate-900/50 hover:from-gray-100/90 hover:to-gray-200/70 dark:hover:from-slate-700/50 dark:hover:to-slate-800/50 transition-all duration-300 group shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                      <BookOpen size={20} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Course Suggestions</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">Get started with building real-life skills through curated introductory courses.</p>
                  <div className="flex items-center gap-2 mt-3 text-blue-600 dark:text-blue-400 text-sm">
                    <ArrowRight size={14} />
                    <span>Start learning today</span>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-gradient-to-br from-gray-50/80 to-gray-100/60 dark:from-slate-800/50 dark:to-slate-900/50 hover:from-gray-100/90 hover:to-gray-200/70 dark:hover:from-slate-700/50 dark:hover:to-slate-800/50 transition-all duration-300 group shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg group-hover:scale-110 transition-transform">
                      <FileText size={20} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Resume Builder</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">Create a professional resume tailored to match your needs and highlight your skills.</p>
                  <div className="flex items-center gap-2 mt-3 text-purple-600 dark:text-purple-400 text-sm">
                    <ArrowRight size={14} />
                    <span>Build your profile</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-green-400">1</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Current Step</div>
            </div>
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-blue-400">3</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Total Steps</div>
            </div>
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-purple-400">AI</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Powered</div>
            </div>
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-yellow-400">∞</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Possibilities</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Enhanced Roadmap node component
function RoadmapNode({ 
  number, 
  title, 
  description, 
  active, 
  href,
  onClick,
  icon,
  color
}: { 
  number: number;
  title: string;
  description: string;
  active: boolean;
  href: string;
  onClick: (nodeNumber: number, href: string) => void;
  icon: React.ReactNode;
  color: string;
}) {
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Button
          onClick={() => onClick(number, href)}
          className={`w-20 h-20 rounded-full text-lg font-bold flex items-center justify-center relative transition-all duration-300 ${
            active 
              ? `bg-gradient-to-br ${color} hover:scale-110 text-white shadow-2xl`
              : "bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 hover:scale-105 border border-gray-300 dark:border-slate-600"
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            {icon}
            <span className="text-xs">{number}</span>
          </div>
          
          {/* Enhanced pulsing animation for active node */}
          {active && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping bg-gradient-to-br from-blue-400 to-purple-500 opacity-30"></span>
              <span className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-br from-blue-400 to-purple-500 opacity-20"></span>
            </>
          )}
        </Button>
        
        {/* Step number badge */}
        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
          active ? 'bg-white text-slate-900' : 'bg-gray-400 dark:bg-slate-600 text-white'
        }`}>
          {number}
        </div>
      </div>
      
      <div className={`mt-4 rounded-xl p-4 text-center w-52 border transition-all duration-300 ${
        active 
          ? 'bg-white/90 dark:bg-slate-800/80 border-gray-300 dark:border-slate-600 shadow-xl backdrop-blur-sm' 
          : 'bg-white/70 dark:bg-slate-900/60 border-gray-200 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-800/60'
      }`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
          {active && <CheckCircle size={14} className="text-green-400" />}
        </div>
        <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">{description}</p>
        {active && (
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
            <span>Click to continue</span>
            <ArrowRight size={12} />
          </div>
        )}
      </div>
    </div>
  );
}