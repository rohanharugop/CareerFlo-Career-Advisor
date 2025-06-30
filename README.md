# CareerFlo 🚀

**AI-Powered Platform for Career Planning and Portfolio Building**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black.svg)](https://nextjs.org)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Acknowledgments](#acknowledgments)

## 🎯 Overview

CareerFlo is an innovative AI-powered platform that provides students with personalized career roadmap development. The application leverages cutting-edge technologies including Retrieval-Augmented Generation (RAG) and Large Language Models (LLMs) to deliver customized college recommendations, relevant online courses, and intelligent resume generation based on individual goals, interests, and academic history.

### Problem Statement
Students today often lack personalized guidance and practical tools to effectively chart their educational and career journeys, causing them to struggle with decisions about colleges and courses, underdeveloped skills, and missed opportunities.

### Solution
CareerFlo bridges this gap by providing a unified, AI-powered platform that offers:
- **Tailored career roadmaps**
- **Targeted educational recommendations**  
- **Professional resume generation**
- **Skill development guidance**

## ✨ Features

### 🎓 College Recommendations
- **AI-Powered Matching**: Uses RAG models to analyze user profiles and suggest relevant colleges
- **Comprehensive Information**: Provides details on fees, cutoff marks, and placement companies
- **Save & Compare**: Bookmark colleges for easy comparison and future reference

### 📚 Course Recommendations  
- **Personalized Learning Paths**: Suggests online courses based on career goals and interests
- **Quality Assurance**: Recommends courses from trusted educational platforms
- **Free Resources Focus**: Prioritizes accessible, high-quality free courses

### 📄 AI Resume Builder
- **Intelligent Generation**: Creates professional resumes using generative AI
- **Customizable Templates**: Industry-standard formatting with personalization options
- **Real-time Editing**: Edit and preview resumes before downloading

### 🎨 User Experience
- **Intuitive Dashboard**: Clean, user-friendly interface with progress tracking
- **Dark/Light Mode**: Customizable visual experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Secure Authentication**: Robust user authentication via Supabase

## 🛠 Tech Stack

### Frontend
- **Next.js 13+** - React framework for production
- **React 18+** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Flask/Spring Boot** - RESTful API development
- **Python 3.8+** - Core backend language
- **Supabase** - Backend-as-a-Service for database and authentication

### AI/ML Stack
- **LangChain** - LLM application framework
- **Groq API** - LLM inference (llama3-70b-819)
- **RAG (Retrieval-Augmented Generation)** - Enhanced AI responses
- **Vector Databases** - Semantic search capabilities

### Database & Storage
- **Supabase PostgreSQL** - Primary database
- **Row Level Security** - Data protection
- **Real-time Subscriptions** - Live data updates

## 🏗 Architecture

CareerFlo follows a modular, three-stage architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   AI Services   │
│   (Next.js)     │◄──►│ (Flask/Spring)   │◄──►│  (RAG + LLMs)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌──────────────────┐
                    │    Supabase      │
                    │   (Database +    │
                    │ Authentication)  │
                    └──────────────────┘
```

### Data Flow
1. **User Authentication** - Secure login via Supabase Auth
2. **Profile Creation** - Comprehensive questionnaire for personalization
3. **AI Processing** - RAG models analyze user data against knowledge bases
4. **Recommendations** - Personalized suggestions for colleges and courses
5. **Resume Generation** - AI-powered professional document creation

## 🚀 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Python 3.8+
- Supabase account
- Groq API key

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/careerflo.git
cd careerflo

# Install frontend dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL, API keys, etc.

# Run the development server
npm run dev
# or
yarn dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your API keys and database URLs

# Run the backend server
python app.py
```

### Environment Variables
Create `.env.local` (frontend) and `.env` (backend) files:

```env
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend (.env)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
GROQ_API_KEY=your_groq_api_key
```

## 📱 Usage

### Getting Started
1. **Sign Up/Login**: Create an account or sign in using email authentication
2. **Complete Profile**: Fill out the comprehensive questionnaire about your academic background and career interests
3. **Explore Roadmap**: Navigate through the three main features via the interactive roadmap

### Core Features

#### College Recommendations
1. Navigate to "College Suggestions"
2. Enter your preferences (location, field of study, budget)
3. Receive AI-generated college recommendations
4. Save interesting options to your profile

#### Course Discovery
1. Go to "Course Recommendations"
2. Describe what you want to learn
3. Get personalized course suggestions from trusted platforms
4. Bookmark courses for future learning

#### Resume Building
1. Access the "Resume Builder"
2. Enter your details in natural language
3. Let AI generate a professional resume
4. Edit and customize before downloading

## 📚 API Documentation

### Authentication Endpoints
```http
POST /auth/login
POST /auth/register
POST /auth/logout
```

### College Recommendations
```http
POST /api/colleges/recommend
Content-Type: application/json

{
  "interests": ["Computer Science", "Engineering"],
  "location": "Bangalore",
  "budget": 200000,
  "academic_performance": "85%"
}
```

### Course Recommendations
```http
POST /api/courses/recommend
Content-Type: application/json

{
  "query": "machine learning for beginners",
  "user_profile": "undergraduate_cs"
}
```

### Resume Generation
```http
POST /api/resume/generate
Content-Type: application/json

{
  "personal_info": {...},
  "education": [...],
  "skills": [...],
  "experience": [...]
}
```

## 🖼 Screenshots

### Landing Page
![image]![image](https://github.com/user-attachments/assets/a380aa4b-9222-49d4-884d-88cfb46d0d71)
)


### Dashboard
![image](https://github.com/user-attachments/assets/a92ba7d4-2e62-417e-b70b-b2a7c6357e81)
![image](https://github.com/user-attachments/assets/c18b4765-447d-4835-9453-180ea1320376)
![image](https://github.com/user-attachments/assets/e3ef0bb0-4415-41c4-84a0-cb9d5b824269)


### Roadmap
![image](https://github.com/user-attachments/assets/a11ee526-8544-41c5-869d-b69f0df8afbf)
![image](https://github.com/user-attachments/assets/36515292-6c96-463d-ba17-b330e4cdbd9d)


### College Recommendations
![image](https://github.com/user-attachments/assets/b3bfadd7-8191-46c5-9888-e50aebfce3f0)
![Screenshot 2025-06-23 235147](https://github.com/user-attachments/assets/3667a6c4-da5e-4667-b586-fa71e67a8b15)


### Course Recommendations
![image](https://github.com/user-attachments/assets/c919772e-170b-4a7a-9bb3-b74577bbf12a)
![image](https://github.com/user-attachments/assets/a2416117-d8cd-41ed-b5af-17580be9af5e)



### Resume Builder
![image](https://github.com/user-attachments/assets/2d1f40da-2caa-4117-a14e-7763bb4e0b50)
![image](https://github.com/user-attachments/assets/cb6f95dd-c65e-41a9-b2d0-7bd905dab58e)
![image](https://github.com/user-attachments/assets/49d8fd76-d4ec-43ba-b778-00ce690d655d)
![image](https://github.com/user-attachments/assets/7e200dee-d4fc-4720-b3ef-0c02d8c4772a)


### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration for frontend
- Use Black formatter for Python backend
- Write comprehensive tests for new features

## 🙏 Acknowledgments

This project was developed as part of the Mini Project (IS65) at Ramaiah Institute of Technology, Bengaluru.

### Team Members
- **Rohan H (Team Leader)** (1MS22IS111)
- **Rahul Reddy M** (1MS22IS106) 
- **Sacheth N** (1MS22IS112)
- **Tejas U** (1MS23IS412)

### Special Thanks
- **Dr. Yogish H K** - Project Guide and Professor
- **Dr. Sumana M** - Head of Department, Information Science and Engineering
- **Ramaiah Institute of Technology** - For providing resources and platform

### Research References
This project builds upon research in AI-powered education technology, including works on:
- Knowledge Graph-Enhanced RAG for educational applications
- AI-powered career counseling systems
- Generative AI for resume and portfolio creation

---

**Made with ❤️ by the CareerFlo Team**

For questions or support, please open an issue or contact us at [rohan.harugop@gmail.com](mailto:rohan.harugop@gmail.com)
