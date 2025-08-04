'use client'

import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import AIErrorBoundary, { AIRecommendationsFallback } from './AIErrorBoundary'
import { recommendationRateLimiter } from '@/lib/rate-limiter'

interface JobRecommendation {
  jobId: string
  matchScore: number
  reasoning: string
  keyStrengths: string[]
  potentialConcerns: string[]
}

interface Job {
  id: string
  title: string
  company: {
    name: string
    logo?: string
  }
  location: string
  type: string
  salary?: {
    min: number
    max: number
    currency: string
  }
  isRemote: boolean
}

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  skills: string[]
  experience?: string
  location?: string
  expectedSalary?: number
}

interface JobRecommendationsProps {
  userProfile: UserProfile
  jobs: Job[]
  onJobClick?: (jobId: string) => void
}

export default function JobRecommendations({ 
  userProfile, 
  jobs, 
  onJobClick 
}: JobRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRecommendations, setShowRecommendations] = useState(false)

  const fetchRecommendations = async () => {
    // Check rate limiting
    const rateLimitKey = `recommendations:${userProfile.id}`
    if (!recommendationRateLimiter.canMakeRequest(rateLimitKey)) {
      const timeUntilReset = recommendationRateLimiter.getTimeUntilReset(rateLimitKey)
      setError(`Too many requests. Please wait ${Math.ceil(timeUntilReset / 1000)} seconds before trying again.`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          jobs
        })
      })

      const data = await response.json()

      if (data.success) {
        setRecommendations(data.recommendations)
        setShowRecommendations(true)
      } else {
        setError(data.error || 'Failed to get recommendations')
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setError('Failed to get AI recommendations')
    } finally {
      setLoading(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-blue-600 bg-blue-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getMatchScoreText = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Fair Match'
    return 'Poor Match'
  }

  const findJobById = (jobId: string) => {
    return jobs.find(job => job.id === jobId)
  }

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary) return 'Salary not specified'
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`
  }

  if (!showRecommendations) {
    return (
      <AIErrorBoundary fallback={AIRecommendationsFallback}>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-blue-600 mr-2" data-testid="sparkles-icon" />
            <h3 className="text-lg font-semibold text-gray-900">
              AI-Powered Job Recommendations
            </h3>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">
          Get personalized job recommendations based on your profile, skills, and preferences using AI analysis.
        </p>

        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Recommendations
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}
      </div>
      </AIErrorBoundary>
    )
  }

  return (
    <AIErrorBoundary fallback={AIRecommendationsFallback}>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            AI Job Recommendations
          </h3>
        </div>
        <button
          onClick={() => setShowRecommendations(false)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Hide Recommendations
        </button>
      </div>

      {/* Recommendations */}
      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h4>
          <p className="text-gray-600">
            Try updating your profile with more skills and experience to get better matches.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => {
            const job = findJobById(recommendation.jobId)
            if (!job) return null

            return (
              <div key={recommendation.jobId} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {job.company.logo && (
                        <img
                          src={job.company.logo}
                          alt={job.company.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{job.location}</span>
                      <span>{job.type.replace('_', ' ')}</span>
                      {job.isRemote && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Remote
                        </span>
                      )}
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(recommendation.matchScore)}`}>
                      {recommendation.matchScore}% Match
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {getMatchScoreText(recommendation.matchScore)}
                    </p>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Why this job matches you:</h5>
                    <p className="text-sm text-gray-700">{recommendation.reasoning}</p>
                  </div>

                  {recommendation.keyStrengths.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        Your Strengths
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.keyStrengths.map((strength, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendation.potentialConcerns.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                        Areas to Consider
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.potentialConcerns.map((concern, idx) => (
                          <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            {concern}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onJobClick?.(job.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Job Details
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                    Save Job
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Recommendations'}
        </button>
      </div>
    </div>
    </AIErrorBoundary>
  )
} 