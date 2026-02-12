const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads (store in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// Analysis prompt for OpenAI
const ANALYSIS_PROMPT = `You are an expert HR consultant and resume reviewer with 20 years of experience. Analyze the following resume and provide detailed, actionable feedback.

Respond in the following JSON format exactly:
{
  "overallScore": <number 1-100>,
  "summary": "<2-3 sentence overall assessment>",
  "sections": {
    "contact": { "score": <1-100>, "feedback": "<feedback>" },
    "experience": { "score": <1-100>, "feedback": "<feedback>" },
    "education": { "score": <1-100>, "feedback": "<feedback>" },
    "skills": { "score": <1-100>, "feedback": "<feedback>" },
    "formatting": { "score": <1-100>, "feedback": "<feedback>" }
  },
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "improvements": ["<improvement1>", "<improvement2>", "<improvement3>"],
  "keywords": {
    "found": ["<keyword1>", "<keyword2>"],
    "missing": ["<suggested keyword1>", "<suggested keyword2>"]
  },
  "atsScore": <number 1-100>,
  "atsTips": ["<tip1>", "<tip2>"]
}

Be specific, constructive, and helpful. Focus on making the resume more effective for job applications.

RESUME TEXT:
`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Resume Analyzer API is running' });
});

// Analyze resume endpoint
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        message: 'Please add your OpenAI API key to the .env file'
      });
    }

    // Parse PDF
    console.log('Parsing PDF...');
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ 
        error: 'Could not extract text from PDF',
        message: 'The PDF might be scanned or image-based. Please use a text-based PDF.'
      });
    }

    console.log('Sending to OpenAI for analysis...');
    
    // Send to OpenAI for analysis
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR consultant. Always respond with valid JSON only, no markdown formatting.'
        },
        {
          role: 'user',
          content: ANALYSIS_PROMPT + resumeText
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content;
    
    // Parse the JSON response
    let analysis;
    try {
      // Remove any markdown code blocks if present
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      return res.status(500).json({ 
        error: 'Failed to parse analysis',
        message: 'The AI response was not in the expected format. Please try again.'
      });
    }

    console.log('Analysis complete!');
    
    res.json({
      success: true,
      analysis,
      metadata: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        textLength: resumeText.length,
        analyzedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error analyzing resume:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        error: 'API quota exceeded',
        message: 'OpenAI API quota has been exceeded. Please check your billing.'
      });
    }
    
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message || 'An unexpected error occurred'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Resume Analyzer API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
