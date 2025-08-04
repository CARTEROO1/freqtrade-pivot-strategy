'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Building, 
  Globe, 
  Users, 
  Calendar,
  ArrowLeft,
  Heart,
  Share2,
  Send
} from 'lucide-react'

interface Job {
  id: string
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  salary?: {
    min: number
    max: number
    currency: string
  }
  type: string
  experience: string
  isRemote: boolean
  location: string
  deadline?: string
  isUrgent: boolean
  isFeatured: boolean
  postedAt: string
  company: {
    id: string
    name: string
    description?: string
    logo?: string
    website?: string
    industry?: string
    size?: string
    location?: string
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: '',
    portfolio: ''
  })

  useEffect(() => {
    if (params.id) {
      fetchJob(params.id as string)
      checkSavedStatus(params.id as string)
    }
  }, [params.id])

  const fetchJob = async (jobId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/jobs/${jobId}`)
      const data = await response.json()
      setJob(data.job)
    } catch (error) {
      console.error('Error fetching job:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkSavedStatus = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`http://localhost:4000/api/users/saved-jobs/${jobId}/check`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsSaved(data.data.isSaved)
      }
    } catch (error) {
      console.error('Error checking saved status:', error)
    }
  }

  const handleApply = async () => {
    if (!job) return

    try {
      const response = await fetch('http://localhost:4000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          jobId: job.id,
          companyId: job.company.id,
          coverLetter: applicationData.coverLetter,
          expectedSalary: parseInt(applicationData.expectedSalary) || undefined,
          availability: applicationData.availability,
          portfolio: applicationData.portfolio
        })
      })

      if (response.ok) {
        alert('Application submitted successfully!')
        setShowApplicationForm(false)
        setApplicationData({
          coverLetter: '',
          expectedSalary: '',
          availability: '',
          portfolio: ''
        })
      } else {
        alert('Failed to submit application. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    }
  }

  const toggleSave = async () => {
    if (!job) return

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please log in to save jobs')
      return
    }

    try {
      if (isSaved) {
        // Unsave the job
        const response = await fetch(`http://localhost:4000/api/users/saved-jobs/${job.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          setIsSaved(false)
        } else {
          alert('Failed to remove job from saved jobs')
        }
      } else {
        // Save the job
        const response = await fetch('http://localhost:4000/api/users/saved-jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            jobId: job.id
          })
        })

        if (response.ok) {
          setIsSaved(true)
        } else {
          alert('Failed to save job')
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error)
      alert('Failed to update saved status')
    }
  }

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job opportunity: ${job?.title} at ${job?.company.name}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary) return 'Salary not specified'
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h1>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/jobs')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Other Jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {job.isUrgent && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                        Urgent
                      </span>
                    )}
                    {job.isFeatured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">{job.company.name}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>{job.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{job.experience} Level</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={toggleSave}
                    className={`p-2 rounded-lg border transition-colors ${
                      isSaved 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={shareJob}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {job.isRemote && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Remote work available</span>
                  </div>
                </div>
              )}

              {job.deadline && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800">
                      Application deadline: {formatDate(job.deadline)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities.length > 0 && (
              <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits.length > 0 && (
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Company Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>
              <div className="flex items-center mb-4">
                {job.company.logo && (
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-12 h-12 rounded-lg object-cover mr-3"
                  />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{job.company.name}</h4>
                  {job.company.industry && (
                    <p className="text-sm text-gray-600">{job.company.industry}</p>
                  )}
                </div>
              </div>
              
              {job.company.description && (
                <p className="text-gray-700 text-sm mb-4">{job.company.description}</p>
              )}

              <div className="space-y-2 text-sm text-gray-600">
                {job.company.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.company.location}</span>
                  </div>
                )}
                {job.company.size && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{job.company.size}</span>
                  </div>
                )}
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this position</h3>
              
              {!showApplicationForm ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Apply Now
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us why you're interested in this position..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary (USD)
                    </label>
                    <input
                      type="number"
                      value={applicationData.expectedSalary}
                      onChange={(e) => setApplicationData({...applicationData, expectedSalary: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 75000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <input
                      type="text"
                      value={applicationData.availability}
                      onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Available immediately, 2 weeks notice"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio/Website (optional)
                    </label>
                    <input
                      type="url"
                      value={applicationData.portfolio}
                      onChange={(e) => setApplicationData({...applicationData, portfolio: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleApply}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Submit Application
                    </button>
                    <button
                      onClick={() => setShowApplicationForm(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 