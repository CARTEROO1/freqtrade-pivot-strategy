'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, Star, Award, Clock, Eye } from 'lucide-react'

interface LiveActivity {
  id: string
  action: string
  user: string
  company?: string
  time: string
  location: string
}

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  rating: number
  content: string
  salary: string
  timeToHire: string
}

const SocialProof = () => {
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([])
  const [viewerCount, setViewerCount] = useState(0)
  const [applicationCount, setApplicationCount] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  // Live activity simulation
  useEffect(() => {
    const activities: LiveActivity[] = [
      { id: '1', action: 'applied to', user: 'Sarah M.', company: 'TechCorp', time: '2 min ago', location: 'San Francisco' },
      { id: '2', action: 'got hired at', user: 'Mike R.', company: 'DataFlow', time: '5 min ago', location: 'New York' },
      { id: '3', action: 'completed profile', user: 'Emma L.', time: '8 min ago', location: 'Los Angeles' },
      { id: '4', action: 'received offer from', user: 'David K.', company: 'Legal Associates', time: '12 min ago', location: 'Chicago' },
      { id: '5', action: 'started new job at', user: 'Lisa P.', company: 'Creative Studio', time: '15 min ago', location: 'Austin' }
    ]

    setLiveActivities(activities)

    // Simulate live updates
    const interval = setInterval(() => {
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        action: ['applied to', 'got hired at', 'completed profile', 'received offer'][Math.floor(Math.random() * 4)],
        user: ['Alex', 'Maria', 'John', 'Sophie', 'Carlos'][Math.floor(Math.random() * 5)] + ' ' + ['A.', 'B.', 'C.', 'D.', 'E.'][Math.floor(Math.random() * 5)],
        company: ['TechCorp', 'DataFlow', 'Legal Associates', 'Creative Studio'][Math.floor(Math.random() * 4)],
        time: 'Just now',
        location: ['San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Austin'][Math.floor(Math.random() * 5)]
      }

      setLiveActivities(prev => [newActivity, ...prev.slice(0, 4)])
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Viewer count simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1)
      setApplicationCount(prev => prev + Math.floor(Math.random() * 2))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Testimonials data
  useEffect(() => {
    const testimonialsData: Testimonial[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Senior Software Engineer',
        company: 'TechCorp Solutions',
        avatar: '👩‍💻',
        rating: 5,
        content: 'Found my dream job in just 2 weeks! The AI matching was incredibly accurate.',
        salary: '$180,000',
        timeToHire: '14 days'
      },
      {
        id: '2',
        name: 'Michael Chen',
        role: 'Corporate Attorney',
        company: 'Legal Associates LLP',
        avatar: '👨‍💼',
        rating: 5,
        content: 'The platform helped me negotiate a 40% salary increase. Amazing experience!',
        salary: '$250,000',
        timeToHire: '21 days'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        role: 'UX/UI Designer',
        company: 'Creative Studio',
        avatar: '👩‍🎨',
        rating: 5,
        content: 'Perfect match for my skills and career goals. Highly recommended!',
        salary: '$95,000',
        timeToHire: '18 days'
      }
    ]

    setTestimonials(testimonialsData)
  }, [])

  return (
    <div className="fixed top-4 right-4 z-40 space-y-4">
      {/* Live Activity Feed */}
      <div className="glass-effect rounded-xl p-4 max-w-sm">
        <div className="flex items-center mb-3">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm font-semibold text-white">Live Activity</span>
        </div>
        
        <div className="space-y-2">
          {liveActivities.map((activity) => (
            <div key={activity.id} className="text-xs text-blue-200 slide-up">
              <span className="font-medium text-white">{activity.user}</span>
              <span> {activity.action} </span>
              {activity.company && (
                <span className="font-medium text-purple-300">{activity.company}</span>
              )}
              <div className="text-blue-300 text-xs">{activity.time} • {activity.location}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof Stats */}
      <div className="glass-effect rounded-xl p-4">
        <div className="text-center mb-3">
          <div className="text-lg font-bold gradient-text">Live Stats</div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="w-4 h-4 text-blue-300 mr-2" />
              <span className="text-sm text-blue-200">Viewing now</span>
            </div>
            <span className="text-white font-semibold">{Math.max(0, viewerCount)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-green-300 mr-2" />
              <span className="text-sm text-blue-200">Applications today</span>
            </div>
            <span className="text-white font-semibold">{applicationCount}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-purple-300 mr-2" />
              <span className="text-sm text-blue-200">Success rate</span>
            </div>
            <span className="text-white font-semibold">95%</span>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="glass-effect rounded-xl p-4 max-w-sm">
        <div className="flex items-center mb-3">
          <Star className="w-4 h-4 text-yellow-400 mr-2" />
          <span className="text-sm font-semibold text-white">Success Stories</span>
        </div>
        
        <div className="space-y-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border-l-2 border-purple-500 pl-3 slide-up">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">{testimonial.avatar}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{testimonial.name}</div>
                  <div className="text-xs text-blue-200">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
              
              <p className="text-xs text-blue-200 mb-2">{testimonial.content}</p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <span className="text-green-400 font-semibold">{testimonial.salary}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 text-blue-300 mr-1" />
                  <span className="text-blue-300">{testimonial.timeToHire}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Authority Badges */}
      <div className="glass-effect rounded-xl p-4">
        <div className="text-center mb-3">
          <div className="text-sm font-semibold text-white">Trusted By</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-purple-500/20 rounded-lg">
            <div className="text-lg">🏢</div>
            <div className="text-xs text-blue-200">Fortune 500</div>
          </div>
          <div className="text-center p-2 bg-green-500/20 rounded-lg">
            <div className="text-lg">⭐</div>
            <div className="text-xs text-blue-200">4.9/5 Rating</div>
          </div>
          <div className="text-center p-2 bg-blue-500/20 rounded-lg">
            <div className="text-lg">🔒</div>
            <div className="text-xs text-blue-200">SOC 2 Certified</div>
          </div>
          <div className="text-center p-2 bg-yellow-500/20 rounded-lg">
            <div className="text-lg">🏆</div>
            <div className="text-xs text-blue-200">Best Platform 2024</div>
          </div>
        </div>
      </div>

      {/* Scarcity Indicators */}
      <div className="glass-effect rounded-xl p-4">
        <div className="text-center">
          <div className="text-sm font-semibold text-red-300 mb-2">🔥 Limited Time</div>
          <div className="text-xs text-blue-200 mb-3">Premium features available for next 24 hours</div>
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover-lift">
            Upgrade Now - 50% Off
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialProof 