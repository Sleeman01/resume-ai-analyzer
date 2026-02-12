# AI Resume Analyzer

An intelligent resume analysis tool that uses AI to provide detailed feedback, ATS compatibility scores, and actionable suggestions to help job seekers improve their resumes.

![AI Resume Analyzer](https://img.shields.io/badge/React-18.3-blue) ![Node.js](https://img.shields.io/badge/Node.js-20+-green) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-purple)

## Features

- **PDF Upload** - Drag & drop or click to upload your resume
- **AI-Powered Analysis** - Get comprehensive feedback using GPT-4
- **Overall Score** - See how your resume ranks on a 100-point scale
- **ATS Compatibility** - Check if your resume will pass Applicant Tracking Systems
- **Section-by-Section Feedback** - Detailed scores for:
  - Contact Information
  - Work Experience
  - Education
  - Skills
  - Formatting
- **Strengths & Weaknesses** - Know what's working and what needs improvement
- **Keyword Analysis** - See found keywords and get suggestions for missing ones
- **Actionable Tips** - Specific recommendations to improve your resume

## Tech Stack

### Frontend
- React 18 with Hooks
- Tailwind CSS for styling
- Vite for fast development
- Axios for API calls
- React Dropzone for file uploads
- Lucide React for icons

### Backend
- Node.js with Express
- OpenAI API (GPT-4o-mini)
- Multer for file handling
- pdf-parse for PDF text extraction

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sleeman01/ai-resume-analyzer.git
   cd ai-resume-analyzer
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. **Start the backend** (in one terminal)
   ```bash
   cd backend
   npm start
   ```
   Backend runs on http://localhost:3001

2. **Start the frontend** (in another terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on http://localhost:5173

3. Open http://localhost:5173 in your browser

## Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── index.js          # Express server & API routes
│   ├── package.json
│   └── .env.example      # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Tailwind & custom styles
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Upload and analyze a resume (PDF) |

### Request Example

```bash
curl -X POST http://localhost:3001/api/analyze \
  -F "resume=@your-resume.pdf"
```

### Response Example

```json
{
  "success": true,
  "analysis": {
    "overallScore": 78,
    "summary": "Strong technical resume with good experience section...",
    "sections": {
      "contact": { "score": 90, "feedback": "..." },
      "experience": { "score": 85, "feedback": "..." },
      "education": { "score": 70, "feedback": "..." },
      "skills": { "score": 80, "feedback": "..." },
      "formatting": { "score": 65, "feedback": "..." }
    },
    "strengths": ["...", "...", "..."],
    "improvements": ["...", "...", "..."],
    "keywords": {
      "found": ["JavaScript", "React", "Node.js"],
      "missing": ["TypeScript", "AWS"]
    },
    "atsScore": 72,
    "atsTips": ["...", "..."]
  }
}
```

## Screenshots

<img width="1913" height="862" alt="resume_analyzer" src="https://github.com/user-attachments/assets/efa3c32d-c92d-4678-9620-e3bb5bf26fb7" />



## Deployment

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repo
3. Set root directory to `backend`
4. Add environment variable: `OPENAI_API_KEY`

### Frontend (Vercel)
1. Import project on [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL` = your backend URL

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or as a portfolio piece.

## Author

**Sleeman** - [GitHub](https://github.com/sleeman01)

---

*Built as a portfolio project to demonstrate full-stack development skills with React, Node.js, and AI integration.*
