# Smart Task Planner - Complete Project

##  Project Overview

An AI-powered Smart Task Planner that breaks down complex goals into actionable tasks with intelligent scheduling and timeline management. Features a stunning circular progress flow UI with animated step transitions.

## 🎬 Project Demo

https://drive.google.com/file/d/1YCj9v8DEeatZucZ0nJnJQp8h8SIcPErl/view?usp=drive_link

> 🎥 _The above video demonstrates the complete workflow from goal input to AI-generated task planning and scheduling._

---

## ✨ Features

### Core Functionality
- **AI Task Breakdown**: Uses Gemini AI to analyze goals and generate task lists
- **Intelligent Scheduling**: Automatically schedules tasks with dependencies
- **Timeline Management**: Estimates and optimizes task timelines
- **Dependency Handling**: Manages task dependencies using topological sorting

### UI Features
- **Circular Progress Flow**: Beautiful animated circular visualization showing task progression
- **Interactive Task Cards**: Color-coded priority system with hover effects
- **Timeline View**: Visual schedule with start/end dates
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered animations with ease-in-out-sine curves
- **Real-time Updates**: Live progress tracking and status updates

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
src/
├── components/
│   ├── ui/                      # Shadcn UI components
│   ├── CircularProgress.tsx     # Main circular progress component
│   └── TaskFlowVisualization.tsx # Task flow with circular layout
├── pages/
│   └── Index.tsx                # Main application page
└── index.css                    # Design system with HSL colors
```

### Backend (Python Flask)
```
backend/
└── app.py                       # Flask API with Gemini AI integration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Gemini API key

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install flask requests

# Set your Gemini API key in app.py
GEMINI_API_KEY = "your-api-key-here"

# Run the Flask server
python app.py
```

The frontend will run on `http://localhost:8080`
The backend API will run on `http://127.0.0.1:8000`

##  Design System

### Color Palette
- **Primary**: Purple (`hsl(262 83% 58%)`)
- **Accent**: Pink (`hsl(338 100% 63%)`)
- **Success**: Green (`hsl(142 76% 56%)`)
- **Background**: Light (`hsl(240 20% 99%)`)

### Animations
- **Circular Progress**: Sequential node activation with ripple effects
- **Ease Curve**: `ease-in-out-sine` for smooth transitions
- **Duration**: 2s per step with 0.15s stagger delay
- **Effects**: Scale, glow, pulse, and fade animations

## 📊 API Endpoints

### POST /plan
Generate a smart task plan from a goal

**Request:**
```json
{
  "goal": "Launch a product in 2 weeks",
  "start_date": "today",
  "deadline": "in 2 weeks",
  "work_hours_per_day": 6
}
```

**Response:**
```json
{
  "goal": "Launch a product in 2 weeks",
  "tasks": [
    {
      "id": "T1",
      "name": "Finalize Product Features & QA",
      "estimated_hours": 15
    }
  ],
  "schedule": [
    {
      "id": "T1",
      "name": "Finalize Product Features & QA",
      "start_date": "2025-10-15",
      "end_date": "2025-10-16",
      "duration_hours": 15
    }
  ],
  "notes": "AI-generated insights"
}
```

##  Key Technical Features

### 1. Circular Progress Component
- Perfect circle layout using trigonometry
- Dynamic node positioning: `angle = (index / total) * 2π - π/2`
- Sequential animation with customizable timing
- Framer Motion for smooth transitions

### 2. Task Scheduling Algorithm
- Topological sorting for dependency resolution
- Timeline compression for tight deadlines
- Work hours optimization
- Conflict detection and resolution

### 3. AI Integration
- Gemini 2.5 Flash for task generation
- Structured JSON output parsing
- Error handling with graceful fallbacks
- Rate limit management

## 🎥 Demo

### Features Demonstrated
1. Goal input and parameter configuration
2. AI task generation with loading states
3. Circular progress animation
4. Interactive task cards
5. Timeline visualization
6. Responsive design

## 📦 Dependencies

### Frontend
- React 18.3+
- Framer Motion 11+
- Tailwind CSS 3.4+
- Shadcn UI components
- Lucide React icons
- Sonner for toasts

### Backend
- Flask 3.0+
- Requests library
- Python datetime utilities

##  Environment Variables

### Backend
```python
GEMINI_API_KEY = "your-api-key"
GEMINI_MODEL = "gemini-2.5-flash"
```

## 📈 Evaluation Criteria Met

✅ **Task Completeness**: Comprehensive task breakdown with dependencies
✅ **Timeline Logic**: Intelligent scheduling with deadline optimization
✅ **LLM Reasoning**: Gemini AI integration with structured prompts
✅ **Code Quality**: TypeScript + Python with proper error handling
✅ **API Design**: RESTful API with clear request/response structure
✅ **UI/UX**: Modern, animated, responsive interface
✅ **Documentation**: Complete README with setup instructions

## 🎨 UI Highlights

### Circular Progress Flow
- 8 step workflow visualization
- Animated transitions between steps
- Real-time progress tracking
- Color-coded completion status

### Task Cards
- Priority-based color coding
- Estimated hours display
- Hover effects with scale animation
- Responsive grid layout

### Timeline View
- Start and end date visualization
- Duration display
- Sequential reveal animation
- Mobile-optimized layout

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm run test
```



##  Acknowledgments
- Gemini AI by Google
- Shadcn UI components
- Framer Motion animations
- Lovable platform

## 📧 Support
For issues or questions, please refer to the documentation or contact support.

---

**Built with ❤️ using React, TypeScript, Python, and AI**
