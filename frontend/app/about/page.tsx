'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Users, 
  Target, 
  Sparkles, 
  ArrowRight, 
  Star,
  Award,
  Globe,
  Zap,
  BookOpen,
  TrendingUp,
  Shield,
  CheckCircle,
  Mail,
  MessageCircle,
  Github,
  Twitter,
  Linkedin,
  Code,
  Lightbulb,
  Rocket,
  Clock,
  Eye
} from 'lucide-react';

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState('mission');

  const teamMembers = [
    {
      name: "Rohan Harugop",
      role: "Member 1",
      description: "AI Recommendation Specialist and Frontend Developer",
      avatar: "RH",
      avatarColor: "from-red-500 to-green-500"
    },
    {
      name: "Rahul Reddy M",
      role: "Member 2",
      description: "Generative AI Resume Generative tools Developer",
      avatar: "RR",
      avatarColor: "from-yellow-500 to-blue-500"
    },
    {
      name: "Sacheth N",
      role: "Member 3",
      description: "Design, Integrations and Testing Specialist",
      avatar: "SN",
      avatarColor: "from-yellow-500 to-pink-500"
    },
    {
      name: "Tejas U",
      role: "Member 4",
      description: "Database Management and Backend Developer",
      avatar: "TU",
      avatarColor: "from-blue-500 to-red-500"
    }
  ];

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Recommendations",
      description: "Advanced algorithms analyze your learning goals to suggest the perfect courses."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Personalized Learning Paths",
      description: "Tailored educational journeys that adapt to your pace and interests."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Quality Assurance",
      description: "Every course is carefully vetted to ensure high-quality learning experiences."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Access",
      description: "Connect with courses and educators from around the world."
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Learners", icon: <Users className="h-5 w-5" /> },
    { number: "10K+", label: "Courses Recommended", icon: <BookOpen className="h-5 w-5" /> },
    { number: "500+", label: "Partner Institutions", icon: <Award className="h-5 w-5" /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp className="h-5 w-5" /> }
  ];

  const handleContactClick = () => {
    window.open('https://wikipedia.org', '_blank');
  };

  const handleSocialClick = (platform: 'github' | 'twitter' | 'linkedin') => {
    const links = {
      github: 'https://github.com/rohanharugop/miniproject',
      twitter: 'https://twitter.com',
      linkedin: 'https://www.linkedin.com/in/rohan-harugop-923916295/'
    };
    window.open(links[platform], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-8 h-16 flex items-center border-b border-slate-800/50 backdrop-blur-sm">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              About Us
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-6 md:px-8">
            <div className="space-y-16">
              
              {/* Hero Section */}
              <div className="space-y-6 max-w-4xl mx-auto text-center">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-in slide-in-from-top-4 duration-700">
                    <span className="bg-gradient-to-r from-green-400 via-red-400 to-blue-400 bg-clip-text text-transparent">
                      Empowering
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-green-400 bg-clip-text text-transparent">Learners Worldwide</span>
                  </h1>
                  <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-top-6 duration-700 delay-200">
                    We believe that everyone deserves access to quality education. Our AI-powered platform 
                    connects learners with the perfect courses to achieve their goals and transform their lives.
                  </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 animate-in slide-in-from-bottom-4 duration-700 delay-400">
                  {stats.map((stat, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-center text-purple-400 mb-2">
                          {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mission Section */}
              <div className="max-w-6xl mx-auto">
                <div className="relative overflow-hidden border border-purple-500/30 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
                  <div className="relative p-8 md:p-12 space-y-8">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <Rocket className="h-6 w-6 text-white" />
                        </div>
                        
                        <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                      </div>
                      <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
                        We aim to democratize education by leveraging artificial intelligence to create 
                        personalized learning experiences. Our platform bridges the gap between ambitious learners 
                        and quality educational content, making skill development accessible, efficient, and enjoyable.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto">
                          <Eye className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-emerald-300">Vision</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          A world where quality education is accessible to everyone, regardless of background or location.
                        </p>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-300 rounded-xl flex items-center justify-center mx-auto">
                          <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-blue-300">Values</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Innovation, accessibility, quality, and continuous learning drive everything we do.
                        </p>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-green-700 rounded-xl flex items-center justify-center mx-auto">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-orange-300">Goal</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          To help students all around the world by simplifying their journey of learning.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-white flex items-center justify-center">
                    <Zap className="h-8 w-8 mr-3 text-yellow-400" />
                    What Makes Us Different
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Our innovative approach combines AI technology with relatability and a flexible learning environment
                    to deliver an excellent learning experience.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                            {feature.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Section */}
              <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-white flex items-center justify-center">
                    <Users className="h-8 w-8 mr-3 text-blue-400" />
                    Meet Our Team
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    A diverse group of passionate individuals united by our shared vision of 
                    transforming education through technology.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                        <div className={`w-16 h-16 bg-gradient-to-br ${member.avatarColor} rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg`}>
                          {member.avatar}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                        <p className="text-purple-300 text-sm font-medium mb-3">{member.role}</p>
                        <p className="text-gray-400 text-sm leading-relaxed">{member.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Section */}
              <div className="max-w-4xl mx-auto">
                <div className="relative overflow-hidden border border-emerald-500/30 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5"></div>
                  <div className="relative p-8 md:p-12 text-center space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                          <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">Get In Touch</h2>
                      </div>
                      <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                        Have questions about our platform? Want to partner with us? We'd love to hear from you!
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={handleContactClick}
                        className="group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0"
                      >
                        <Mail className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        Contact Us
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSocialClick('github')}
                          className="border-slate-600 text-gray-400 hover:bg-slate-700 hover:text-white p-3"
                        >
                          <Github className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSocialClick('twitter')}
                          className="border-slate-600 text-gray-400 hover:bg-slate-700 hover:text-white p-3"
                        >
                          <Twitter className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSocialClick('linkedin')}
                          className="border-slate-600 text-gray-400 hover:bg-slate-700 hover:text-white p-3"
                        >
                          <Linkedin className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>Built with ❤️ by learners, for learners • Making education accessible to all</p>
          </div>
        </div>
      </footer>
    </div>
  );
}