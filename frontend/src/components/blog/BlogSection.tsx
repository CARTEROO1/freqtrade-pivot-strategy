'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Shield, BookOpen, Users, Calendar, ArrowRight, Eye, Heart, Share2 } from 'lucide-react'
import { blogApi } from '../../lib/api'
import { BlogPost } from '../../lib/supabase'
import InshortsBlogPreview from './InshortsBlogPreview'

// Mock data for when Supabase is not configured
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'URGENT: New Job Scam Targeting Students - Fake Internship Offers',
    excerpt: 'A sophisticated scam is targeting students with fake internship offers that ask for upfront fees and personal information. Learn how to spot and avoid these fraudulent job postings.',
    content: 'Full article content here...',
    category: 'scam-alert',
    author: 'Safety Team',
    author_id: 'safety-1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    read_time: '5 min read',
    views: 15420,
    likes: 892,
    featured: true,
    tags: ['scam', 'internship', 'urgent'],
    urgency_level: 'critical',
    status: 'published'
  },
  {
    id: '2',
    title: '10 Red Flags That Signal a Job Scam',
    excerpt: 'Learn the most common warning signs that indicate a job posting might be fraudulent. Protect yourself from identity theft and financial loss.',
    content: 'Full article content here...',
    category: 'safety-tips',
    author: 'Security Expert',
    author_id: 'security-1',
    created_at: '2024-01-12T14:30:00Z',
    updated_at: '2024-01-12T14:30:00Z',
    read_time: '8 min read',
    views: 8920,
    likes: 456,
    featured: true,
    tags: ['safety', 'red-flags', 'protection'],
    urgency_level: 'high',
    status: 'published'
  },
  {
    id: '3',
    title: 'How to Build a Professional Resume That Stands Out',
    excerpt: 'Expert tips on creating a compelling resume that will help you land your dream job while avoiding common mistakes that could hurt your chances.',
    content: 'Full article content here...',
    category: 'career-guidance',
    author: 'Career Coach',
    author_id: 'career-1',
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-10T09:15:00Z',
    read_time: '12 min read',
    views: 6540,
    likes: 234,
    featured: false,
    tags: ['resume', 'career', 'professional'],
    urgency_level: 'low',
    status: 'published'
  },
  {
    id: '4',
    title: 'Student Resources: Free Tools for Job Search Success',
    excerpt: 'Discover the best free tools and resources available to students for finding legitimate job opportunities and building their careers.',
    content: 'Full article content here...',
    category: 'student-resources',
    author: 'Student Success Team',
    author_id: 'student-1',
    created_at: '2024-01-08T16:45:00Z',
    updated_at: '2024-01-08T16:45:00Z',
    read_time: '6 min read',
    views: 4320,
    likes: 189,
    featured: false,
    tags: ['resources', 'tools', 'free'],
    urgency_level: 'low',
    status: 'published'
  },
  {
    id: '5',
    title: 'Recent Scam Alert: Fake Remote Work Opportunities',
    excerpt: 'Scammers are posting fake remote work opportunities that require payment for "training materials" or "equipment." Stay informed and protected.',
    content: 'Full article content here...',
    category: 'scam-alert',
    author: 'Safety Team',
    author_id: 'safety-2',
    created_at: '2024-01-05T11:20:00Z',
    updated_at: '2024-01-05T11:20:00Z',
    read_time: '4 min read',
    views: 7890,
    likes: 345,
    featured: false,
    tags: ['remote-work', 'scam', 'alert'],
    urgency_level: 'high',
    status: 'published'
  },
  {
    id: '6',
    title: 'Interview Preparation: Questions You Should Ask Employers',
    excerpt: 'Prepare for job interviews by knowing the right questions to ask. This will help you evaluate if the opportunity is legitimate and right for you.',
    content: 'Full article content here...',
    category: 'career-guidance',
    author: 'Interview Coach',
    author_id: 'interview-1',
    created_at: '2024-01-03T13:10:00Z',
    updated_at: '2024-01-03T13:10:00Z',
    read_time: '7 min read',
    views: 5670,
    likes: 278,
    featured: false,
    tags: ['interview', 'questions', 'preparation'],
    urgency_level: 'low',
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

export default function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogPosts()
  }, [selectedCategory, searchQuery])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to fetch from Supabase first
      try {
        const filters: any = {}
        if (selectedCategory !== 'all') {
          filters.category = selectedCategory
        }
        if (searchQuery) {
          filters.search = searchQuery
        }
        
        const posts = await blogApi.getBlogPosts(filters)
        setBlogPosts(posts)
      } catch (supabaseError) {
        console.log('Supabase not configured, using mock data')
        // If Supabase fails, use mock data
        let filteredPosts = mockBlogPosts
        
        if (selectedCategory !== 'all') {
          filteredPosts = filteredPosts.filter(post => post.category === selectedCategory)
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query)
          )
        }
        
        setBlogPosts(filteredPosts)
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      setError('Failed to load blog posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    { id: 'scam-alert', name: 'Scam Alerts', count: blogPosts.filter(p => p.category === 'scam-alert').length },
    { id: 'safety-tips', name: 'Safety Tips', count: blogPosts.filter(p => p.category === 'safety-tips').length },
    { id: 'career-guidance', name: 'Career Guidance', count: blogPosts.filter(p => p.category === 'career-guidance').length },
    { id: 'student-resources', name: 'Student Resources', count: blogPosts.filter(p => p.category === 'student-resources').length }
  ]

  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading && blogPosts.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchBlogPosts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              Safety & Career Blog
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about job scams, safety tips, and career guidance. 
            Protecting families and students from fraud while building successful careers.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search articles, scams, safety tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => alert('Subscribe to alerts feature coming soon! You\'ll receive instant notifications about new scams and safety threats.')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Subscribe to Alerts
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
              Featured Safety Alerts
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-lg border border-red-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1">{post.category.replace('-', ' ').toUpperCase()}</span>
                      </span>
                      {post.featured && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h4>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{post.author}</span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.created_at)}
                        </span>
                        <span>{post.read_time}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </span>
                      </div>
                      <button 
                        onClick={() => alert(`Reading article: ${post.title}`)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Read More <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 30-Second Quick Reads Preview */}
        <InshortsBlogPreview />

        {/* Regular Posts */}
        {regularPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                      {getCategoryIcon(post.category)}
                      <span className="ml-1">{post.category.replace('-', ' ').toUpperCase()}</span>
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h4>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{post.author}</span>
                    <span>{post.read_time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </span>
                    </div>
                    <button 
                      onClick={() => alert(`Reading article: ${post.title}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No posts match "${searchQuery}"`
                : selectedCategory !== 'all' 
                  ? `No posts in the "${selectedCategory}" category`
                  : 'No blog posts available yet'
              }
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-xl p-8 border border-red-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Protected with Our Safety Network
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of families and students who stay informed about the latest scams and safety tips. 
              Get instant alerts when new threats are detected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => alert('Report a Scam feature coming soon! This will help protect other students from fraudulent job postings.')}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Report a Scam
              </button>
              <button 
                onClick={() => alert('Subscribe to alerts feature coming soon! You\'ll receive instant notifications about new scams and safety threats.')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Subscribe to Alerts
              </button>
              <button 
                onClick={() => alert('Share Safety Tips feature coming soon! Help other students stay safe by sharing your experiences and tips.')}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Share Safety Tips
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
} 