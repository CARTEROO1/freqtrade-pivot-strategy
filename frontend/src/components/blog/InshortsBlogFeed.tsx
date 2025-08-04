'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  ChevronUp, 
  ChevronDown, 
  Clock, 
  Heart, 
  Share2, 
  Bookmark, 
  Eye, 
  AlertTriangle, 
  Shield, 
  BookOpen, 
  Users,
  TrendingUp,
  Calendar,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react'
import { BlogPost } from '../../lib/supabase'

// Mock data for 30-second reading blog posts
const mockInshortsPosts: BlogPost[] = [
  {
    id: '1',
    title: 'New Job Scam Alert: Fake Remote Work Offers',
    excerpt: 'Scammers are posting fake remote work opportunities that require payment for "training materials" or "equipment." These offers promise high salaries but ask for upfront fees. Never pay to work - legitimate employers cover training costs.',
    content: 'Full article content here...',
    category: 'scam-alert',
    author: 'Safety Team',
    author_id: 'safety-1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    read_time: '30 sec read',
    views: 15420,
    likes: 892,
    featured: true,
    tags: ['scam', 'remote-work', 'urgent'],
    urgency_level: 'critical',
    status: 'published'
  },
  {
    id: '2',
    title: 'Top 5 Resume Mistakes That Kill Your Chances',
    excerpt: 'Avoid these common resume mistakes: spelling errors, generic objectives, listing irrelevant experience, using unprofessional email addresses, and failing to quantify achievements. Small details matter to hiring managers.',
    content: 'Full article content here...',
    category: 'career-guidance',
    author: 'Career Coach',
    author_id: 'career-1',
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z',
    read_time: '30 sec read',
    views: 8920,
    likes: 456,
    featured: false,
    tags: ['resume', 'career', 'tips'],
    urgency_level: 'low',
    status: 'published'
  },
  {
    id: '3',
    title: 'Student Loan Scam: Fake Debt Relief Programs',
    excerpt: 'Beware of companies promising to "forgive" or "eliminate" student loan debt for a fee. These are scams. Only the government can forgive federal student loans through legitimate programs like Public Service Loan Forgiveness.',
    content: 'Full article content here...',
    category: 'scam-alert',
    author: 'Security Expert',
    author_id: 'security-1',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    read_time: '30 sec read',
    views: 6540,
    likes: 234,
    featured: false,
    tags: ['student-loans', 'scam', 'debt'],
    urgency_level: 'high',
    status: 'published'
  },
  {
    id: '4',
    title: 'How to Ace Your First Job Interview',
    excerpt: 'Research the company thoroughly, prepare STAR method answers, dress professionally, arrive early, ask thoughtful questions, and follow up with a thank-you email. Confidence comes from preparation.',
    content: 'Full article content here...',
    category: 'career-guidance',
    author: 'Interview Coach',
    author_id: 'interview-1',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    read_time: '30 sec read',
    views: 4320,
    likes: 189,
    featured: false,
    tags: ['interview', 'preparation', 'tips'],
    urgency_level: 'low',
    status: 'published'
  },
  {
    id: '5',
    title: 'Free Online Courses for Career Growth',
    excerpt: 'Platforms like Coursera, edX, and Khan Academy offer free courses from top universities. Focus on in-demand skills like data analysis, digital marketing, and programming. Certificates can boost your resume.',
    content: 'Full article content here...',
    category: 'student-resources',
    author: 'Student Success Team',
    author_id: 'student-1',
    created_at: '2024-01-11T11:20:00Z',
    updated_at: '2024-01-11T11:20:00Z',
    read_time: '30 sec read',
    views: 7890,
    likes: 345,
    featured: false,
    tags: ['online-courses', 'free', 'skills'],
    urgency_level: 'low',
    status: 'published'
  },
  {
    id: '6',
    title: 'Red Flags: Job Postings That Are Too Good to Be True',
    excerpt: 'Warning signs: salaries much higher than market rate, no experience required for senior positions, immediate hiring without interviews, requests for personal financial information, or pressure to act quickly.',
    content: 'Full article content here...',
    category: 'safety-tips',
    author: 'Safety Team',
    author_id: 'safety-2',
    created_at: '2024-01-10T13:10:00Z',
    updated_at: '2024-01-10T13:10:00Z',
    read_time: '30 sec read',
    views: 5670,
    likes: 278,
    featured: false,
    tags: ['red-flags', 'job-postings', 'safety'],
    urgency_level: 'medium',
    status: 'published'
  },
  {
    id: '7',
    title: 'Networking Tips for Introverts',
    excerpt: 'Start with online networking on LinkedIn, attend smaller industry events, prepare conversation starters, focus on listening rather than talking, and follow up with meaningful connections. Quality over quantity.',
    content: 'Full article content here...',
    category: 'career-guidance',
    author: 'Career Coach',
    author_id: 'career-2',
    created_at: '2024-01-09T10:30:00Z',
    updated_at: '2024-01-09T10:30:00Z',
    read_time: '30 sec read',
    views: 3450,
    likes: 156,
    featured: false,
    tags: ['networking', 'introverts', 'career'],
    urgency_level: 'low',
    status: 'published'
  },
  {
    id: '8',
    title: 'Fake Internship Programs Targeting Students',
    excerpt: 'Scammers create fake internship programs that charge application fees or require students to pay for "materials." Legitimate internships are paid or at least free. Research companies thoroughly before applying.',
    content: 'Full article content here...',
    category: 'scam-alert',
    author: 'Safety Team',
    author_id: 'safety-3',
    created_at: '2024-01-08T15:45:00Z',
    updated_at: '2024-01-08T15:45:00Z',
    read_time: '30 sec read',
    views: 6780,
    likes: 423,
    featured: false,
    tags: ['internship', 'scam', 'students'],
    urgency_level: 'high',
    status: 'published'
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

export default function InshortsBlogFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set())
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showInstructions, setShowInstructions] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchBlogPosts()
  }, [selectedCategory])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      const response = await fetch(`/api/blog/inshorts?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setBlogPosts(data.posts)
        setCurrentIndex(0)
      } else {
        // Fallback to mock data
        let filteredPosts = mockInshortsPosts
        if (selectedCategory !== 'all') {
          filteredPosts = filteredPosts.filter(post => post.category === selectedCategory)
        }
        setBlogPosts(filteredPosts)
        setCurrentIndex(0)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      // Fallback to mock data
      let filteredPosts = mockInshortsPosts
      if (selectedCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === selectedCategory)
      }
      setBlogPosts(filteredPosts)
      setCurrentIndex(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % blogPosts.length)
      }, 30000)
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
  }, [isAutoPlay, blogPosts.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault()
        prevPost()
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault()
        nextPost()
      } else if (event.key === ' ') {
        event.preventDefault()
        setIsAutoPlay(!isAutoPlay)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isAutoPlay])

  const nextPost = () => {
    setCurrentIndex((prev) => (prev + 1) % blogPosts.length)
  }

  const prevPost = () => {
    setCurrentIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length)
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

  const toggleBookmark = (postId: string) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const categories = [
    { id: 'all', name: 'All', count: mockInshortsPosts.length },
    { id: 'scam-alert', name: 'Scam Alerts', count: mockInshortsPosts.filter(p => p.category === 'scam-alert').length },
    { id: 'safety-tips', name: 'Safety Tips', count: mockInshortsPosts.filter(p => p.category === 'safety-tips').length },
    { id: 'career-guidance', name: 'Career Tips', count: mockInshortsPosts.filter(p => p.category === 'career-guidance').length },
    { id: 'student-resources', name: 'Resources', count: mockInshortsPosts.filter(p => p.category === 'student-resources').length }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your 30-second reads...</p>
        </div>
      </div>
    )
  }

  if (blogPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts available</h3>
          <p className="text-gray-500">Check back later for new content</p>
        </div>
      </div>
    )
  }

  const currentPost = blogPosts[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  HappyCareer
                </span>
              </h1>
              <p className="text-sm text-gray-500">30-second career insights</p>
            </div>
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`p-2 rounded-full transition-colors ${
                isAutoPlay ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isAutoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / blogPosts.length) * 100}%` }}
            ></div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            {/* Category */}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(currentPost.category)}`}>
                {getCategoryIcon(currentPost.category)}
                <span className="ml-1">{currentPost.category.replace('-', ' ').toUpperCase()}</span>
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{currentPost.read_time}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
              {currentPost.title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-700 leading-relaxed mb-6">
              {currentPost.excerpt}
            </p>

            {/* Author and Date */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <span>{currentPost.author}</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
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
                {currentIndex + 1} of {blogPosts.length}
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
                <button
                  onClick={() => toggleBookmark(currentPost.id)}
                  className={`p-2 rounded-full transition-colors ${
                    bookmarkedPosts.has(currentPost.id)
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${bookmarkedPosts.has(currentPost.id) ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                Read Full <ArrowRight className="w-4 h-4" />
              </button>
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
            <ChevronUp className="w-6 h-6" />
          </button>
          <button
            onClick={nextPost}
            disabled={currentIndex === blogPosts.length - 1}
            className="p-3 rounded-full bg-white shadow-lg text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {blogPosts.map((_, index) => (
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
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 text-blue-600">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Feed</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-400">
              <Bookmark className="w-5 h-5" />
              <span className="text-xs">Saved</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs">Trending</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-400">
              <Users className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 