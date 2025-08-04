'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Briefcase, 
  Heart, 
  FileText, 
  MapPin, 
  Mail, 
  Phone,
  Globe,
  Linkedin,
  Github,
  Edit,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  bio?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  skills: string[]
  experience: string
  education?: string
  expectedSalary?: number
  availability?: string
  role: string
  company?: {
    id: string
    name: string
    logo?: string
    industry?: string
    size?: string
    location?: string
  }
}

interface JobApplication {
  id: string
  status: string
  appliedAt: string
  job: {
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
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [savedJobsCount, setSavedJobsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Fetch user profile
      const profileResponse = await fetch('http://localhost:4000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setUser(profileData.data)
      } else if (profileResponse.status === 401) {
        router.push('/login')
        return
      }

      // Fetch applications
      const applicationsResponse = await fetch('http://localhost:4000/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json()
        setApplications(applicationsData.data)
      }

      // Fetch saved jobs count
      const savedJobsResponse = await fetch('http://localhost:4000/api/users/saved-jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (savedJobsResponse.ok) {
        const savedJobsData = await savedJobsResponse.json()
        setSavedJobsCount(savedJobsData.data.length)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HIRED':
        return 'text-green-600 bg-green-100'
      case 'INTERVIEW':
        return 'text-blue-600 bg-blue-100'
      case 'SHORTLISTED':
        return 'text-purple-600 bg-purple-100'
      case 'REVIEWED':
        return 'text-yellow-600 bg-yellow-100'
      case 'REJECTED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HIRED':
        return <CheckCircle className="h-4 w-4" />
      case 'INTERVIEW':
        return <Calendar className="h-4 w-4" />
      case 'SHORTLISTED':
        return <CheckCircle className="h-4 w-4" />
      case 'REVIEWED':
        return <Clock className="h-4 w-4" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatSalary = (salary?: number) => {
    if (!salary) return 'Not specified'
    return `$${salary.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
            <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.firstName}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {user.firstName} {user.lastName}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-3" />
                      <span>{user.email}</span>
                    </div>
                    
                    {user.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-3" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    
                    {user.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-3" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    
                    {user.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="h-4 w-4 mr-3" />
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                          {user.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-3" />
                      <span>{user.experience} Level</span>
                    </div>
                    
                    {user.expectedSalary && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-3" />
                        <span>Expected: {formatSalary(user.expectedSalary)}</span>
                      </div>
                    )}
                    
                    {user.availability && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-3" />
                        <span>{user.availability}</span>
                      </div>
                    )}
                    
                    {user.linkedin && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Linkedin className="h-4 w-4 mr-3" />
                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    
                    {user.github && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Github className="h-4 w-4 mr-3" />
                        <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                          GitHub Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {user.bio && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Bio</h4>
                  <p className="text-sm text-gray-600">{user.bio}</p>
                </div>
              )}
              
              {user.skills.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Applications */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Applications</h2>
              
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here.</p>
                  <button
                    onClick={() => router.push('/jobs')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{application.job.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{application.job.company.name}</p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span>{application.job.location}</span>
                            <span>{application.job.type.replace('_', ' ')}</span>
                            {application.job.salary && (
                              <span>${application.job.salary.min.toLocaleString()} - ${application.job.salary.max.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                          <button
                            onClick={() => router.push(`/jobs/${application.job.id}`)}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View Job
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Applied on {formatDate(application.appliedAt)}
                      </div>
                    </div>
                  ))}
                  
                  {applications.length > 5 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => router.push('/applications')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View all {applications.length} applications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-sm text-gray-600">Applications</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{applications.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-red-600 mr-3" />
                    <span className="text-sm text-gray-600">Saved Jobs</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{savedJobsCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-sm text-gray-600">Interviews</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {applications.filter(app => app.status === 'INTERVIEW').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/jobs')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Browse Jobs
                </button>
                
                <button
                  onClick={() => router.push('/saved-jobs')}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  View Saved Jobs
                </button>
                
                {user.role === 'EMPLOYER' && (
                  <button
                    onClick={() => router.push('/post-job')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Post a Job
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 