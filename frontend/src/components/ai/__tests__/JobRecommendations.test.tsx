import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JobRecommendations from '../JobRecommendations'
import { recommendationRateLimiter } from '../../../lib/rate-limiter'

// Mock the rate limiter
jest.mock('../../../lib/rate-limiter', () => ({
  recommendationRateLimiter: {
    canMakeRequest: jest.fn(),
    getTimeUntilReset: jest.fn(),
  },
}))

// Mock fetch
global.fetch = jest.fn()

const mockUserProfile = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  skills: ['React', 'TypeScript', 'Node.js'],
  experience: '3-5 years',
  location: 'San Francisco',
  expectedSalary: 120000,
}

const mockJobs = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    company: { name: 'Tech Corp', logo: 'https://example.com/logo.png' },
    location: 'San Francisco',
    type: 'FULL_TIME',
    salary: { min: 100000, max: 150000, currency: 'USD' },
    isRemote: false,
  },
  {
    id: 'job-2',
    title: 'React Developer',
    company: { name: 'Startup Inc' },
    location: 'Remote',
    type: 'FULL_TIME',
    isRemote: true,
  },
]

const mockRecommendations = [
  {
    jobId: 'job-1',
    matchScore: 85,
    reasoning: 'Excellent match for your React and TypeScript skills',
    keyStrengths: ['React', 'TypeScript', 'Frontend Development'],
    potentialConcerns: ['May need more backend experience'],
  },
  {
    jobId: 'job-2',
    matchScore: 75,
    reasoning: 'Good match for remote work and React skills',
    keyStrengths: ['React', 'Remote Work'],
    potentialConcerns: ['Startup environment may be fast-paced'],
  },
]

describe('JobRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(recommendationRateLimiter.canMakeRequest as jest.Mock).mockReturnValue(true)
    ;(recommendationRateLimiter.getTimeUntilReset as jest.Mock).mockReturnValue(0)
  })

  describe('Initial State', () => {
    it('should render the AI recommendations prompt', () => {
      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      expect(screen.getByText('AI-Powered Job Recommendations')).toBeInTheDocument()
      expect(screen.getByText(/Get personalized job recommendations/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Get AI Recommendations/ })).toBeInTheDocument()
    })

    it('should show sparkles icon', () => {
      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      // Check for sparkles icon by looking for the text content
      expect(screen.getByText('AI-Powered Job Recommendations')).toBeInTheDocument()
    })
  })

  describe('Fetching Recommendations', () => {
    it('should fetch recommendations when button is clicked', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, recommendations: mockRecommendations }),
      } as Response)

      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      const button = screen.getByRole('button', { name: /Get AI Recommendations/ })
      await userEvent.click(button)

      expect(mockFetch).toHaveBeenCalledWith('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: mockUserProfile,
          jobs: mockJobs,
        }),
      })
    })

    it('should show loading state during fetch', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, recommendations: mockRecommendations }),
        } as Response), 100))
      )

      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      const button = screen.getByRole('button', { name: /Get AI Recommendations/ })
      await userEvent.click(button)

      expect(screen.getByText('Analyzing...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Analyzing.../ })).toBeDisabled()
    })

    it('should display recommendations after successful fetch', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, recommendations: mockRecommendations }),
      } as Response)

      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      const button = screen.getByRole('button', { name: /Get AI Recommendations/ })
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('AI Job Recommendations')).toBeInTheDocument()
        expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
        expect(screen.getByText('Tech Corp')).toBeInTheDocument()
        expect(screen.getByText('85% Match')).toBeInTheDocument()
        expect(screen.getByText('Excellent Match')).toBeInTheDocument()
      })
    })

    it('should handle API errors gracefully', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      const button = screen.getByRole('button', { name: /Get AI Recommendations/ })
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Failed to get AI recommendations')).toBeInTheDocument()
      })
    })

    it('should handle rate limiting', async () => {
      ;(recommendationRateLimiter.canMakeRequest as jest.Mock).mockReturnValue(false)
      ;(recommendationRateLimiter.getTimeUntilReset as jest.Mock).mockReturnValue(30000)

      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      const button = screen.getByRole('button', { name: /Get AI Recommendations/ })
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/Too many requests. Please wait 30 seconds/)).toBeInTheDocument()
      })
    })
  })

  describe('Recommendation Display', () => {
    beforeEach(async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, recommendations: mockRecommendations }),
      } as Response)

      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      const button = screen.getByRole('button', { name: /Get AI Recommendations/ })
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('AI Job Recommendations')).toBeInTheDocument()
      })
    })

    it('should display job information correctly', () => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
      expect(screen.getByText('Tech Corp')).toBeInTheDocument()
      expect(screen.getByText('San Francisco')).toBeInTheDocument()
      expect(screen.getAllByText('FULL TIME')).toHaveLength(2) // Both jobs are full time
      expect(screen.getByText('USD100,000 - USD150,000')).toBeInTheDocument()
    })

    it('should display match scores with correct colors', () => {
      const matchScore = screen.getByText('85% Match')
      expect(matchScore).toHaveClass('text-green-600', 'bg-green-100')
    })

    it('should display AI analysis details', () => {
      expect(screen.getAllByText('Why this job matches you:')).toHaveLength(2)
      expect(screen.getByText(/Excellent match for your React and TypeScript skills/)).toBeInTheDocument()
      
      expect(screen.getAllByText('Your Strengths')).toHaveLength(2)
      expect(screen.getAllByText('React')).toHaveLength(2)
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      
      expect(screen.getAllByText('Areas to Consider')).toHaveLength(2)
      expect(screen.getByText('May need more backend experience')).toBeInTheDocument()
    })

    it('should handle job click events', async () => {
      const mockOnJobClick = jest.fn()
      
      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={mockOnJobClick}
        />
      )

      const button = screen.getByRole('button', { name: /Get AI Recommendations/ })
      await userEvent.click(button)

      await waitFor(() => {
        const viewButtons = screen.getAllByRole('button', { name: /View Job Details/ })
        fireEvent.click(viewButtons[0]) // Click the first button
        expect(mockOnJobClick).toHaveBeenCalledWith('job-1')
      })
    })

    it('should allow hiding recommendations', async () => {
      const hideButton = screen.getByRole('button', { name: /Hide Recommendations/ })
      await userEvent.click(hideButton)

      expect(screen.getByText('AI-Powered Job Recommendations')).toBeInTheDocument()
      expect(screen.queryByText('AI Job Recommendations')).not.toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('should handle empty recommendations', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, recommendations: [] }),
      } as Response)

      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      const button = screen.getByRole('button', { name: /Get AI Recommendations/ })
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('No recommendations found')).toBeInTheDocument()
        expect(screen.getByText(/Try updating your profile with more skills/)).toBeInTheDocument()
      })
    })

    it('should handle missing jobs', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          recommendations: [{ jobId: 'non-existent-job', matchScore: 85, reasoning: 'test', keyStrengths: [], potentialConcerns: [] }] 
        }),
      } as Response)

      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      const button = screen.getByRole('button', { name: /Get AI Recommendations/ })
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('No recommendations found')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      const button = screen.getByRole('button', { name: /Get AI Recommendations/ })
      expect(button).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      render(
        <JobRecommendations
          userProfile={mockUserProfile}
          jobs={mockJobs}
          onJobClick={jest.fn()}
        />
      )

      const button = screen.getByRole('button', { name: /Get AI Recommendations/ })
      button.focus()
      
      expect(button).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      
      expect(fetch).toHaveBeenCalled()
    })
  })
}) 