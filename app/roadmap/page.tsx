"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
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
    router.push(href);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b sticky top-0 z-10 bg-background">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft size={18} />
            </Button>
            <span className="font-bold text-xl">Your Learning Roadmap</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <Home size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Career Roadmap</h1>
          <p className="text-muted-foreground mb-12">
            Based on your profile and preferences, we've created a personalized learning roadmap to help you achieve your career goals.
          </p>

          {/* Roadmap Visualization */}
          <div 
            className="relative w-full h-[600px] mb-16 cursor-pointer"
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
                  ? "drop-shadow(0px 4px 12px rgb(139, 92, 246))" 
                  : "drop-shadow(0px 2px 4px rgb(204, 175, 215))" 
              }}
            >

              {/* Purple backdrop - widest layer with hover effect */}
              <path 
                d="M50,250 C180,60 400,440 500,250 C600,60 820,250 940,250" 
                stroke="#8B5CF6" 
                strokeWidth="60"
                strokeLinecap="round"
                opacity={isHovered ? "0.6" : "0.0"}
                className="transition-all duration-200"
              />

              {/* Main curved path */}
              <path 
                d="M60,250 C180,60 400,440 500,250 C600,60 820,250 940,250" 
                stroke="rgb(20, 1, 1)" 
                strokeWidth="90"
                strokeLinecap="round"
                className="text-muted/50 dark:text-muted/30"
              />
              <path 
                d="M60,250 C180,60 400,440 500,250 C600,60 820,250 940,250" 
                stroke="rgba(2, 0, 10, 0.91)" 
                strokeWidth="0"
                strokeLinecap="square"
                className="text-muted/10 dark:text-muted/10"
              />
              
              {/* Path border top */}
              <path 
                d="M60,250 C180,60 400,440 500,250 C600,60 820,250 940,250" 
                stroke="rgba(2, 0, 3, 0.92)" 
                strokeWidth="84"
                strokeLinecap="round"
                className="text-muted/30 dark:text-muted/10"
                strokeDasharray="12,12"
              />
              
              {/* Path lines */}
              <path 
               d="M60,250 C180,60 400,440 500,250 C600,60 820,250 940,250" 
               stroke="rgba(204, 192, 31, 0.72)" 
               strokeWidth="8"
               strokeLinecap="round"
               strokeDasharray="20,20"
               className="dark:stroke-flex-600"
              />
               
            </svg>

            {/* Interactive Points with adjusted positions for wider roadmap */}
            <div className="absolute top-[240px] left-[100px] transform -translate-x-1/2 -translate-y-1/2">
              <RoadmapNode 
                number={1}
                title="College Suggestions"
                description="Find the right college for you"
                active={lastClickedNode === 1}
                href="/roadmap/foundation"
                onClick={handleNodeClick}
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
              />
            </div>

            <div className="absolute top-[300px] left-[1120px] transform -translate-x-1/2 -translate-y-1/2">
              <RoadmapNode 
                number={3}
                title="Build My Portfolio"
                description="Create a portfolio to showcase your skills"
                active={lastClickedNode === 3}
                href="/roadmap/career"
                onClick={handleNodeClick}
              />
            </div>
          </div>

          {/* Roadmap Description */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Your Personalized Learning Journey</h2>
              <p className="mb-4">
                This roadmap is designed based on your academic background and career interests. 
                Click on each milestone to explore detailed learning resources and recommendations.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <h3 className="font-semibold mb-2">1. College Recommendations</h3>
                  <p className="text-sm text-muted-foreground">Find the ideal college for you with our RAG recommendation system.</p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <h3 className="font-semibold mb-2">2.Course Suggestions </h3>
                  <p className="text-sm text-muted-foreground">Get started with building real-life skills with introductory courses.</p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <h3 className="font-semibold mb-2">3. Resume Builder</h3>
                  <p className="text-sm text-muted-foreground">Create a resume tailored to match your needs and highlight your skills.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Roadmap node component for each stage
function RoadmapNode({ 
  number, 
  title, 
  description, 
  active, 
  href,
  onClick
}: { 
  number: number;
  title: string;
  description: string;
  active: boolean;
  href: string;
  onClick: (nodeNumber: number, href: string) => void;
}) {
  
  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={() => onClick(number, href)}
        className={`w-16 h-16 rounded-full text-lg font-bold flex items-center justify-center relative ${
          active 
            ? "bg-primary hover:bg-primary text-primary-foreground"
            : "bg-muted hover:bg-muted text-muted-foreground"
        }`}
      >
        {number}
        {/* Pulsing animation for active node */}
        {active && (
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-70"></span>
        )}
      </Button>
      <div className="mt-2 bg-card shadow-lg rounded-lg p-3 text-center w-44 border">
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}