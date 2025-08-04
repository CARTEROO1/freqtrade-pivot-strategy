'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Clock, 
  Heart, 
  Share2, 
  Bookmark, 
  AlertTriangle, 
  Shield, 
  BookOpen, 
  Users,
  ArrowRight,
  Play,
  Pause,
  Eye
} from 'lucide-react'
import Link from 'next/link'

// Sample data for the preview
const previewPosts = [
  {
    id: '1',
    title: 'New Job Scam Alert: Fake Remote Work Offers',
    excerpt: 'Scammers are posting fake remote work opportunities that require payment for "training materials" or "equipment." These offers promise high salaries but ask for upfront fees. Never pay to work - legitimate employers cover training costs.',
    category: 'scam-alert',
    author: 'Safety Team',
    created_at: '2024-01-15T10:00:00Z',
    read_time: '30 sec read',
    views: 15420,
    likes: 892,
    featured: true,
    urgency_level: 'critical'
  },
  {
    id: '2',
    title: 'Top 5 Resume Mistakes That Kill Your Chances',
    excerpt: 'Avoid these common resume mistakes: spelling errors, generic objectives, listing irrelevant experience, using unprofessional email addresses, and failing to quantify achievements. Small details matter to hiring managers.',
    category: 'career-guidance',
    author: 'Career Coach',
    created_at: '2024-01-14T14:30:00Z',
    read_time: '30 sec read',
    views: 8920,
    likes: 456,
    featured: false,
    urgency_level: 'low'
  },
  {
    id: '3',
    title: 'Student Loan Scam: Fake Debt Relief Programs',
    excerpt: 'Beware of companies promising to "forgive" or "eliminate" student loan debt for a fee. These are scams. Only the government can forgive federal student loans through legitimate programs like Public Service Loan Forgiveness.',
    category: 'scam-alert',
    author: 'Security Expert',
    created_at: '2024-01-13T09:15:00Z',
    read_time: '30 sec read',
    views: 6540,
    likes: 234,
    featured: false,
    urgency_level: 'high'
  }
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'scam-alert':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'safety-tips':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'career-guidance':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'student-resources':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'scam-alert':
      return <AlertTriangle className="w-4 h-4" />
    case 'safety-tips':
      return <Shield className="w-4 h-4" />
    case 'career-guidance':
      return <BookOpen className="w-4 h-4" />
    case 'student-resources':
      return <Users className="w-4 h-4" />
    default:
      return <BookOpen className="w-4 h-4" />
  }
}

export default function InshortsPreview() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % previewPosts.length)
      }, 8000) // 8 seconds for preview
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlay])

  const nextPost = () => {
    setCurrentIndex((prev) => (prev + 1) % previewPosts.length)
  }

  const prevPost = () => {
    setCurrentIndex((prev) => (prev - 1 + previewPosts.length) % previewPosts.length)
  }

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const currentPost = previewPosts[currentIndex]

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              30-Second Career Insights
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quick, actionable career tips and safety alerts you can read in just 30 seconds. 
            Stay informed and protected while building your career.
          </p>
        </div>

        {/* Preview Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Progress Bar */}
            <div className="h-1 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / previewPosts.length) * 100}%` }}
              ></div>
            </div>

            {/* Post Content */}
            <div className="p-8">
              {/* Category and Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(currentPost.category)}`}>
                    {getCategoryIcon(currentPost.category)}
                    <span className="ml-1">{currentPost.category.replace('-', ' ').toUpperCase()}</span>
                  </span>
                  {currentPost.urgency_level !== 'low' && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      {currentPost.urgency_level.toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`p-2 rounded-full transition-colors ${
                    isAutoPlay ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {currentPost.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                {currentPost.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <span>{currentPost.author}</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentPost.read_time}
                  </span>
                  <span>{formatDate(currentPost.created_at)}</span>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {currentPost.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {currentPost.likes + (likedPosts.has(currentPost.id) ? 1 : 0)}
                  </span>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {currentIndex + 1} of {previewPosts.length}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(currentPost.id)}
                    className={`p-2 rounded-full transition-colors ${
                      likedPosts.has(currentPost.id)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPosts.has(currentPost.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                <Link 
                  href="/inshorts-blog"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <button
              onClick={prevPost}
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-white shadow-lg text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ←
            </button>
            <div className="flex gap-2">
              {previewPosts.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-blue-600'
                      : index < currentIndex
                      ? 'bg-gray-300'
                      : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
            <button
              onClick={nextPost}
              disabled={currentIndex === previewPosts.length - 1}
              className="p-3 rounded-full bg-white shadow-lg text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            href="/inshorts-blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore All 30-Second Reads
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">
            Get instant access to career tips, scam alerts, and safety advice
          </p>
        </div>
      </div>
    </section>
  )
} 