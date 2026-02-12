import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Target, 
  TrendingUp,
  Award,
  Lightbulb,
  Key,
  Sparkles,
  RefreshCw
} from 'lucide-react';

// Score Circle Component
function ScoreCircle({ score, size = 120, label }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-circle transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-3xl font-bold text-gray-800">{score}</span>
        <span className="text-xs text-gray-500">/ 100</span>
      </div>
      {label && <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>}
    </div>
  );
}

// Section Score Card
function SectionCard({ title, score, feedback, icon: Icon }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
          {score}/100
        </span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{feedback}</p>
    </div>
  );
}

// List Card Component
function ListCard({ title, items, icon: Icon, type = 'default' }) {
  const colors = {
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    default: 'bg-gray-50 border-gray-200',
  };

  const iconColors = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    default: 'text-primary-600',
  };

  return (
    <div className={`rounded-xl p-5 border ${colors[type]}`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconColors[type]}`} />
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Main App Component
function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError('Please upload a PDF file only');
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setAnalysis(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const analyzeResume = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(response.data.analysis);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to analyze resume';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Resume Analyzer</h1>
              <p className="text-sm text-gray-500">Get expert feedback in seconds</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!analysis ? (
          // Upload Section
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Improve Your Resume with AI
              </h2>
              <p className="text-gray-600">
                Upload your resume and get instant, detailed feedback to help you land more interviews.
              </p>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                transition-all duration-200 ease-in-out
                ${isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50'}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center mb-4
                  ${isDragActive ? 'bg-primary-100' : 'bg-gray-100'}
                `}>
                  <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
                {file ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 font-medium mb-1">
                      {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                    </p>
                    <p className="text-sm text-gray-500">or click to browse (PDF only, max 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={analyzeResume}
              disabled={!file || loading}
              className={`
                w-full mt-6 py-4 px-6 rounded-xl font-semibold text-white
                flex items-center justify-center gap-2 transition-all
                ${!file || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing your resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              {[
                { icon: Target, title: 'ATS Score', desc: 'Check compatibility' },
                { icon: TrendingUp, title: 'Detailed Feedback', desc: 'Section by section' },
                { icon: Lightbulb, title: 'Suggestions', desc: 'Actionable tips' },
              ].map((feature, i) => (
                <div key={i} className="text-center p-4">
                  <feature.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Results Section
          <div className="animate-fade-in">
            {/* Header with scores */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Analysis Complete</h2>
                  <p className="text-gray-600">{analysis.summary}</p>
                </div>
                <div className="flex gap-8">
                  <div className="relative">
                    <ScoreCircle score={analysis.overallScore} label="Overall Score" />
                  </div>
                  <div className="relative">
                    <ScoreCircle score={analysis.atsScore} size={100} label="ATS Score" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Scores */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <SectionCard 
                title="Contact Info" 
                score={analysis.sections.contact.score} 
                feedback={analysis.sections.contact.feedback}
                icon={FileText}
              />
              <SectionCard 
                title="Experience" 
                score={analysis.sections.experience.score} 
                feedback={analysis.sections.experience.feedback}
                icon={Award}
              />
              <SectionCard 
                title="Education" 
                score={analysis.sections.education.score} 
                feedback={analysis.sections.education.feedback}
                icon={Award}
              />
              <SectionCard 
                title="Skills" 
                score={analysis.sections.skills.score} 
                feedback={analysis.sections.skills.feedback}
                icon={Target}
              />
              <SectionCard 
                title="Formatting" 
                score={analysis.sections.formatting.score} 
                feedback={analysis.sections.formatting.feedback}
                icon={FileText}
              />
            </div>

            {/* Strengths, Improvements, Keywords */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <ListCard 
                title="Strengths" 
                items={analysis.strengths} 
                icon={CheckCircle}
                type="success"
              />
              <ListCard 
                title="Areas to Improve" 
                items={analysis.improvements} 
                icon={TrendingUp}
                type="warning"
              />
              <ListCard 
                title="ATS Tips" 
                items={analysis.atsTips} 
                icon={Lightbulb}
              />
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-800">Keywords Analysis</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Keywords Found</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.found.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Suggested Keywords to Add</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.missing.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                        + {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Analyze Another Button */}
            <div className="text-center">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          Built with React, Node.js, and OpenAI | 
          <a href="https://github.com/sleeman01/ai-resume-analyzer" className="text-primary-600 hover:underline ml-1">
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
