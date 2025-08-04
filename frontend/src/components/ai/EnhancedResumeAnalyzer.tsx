'use client'

import { useState, useRef } from 'react'
import { 
  Upload, 
  FileText, 
  File, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Loader2,
  FileCheck,
  FileX,
  Download
} from 'lucide-react'
import AIErrorBoundary, { ResumeAnalysisFallback } from './AIErrorBoundary'
import { resumeAnalysisRateLimiter } from '@/lib/rate-limiter'
import PDFProcessor, { PDFExtractionResult } from '@/lib/pdf-processor'

interface ResumeAnalysis {
  skills: string[]
  workExperience: {
    years: number
    roles: string[]
    companies: string[]
  }
  education: string[]
  certifications: string[]
  keyAchievements: string[]
  suggestedJobRoles: string[]
}

interface ResumeAnalyzerProps {
  onAnalysisComplete?: (analysis: ResumeAnalysis) => void
  onSkillsExtracted?: (skills: string[]) => void
}

interface FileInfo {
  name: string
  size: string
  type: 'pdf' | 'txt'
  lastModified: Date
}

export default function EnhancedResumeAnalyzer({ 
  onAnalysisComplete, 
  onSkillsExtracted 
}: ResumeAnalyzerProps) {
  const [resumeText, setResumeText] = useState('')
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<FileInfo | null>(null)
  const [extractingPDF, setExtractingPDF] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value)
    setError(null)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploadedFile(null)
    setResumeText('')

    try {
      if (file.type.includes('pdf')) {
        // Handle PDF file
        const validation = PDFProcessor.validatePDFFile(file)
        if (!validation.valid) {
          setError(validation.error || 'Invalid PDF file')
          return
        }

        setExtractingPDF(true)
        const metadata = await PDFProcessor.getPDFMetadata(file)
        setUploadedFile({
          name: metadata.fileName,
          size: metadata.fileSize,
          type: 'pdf',
          lastModified: metadata.lastModified
        })

        const extractionResult = await PDFProcessor.extractTextFromPDF(file)
        if (extractionResult.success) {
          setResumeText(extractionResult.text)
          console.log(`Extracted ${extractionResult.pages} pages from PDF`)
        } else {
          setError(extractionResult.error || 'Failed to extract text from PDF')
          setUploadedFile(null)
        }
      } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
        // Handle text file
        const text = await file.text()
        setResumeText(text)
        setUploadedFile({
          name: file.name,
          size: PDFProcessor.formatFileSize(file.size),
          type: 'txt',
          lastModified: new Date(file.lastModified)
        })
      } else {
        setError('Please upload a PDF or text file')
      }
    } catch (error) {
      console.error('File processing error:', error)
      setError('Failed to process file')
    } finally {
      setExtractingPDF(false)
    }
  }

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please enter or upload resume text')
      return
    }

    // Check rate limiting
    const rateLimitKey = 'resume-analysis'
    if (!resumeAnalysisRateLimiter.canMakeRequest(rateLimitKey)) {
      const timeUntilReset = resumeAnalysisRateLimiter.getTimeUntilReset(rateLimitKey)
      setError(`Too many analysis requests. Please wait ${Math.ceil(timeUntilReset / 1000)} seconds before trying again.`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/resume-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: resumeText.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        setAnalysis(data.analysis)
        setShowAnalysis(true)
        onAnalysisComplete?.(data.analysis)
        onSkillsExtracted?.(data.analysis.skills)
      } else {
        setError(data.error || 'Failed to analyze resume')
      }
    } catch (error) {
      console.error('Error analyzing resume:', error)
      setError('Failed to analyze resume')
    } finally {
      setLoading(false)
    }
  }

  const clearAnalysis = () => {
    setAnalysis(null)
    setShowAnalysis(false)
    setResumeText('')
    setUploadedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadExtractedText = () => {
    if (!resumeText) return
    
    const blob = new Blob([resumeText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'extracted-resume-text.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (showAnalysis && analysis) {
    return (
      <AIErrorBoundary fallback={ResumeAnalysisFallback}>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Resume Analysis Complete
              </h3>
            </div>
            <button
              onClick={clearAnalysis}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Skills */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Skills Found</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Work Experience</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Years:</span> {analysis.workExperience.years}
                </p>
                <div>
                  <p className="text-sm font-medium text-gray-900">Roles:</p>
                  <ul className="text-sm text-gray-600">
                    {analysis.workExperience.roles.map((role, index) => (
                      <li key={index}>• {role}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Companies:</p>
                  <ul className="text-sm text-gray-600">
                    {analysis.workExperience.companies.map((company, index) => (
                      <li key={index}>• {company}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Education</h4>
              <ul className="space-y-2">
                {analysis.education.map((edu, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    {edu}
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Certifications</h4>
              <ul className="space-y-2">
                {analysis.certifications.map((cert, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Achievements */}
            <div className="md:col-span-2">
              <h4 className="text-md font-medium text-gray-900 mb-3">Key Achievements</h4>
              <ul className="space-y-2">
                {analysis.keyAchievements.map((achievement, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Job Roles */}
            <div className="md:col-span-2">
              <h4 className="text-md font-medium text-gray-900 mb-3">Suggested Job Roles</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.suggestedJobRoles.map((role, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => onSkillsExtracted?.(analysis.skills)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Use These Skills in Profile
            </button>
            <button
              onClick={clearAnalysis}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Analyze Another Resume
            </button>
          </div>
        </div>
      </AIErrorBoundary>
    )
  }

  return (
    <AIErrorBoundary fallback={ResumeAnalysisFallback}>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Enhanced AI Resume Analyzer
          </h3>
        </div>

        <p className="text-gray-600 mb-6">
          Upload your resume (PDF or text) or paste the text to extract skills, experience, and get job suggestions using AI.
        </p>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF or Text file)
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {extractingPDF ? (
                  <Loader2 className="w-8 h-8 mb-2 text-blue-500 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                )}
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF or TXT files (max 10MB)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.txt,text/plain,application/pdf"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {/* Uploaded File Info */}
        {uploadedFile && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {uploadedFile.type === 'pdf' ? (
                  <File className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <FileText className="h-4 w-4 text-green-500 mr-2" />
                )}
                <div>
                  <p className="text-sm font-medium text-green-800">{uploadedFile.name}</p>
                  <p className="text-xs text-green-600">
                    {uploadedFile.size} • {uploadedFile.type.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={downloadExtractedText}
                className="text-green-600 hover:text-green-800"
                title="Download extracted text"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or paste resume text here
          </label>
          <textarea
            value={resumeText}
            onChange={handleTextChange}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Paste your resume text here or upload a file above..."
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <button
          onClick={analyzeResume}
          disabled={loading || extractingPDF || !resumeText.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing Resume...
            </>
          ) : extractingPDF ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Extracting PDF...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze Resume with AI
            </>
          )}
        </button>
      </div>
    </AIErrorBoundary>
  )
} 