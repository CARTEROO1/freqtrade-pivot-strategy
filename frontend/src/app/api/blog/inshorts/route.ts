import { NextRequest, NextResponse } from 'next/server'

// Mock data for the API
const mockInshortsPosts = [
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    let filteredPosts = [...mockInshortsPosts]
    
    // Filter by category
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category)
    }
    
    // Filter by search query
    if (search) {
      const query = search.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    // Sort by featured first, then by date
    filteredPosts.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)
    
    // Calculate pagination info
    const totalPosts = filteredPosts.length
    const totalPages = Math.ceil(totalPosts / limit)
    
    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      categories: {
        'all': mockInshortsPosts.length,
        'scam-alert': mockInshortsPosts.filter(p => p.category === 'scam-alert').length,
        'safety-tips': mockInshortsPosts.filter(p => p.category === 'safety-tips').length,
        'career-guidance': mockInshortsPosts.filter(p => p.category === 'career-guidance').length,
        'student-resources': mockInshortsPosts.filter(p => p.category === 'student-resources').length
      }
    })
  } catch (error) {
    console.error('Error fetching inshorts posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, postId } = body
    
    // Mock actions for like, bookmark, share
    switch (action) {
      case 'like':
        return NextResponse.json({ 
          success: true, 
          message: 'Post liked successfully',
          postId 
        })
      case 'bookmark':
        return NextResponse.json({ 
          success: true, 
          message: 'Post bookmarked successfully',
          postId 
        })
      case 'share':
        return NextResponse.json({ 
          success: true, 
          message: 'Post shared successfully',
          postId 
        })
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing action:', error)
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    )
  }
} 