'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Building, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  FileText,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { descriptionEnhancementRateLimiter } from '@/lib/rate-limiter'

interface JobFormData {
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  salary: {
    min: number
    max: number
    currency: string
  }
  type: string
  experience: string
  isRemote: boolean
  location: string
  deadline: string
  isUrgent: boolean
  isFeatured: boolean
}

export default function PostJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [enhancingDescription, setEnhancingDescription] = useState(false)
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    salary: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    type: 'FULL_TIME',
    experience: 'ENTRY',
    isRemote: false,
    location: '',
    deadline: '',
    isUrgent: false,
    isFeatured: false
  })

  useEffect(() => {
    // Check if user is authenticated and is an employer
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const user = JSON.parse(userData)
      if (user.role !== 'EMPLOYER') {
        router.push('/dashboard')
        return
      }
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else if (name.startsWith('salary.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [field]: field === 'min' || field === 'max' ? parseInt(value) || 0 : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleArrayFieldChange = (field: keyof JobFormData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayField = (field: keyof JobFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }))
  }

  const removeArrayField = (field: keyof JobFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }))
  }

  const enhanceDescription = async () => {
    if (!formData.description.trim()) {
      alert('Please enter a job description first')
      return
    }

    // Check rate limiting
    const rateLimitKey = 'description-enhancement'
    if (!descriptionEnhancementRateLimiter.canMakeRequest(rateLimitKey)) {
      const timeUntilReset = descriptionEnhancementRateLimiter.getTimeUntilReset(rateLimitKey)
      alert(`Too many enhancement requests. Please wait ${Math.ceil(timeUntilReset / 1000)} seconds before trying again.`)
      return
    }

    setEnhancingDescription(true)
    try {
      const response = await fetch('/api/ai/enhance-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          jobTitle: formData.title || 'Job Position',
          companyName: 'Your Company' // This would come from user's company profile
        })
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          description: data.enhancedDescription
        }))
        alert('Job description enhanced successfully!')
      } else {
        alert(data.error || 'Failed to enhance description')
      }
    } catch (error) {
      console.error('Error enhancing description:', error)
      alert('Failed to enhance description')
    } finally {
      setEnhancingDescription(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validation
    if (!formData.title.trim()) {
      setError('Job title is required')
      setLoading(false)
      return
    }

    if (!formData.description.trim()) {
      setError('Job description is required')
      setLoading(false)
      return
    }

    if (!formData.location.trim()) {
      setError('Location is required')
      setLoading(false)
      return
    }

    if (formData.salary.min > formData.salary.max) {
      setError('Minimum salary cannot be greater than maximum salary')
      setLoading(false)
      return
    }

    // Filter out empty requirements, responsibilities, and benefits
    const filteredData = {
      ...formData,
      requirements: formData.requirements.filter(req => req.trim()),
      responsibilities: formData.responsibilities.filter(resp => resp.trim()),
      benefits: formData.benefits.filter(benefit => benefit.trim())
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:4000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(filteredData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({
          title: '',
          description: '',
          requirements: [''],
          responsibilities: [''],
          benefits: [''],
          salary: {
            min: 0,
            max: 0,
            currency: 'USD'
          },
          type: 'FULL_TIME',
          experience: 'ENTRY',
          isRemote: false,
          location: '',
          deadline: '',
          isUrgent: false,
          isFeatured: false
        })
        
        // Redirect to the new job after a short delay
        setTimeout(() => {
          router.push(`/jobs/${data.job.id}`)
        }, 2000)
      } else {
        setError(data.message || 'Failed to create job posting. Please try again.')
      }
    } catch (error) {
      console.error('Error creating job:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-sm text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Posted Successfully!</h2>
          <p className="text-gray-600 mb-4">Your job posting has been created and is now live.</p>
          <div className="animate-pulse">
            <p className="text-sm text-gray-500">Redirecting to job details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Create a compelling job posting to attract top talent</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FREELANCE">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ENTRY">Entry Level</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="MID">Mid Level</option>
                    <option value="SENIOR">Senior</option>
                    <option value="EXECUTIVE">Executive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isRemote"
                    checked={formData.isRemote}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Remote work available
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isUrgent"
                    checked={formData.isUrgent}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Urgent hiring
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Featured job (premium)
                  </label>
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Salary Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    name="salary.min"
                    value={formData.salary.min}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    name="salary.max"
                    value={formData.salary.max}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="80000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="salary.currency"
                    value={formData.salary.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Description</h2>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <button
                    type="button"
                    onClick={enhanceDescription}
                    disabled={enhancingDescription || !formData.description.trim()}
                    className="flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {enhancingDescription ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600 mr-1"></div>
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-1" />
                        Enhance with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide a detailed description of the role, responsibilities, and what makes this position exciting..."
                  required
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Requirements</h2>
              
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 3+ years of experience in React"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('requirements', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayField('requirements')}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Requirement
              </button>
            </div>

            {/* Responsibilities */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Responsibilities</h2>
              
              {formData.responsibilities.map((resp, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => handleArrayFieldChange('responsibilities', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Lead development of new features"
                  />
                  {formData.responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('responsibilities', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayField('responsibilities')}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Responsibility
              </button>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Benefits</h2>
              
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayFieldChange('benefits', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Health insurance, 401k matching"
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('benefits', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayField('benefits')}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Benefit
              </button>
            </div>

            {/* Application Deadline */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline (Optional)
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Job...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Post Job
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 