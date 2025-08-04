'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, DollarSign, Target, Activity, BarChart3, PieChart, LineChart } from 'lucide-react'

interface Metric {
  name: string
  value: number
  change: number
  target: number
  icon: string
  color: string
}

interface ConversionFunnel {
  stage: string
  visitors: number
  conversion: number
  dropoff: number
}

interface UserBehavior {
  timeOnSite: number
  bounceRate: number
  pagesPerSession: number
  returnRate: number
}

const BusinessDashboard = () => {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [funnel, setFunnel] = useState<ConversionFunnel[]>([])
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    timeOnSite: 0,
    bounceRate: 0,
    pagesPerSession: 0,
    returnRate: 0
  })

  // Initialize metrics with psychological targets
  useEffect(() => {
    const initialMetrics: Metric[] = [
      {
        name: 'Conversion Rate',
        value: 3.2,
        change: 12.5,
        target: 5.0,
        icon: '📈',
        color: 'from-green-500 to-emerald-500'
      },
      {
        name: 'User Engagement',
        value: 78.5,
        change: 8.3,
        target: 85.0,
        icon: '🎯',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        name: 'Revenue per User',
        value: 45.20,
        change: 15.7,
        target: 60.0,
        icon: '💰',
        color: 'from-purple-500 to-pink-500'
      },
      {
        name: 'Retention Rate',
        value: 67.8,
        change: 5.2,
        target: 75.0,
        icon: '🔄',
        color: 'from-orange-500 to-red-500'
      }
    ]

    setMetrics(initialMetrics)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 0.5,
        change: metric.change + (Math.random() - 0.5) * 2
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Conversion funnel data
  useEffect(() => {
    const funnelData: ConversionFunnel[] = [
      { stage: 'Landing Page', visitors: 10000, conversion: 100, dropoff: 0 },
      { stage: 'Job Browse', visitors: 8500, conversion: 85, dropoff: 15 },
      { stage: 'Job View', visitors: 6800, conversion: 68, dropoff: 17 },
      { stage: 'Application Start', visitors: 4760, conversion: 47.6, dropoff: 20.4 },
      { stage: 'Application Complete', visitors: 3332, conversion: 33.3, dropoff: 14.3 },
      { stage: 'Profile Creation', visitors: 2332, conversion: 23.3, dropoff: 10 }
    ]

    setFunnel(funnelData)
  }, [])

  // User behavior simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setUserBehavior({
        timeOnSite: 180 + Math.random() * 60,
        bounceRate: 35 + Math.random() * 10,
        pagesPerSession: 4.2 + Math.random() * 0.8,
        returnRate: 45 + Math.random() * 15
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100
    if (percentage >= 80) return 'text-green-400'
    if (percentage >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="glass-effect rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold gradient-text">Business Analytics</h3>
          <div className="flex items-center text-xs text-blue-200">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="text-center">
              <div className="text-2xl mb-1">{metric.icon}</div>
              <div className="text-sm font-semibold text-white">{metric.name}</div>
              <div className={`text-lg font-bold ${getProgressColor(metric.value, metric.target)}`}>
                {metric.value.toFixed(1)}%
              </div>
              <div className="text-xs text-blue-200">
                Target: {metric.target}%
              </div>
              <div className={`text-xs ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>

        {/* Conversion Funnel */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-white mb-2">Conversion Funnel</h4>
          <div className="space-y-2">
            {funnel.map((stage, index) => (
              <div key={stage.stage} className="flex items-center justify-between text-xs">
                <span className="text-blue-200 w-24 truncate">{stage.stage}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white">{stage.conversion}%</span>
                  <div className="w-16 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${stage.conversion}%` }}
                    ></div>
                  </div>
                  <span className="text-red-400">-{stage.dropoff}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Behavior */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-white mb-2">User Behavior</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center">
              <div className="text-blue-200">Time on Site</div>
              <div className="text-white font-semibold">{Math.round(userBehavior.timeOnSite)}s</div>
            </div>
            <div className="text-center">
              <div className="text-blue-200">Bounce Rate</div>
              <div className="text-white font-semibold">{userBehavior.bounceRate.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-blue-200">Pages/Session</div>
              <div className="text-white font-semibold">{userBehavior.pagesPerSession.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-blue-200">Return Rate</div>
              <div className="text-white font-semibold">{userBehavior.returnRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Psychological Insights */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2">Psychological Insights</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-blue-200">Dopamine Triggers</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Social Proof</span>
              <span className="text-green-400">High Impact</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Scarcity Signals</span>
              <span className="text-yellow-400">Moderate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Authority Building</span>
              <span className="text-green-400">Strong</span>
            </div>
          </div>
        </div>

        {/* A/B Testing Status */}
        <div className="mt-4 p-3 bg-purple-500/20 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-200">A/B Test Active</span>
            <span className="text-green-400">Variation B +23%</span>
          </div>
          <div className="text-xs text-purple-200 mt-1">
            Testing: Hero CTA button color
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessDashboard 