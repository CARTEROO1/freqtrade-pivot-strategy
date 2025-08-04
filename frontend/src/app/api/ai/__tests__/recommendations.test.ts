import { NextRequest } from 'next/server'
import { POST } from '../recommendations/route'

// Mock the AI service
jest.mock('../../../lib/ai-service', () => ({
  aiService: {
    getJobRecommendations: jest.fn(),
  },
}))

describe('/api/ai/recommendations', () => {
  const mockUserProfile = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    skills: ['React', 'TypeScript'],
    experience: '3-5 years',
    location: 'San Francisco',
    expectedSalary: 120000,
  }

  const mockJobs = [
    {
      id: 'job-1',
      title: 'Frontend Developer',
      company: { name: 'Tech Corp' },
      location: 'San Francisco',
      type: 'FULL_TIME',
      isRemote: false,
    },
  ]

  const mockRecommendations = [
    {
      jobId: 'job-1',
      matchScore: 85,
      reasoning: 'Great match for skills',
      keyStrengths: ['React', 'TypeScript'],
      potentialConcerns: [],
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should return recommendations for valid request', async () => {
      const { aiService } = require('../../../lib/ai-service')
      aiService.getJobRecommendations.mockResolvedValue(mockRecommendations)

      const request = new NextRequest('http://localhost:3000/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: mockUserProfile,
          jobs: mockJobs,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.recommendations).toEqual(mockRecommendations)
      expect(aiService.getJobRecommendations).toHaveBeenCalledWith(mockUserProfile, mockJobs)
    })

    it('should return 400 for missing userProfile', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobs: mockJobs,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('User profile and jobs are required')
    })

    it('should return 400 for missing jobs', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: mockUserProfile,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('User profile and jobs are required')
    })

    it('should return 503 for unconfigured AI service', async () => {
      const { aiService } = require('../../../lib/ai-service')
      aiService.getJobRecommendations.mockRejectedValue(
        new Error('Moonshot API key not configured. Please set NEXT_PUBLIC_MOONSHOT_API_KEY environment variable.')
      )

      const request = new NextRequest('http://localhost:3000/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: mockUserProfile,
          jobs: mockJobs,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.error).toBe('AI service not configured. Please set up Moonshot API key.')
      expect(data.recommendations).toEqual([])
    })

    it('should return 500 for other AI service errors', async () => {
      const { aiService } = require('../../../lib/ai-service')
      aiService.getJobRecommendations.mockRejectedValue(new Error('AI service unavailable'))

      const request = new NextRequest('http://localhost:3000/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: mockUserProfile,
          jobs: mockJobs,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to get AI recommendations')
      expect(data.recommendations).toEqual([])
    })

    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to get AI recommendations')
    })
  })
}) 