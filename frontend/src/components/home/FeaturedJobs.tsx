'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, DollarSign, Building, Star, Users, TrendingUp } from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
  remote: boolean
  verified: boolean
  postedAt: string
  description: string
  skills: string[]
  applicants: number
  urgency: 'high' | 'medium' | 'low'
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with mock data
    const fetchJobs = async () => {
      setLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: 'Google',
          location: 'Mountain View, CA',
          salary: '$150,000 - $200,000',
          type: 'Full-time',
          remote: true,
          verified: true,
          postedAt: '2 hours ago',
          description: 'Join our team to build the next generation of web applications using React, TypeScript, and modern web technologies.',
          skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
          applicants: 47,
          urgency: 'high'
        },
        {
          id: '2',
          title: 'Product Manager',
          company: 'Apple',
          location: 'Cupertino, CA',
          salary: '$140,000 - $180,000',
          type: 'Full-time',
          remote: false,
          verified: true,
          postedAt: '4 hours ago',
          description: 'Lead product strategy and development for innovative consumer applications that millions of users love.',
          skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics'],
          applicants: 23,
          urgency: 'medium'
        },
        {
          id: '3',
          title: 'Data Scientist',
          company: 'Netflix',
          location: 'Los Gatos, CA',
          salary: '$130,000 - $170,000',
          type: 'Full-time',
          remote: true,
          verified: true,
          postedAt: '6 hours ago',
          description: 'Use machine learning to improve our recommendation algorithms and enhance user experience.',
          skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
          applicants: 34,
          urgency: 'high'
        },
        {
          id: '4',
          title: 'UX Designer',
          company: 'Spotify',
          location: 'Stockholm, Sweden',
          salary: '$90,000 - $120,000',
          type: 'Full-time',
          remote: true,
          verified: true,
          postedAt: '1 day ago',
          description: 'Design beautiful and intuitive user experiences for our music streaming platform.',
          skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
          applicants: 18,
          urgency: 'low'
        },
        {
          id: '5',
          title: 'DevOps Engineer',
          company: 'Amazon',
          location: 'Seattle, WA',
          salary: '$120,000 - $160,000',
          type: 'Full-time',
          remote: false,
          verified: true,
          postedAt: '1 day ago',
          description: 'Build and maintain scalable infrastructure for our cloud services platform.',
          skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
          applicants: 29,
          urgency: 'medium'
        },
        {
          id: '6',
          title: 'Marketing Manager',
          company: 'Tesla',
          location: 'Palo Alto, CA',
          salary: '$100,000 - $140,000',
          type: 'Full-time',
          remote: false,
          verified: true,
          postedAt: '2 days ago',
          description: 'Drive marketing campaigns for our innovative electric vehicle products.',
          skills: ['Digital Marketing', 'Brand Strategy', 'Analytics', 'Social Media'],
          applicants: 41,
          urgency: 'low'
        }
      ]
      
      setJobs(mockJobs)
      setLoading(false)
    }

    fetchJobs()
  }, [])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'Urgent'
      case 'medium':
        return 'Active'
      case 'low':
        return 'Open'
      default:
        return 'Active'
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Jobs
            </h2>
            <p className="text-lg text-gray-600">
              Discover amazing opportunities from top companies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            Featured Jobs
          </h2>
          <p className="text-lg text-gray-600 mb-8 animate-slide-up">
            Discover amazing opportunities from top companies
          </p>
          
          {/* Live stats */}
          <div className="flex justify-center items-center space-x-8 mb-8 animate-scale-in">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">200+ New Jobs Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">1,200+ Active Applicants</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600">95% Success Rate</span>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Job Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{job.company}</span>
                    {job.verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Urgency Badge */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(job.urgency)}`}>
                  {getUrgencyText(job.urgency)}
                </span>
              </div>

              {/* Job Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {job.location}
                    {job.remote && (
                      <span className="ml-1 text-blue-600">• Remote</span>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{job.salary}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{job.type} • {job.postedAt}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Applicants */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{job.applicants} applicants</span>
                </div>
                
                {job.urgency === 'high' && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-600 font-medium">High Demand</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {job.description}
              </p>

              {/* Apply Button */}
              <button
                onClick={() => {
                  // Trigger dopamine reward for job application
                  const checkmark = document.createElement('div')
                  checkmark.className = 'success-checkmark'
                  checkmark.innerHTML = `
                    <svg class="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="success-checkmark__check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
                  `
                  document.body.appendChild(checkmark)
                  setTimeout(() => checkmark.remove(), 2000)
                  
                  console.log('Applied to:', job.title, 'at', job.company)
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12 animate-fade-in">
          <button 
            onClick={() => alert('View All Jobs feature coming soon! This will show you all available job opportunities with advanced filtering options.')}
            className="bg-white text-blue-600 border-2 border-blue-600 py-3 px-8 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            View All Jobs
          </button>
        </div>
      </div>

      {/* Success animation styles */}
      <style jsx>{`
        .success-checkmark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          animation: success-animation 2s ease-in-out;
        }
        
        .success-checkmark__circle {
          stroke: #4CAF50;
          stroke-width: 2;
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        
        .success-checkmark__check {
          stroke: #4CAF50;
          stroke-width: 2;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes success-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
} 