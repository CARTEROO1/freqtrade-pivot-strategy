'use client'

import { useState, useEffect, useCallback } from 'react'

interface DopamineTrigger {
  id: string
  type: 'success' | 'achievement' | 'progress' | 'surprise'
  message: string
  animation: string
  reward: number
  probability: number
}

interface UserProgress {
  applications: number
  profileCompletion: number
  streakDays: number
  achievements: number
  totalPoints: number
}

const DopamineEngine = () => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    applications: 0,
    profileCompletion: 0,
    streakDays: 0,
    achievements: 0,
    totalPoints: 0
  })

  const [activeTriggers, setActiveTriggers] = useState<DopamineTrigger[]>([])
  const [showReward, setShowReward] = useState(false)
  const [rewardMessage, setRewardMessage] = useState('')

  // Variable reward schedule triggers
  const dopamineTriggers: DopamineTrigger[] = [
    {
      id: 'profile_complete',
      type: 'achievement',
      message: '🎉 Profile Complete! +50 points',
      animation: 'bounce-in',
      reward: 50,
      probability: 1.0
    },
    {
      id: 'first_application',
      type: 'success',
      message: '🚀 First Application! +25 points',
      animation: 'slide-up',
      reward: 25,
      probability: 1.0
    },
    {
      id: 'streak_3_days',
      type: 'achievement',
      message: '🔥 3-Day Streak! +100 points',
      animation: 'pulse-glow',
      reward: 100,
      probability: 0.8
    },
    {
      id: 'premium_job_match',
      type: 'surprise',
      message: '💎 Premium Match Found! +200 points',
      animation: 'shimmer',
      reward: 200,
      probability: 0.3
    },
    {
      id: 'social_connection',
      type: 'progress',
      message: '🤝 New Connection! +75 points',
      animation: 'float',
      reward: 75,
      probability: 0.6
    },
    {
      id: 'salary_boost',
      type: 'surprise',
      message: '💰 Salary Boost Opportunity! +150 points',
      animation: 'bounce-in',
      reward: 150,
      probability: 0.2
    }
  ]

  // Trigger dopamine reward based on probability
  const triggerDopamineReward = useCallback((triggerId: string) => {
    const trigger = dopamineTriggers.find(t => t.id === triggerId)
    if (!trigger) return

    // Variable reward schedule - sometimes trigger, sometimes not
    if (Math.random() < trigger.probability) {
      setRewardMessage(trigger.message)
      setShowReward(true)
      setActiveTriggers(prev => [...prev, trigger])
      
      // Update user progress
      setUserProgress(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + trigger.reward,
        achievements: trigger.type === 'achievement' ? prev.achievements + 1 : prev.achievements
      }))

      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowReward(false)
        setActiveTriggers(prev => prev.filter(t => t.id !== trigger.id))
      }, 3000)
    }
  }, [dopamineTriggers])

  // Simulate user actions for demo
  useEffect(() => {
    const simulateUserActions = () => {
      const actions = [
        () => triggerDopamineReward('profile_complete'),
        () => triggerDopamineReward('first_application'),
        () => triggerDopamineReward('streak_3_days'),
        () => triggerDopamineReward('premium_job_match'),
        () => triggerDopamineReward('social_connection'),
        () => triggerDopamineReward('salary_boost')
      ]

      // Randomly trigger actions every 5-15 seconds
      const interval = setInterval(() => {
        const randomAction = actions[Math.floor(Math.random() * actions.length)]
        randomAction()
      }, Math.random() * 10000 + 5000)

      return () => clearInterval(interval)
    }

    const cleanup = simulateUserActions()
    return cleanup
  }, [triggerDopamineReward])

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Progress Display */}
      <div className="glass-effect rounded-xl p-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text mb-2">
            {userProgress.totalPoints} pts
          </div>
          <div className="text-sm text-blue-200">
            Level {Math.floor(userProgress.totalPoints / 100) + 1}
          </div>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-xs text-blue-200">
            <span>Applications</span>
            <span>{userProgress.applications}</span>
          </div>
          <div className="flex justify-between text-xs text-blue-200">
            <span>Achievements</span>
            <span>{userProgress.achievements}</span>
          </div>
          <div className="flex justify-between text-xs text-blue-200">
            <span>Streak</span>
            <span>{userProgress.streakDays} days</span>
          </div>
        </div>
      </div>

      {/* Active Triggers */}
      {activeTriggers.map((trigger) => (
        <div
          key={trigger.id}
          className={`glass-effect rounded-xl p-4 mb-2 ${trigger.animation} hover-lift`}
        >
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-1">
              {trigger.message}
            </div>
            <div className="text-sm text-blue-200">
              +{trigger.reward} points
            </div>
          </div>
        </div>
      ))}

      {/* Floating Reward Notification */}
      {showReward && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-2xl bounce-in">
            {rewardMessage}
          </div>
        </div>
      )}

      {/* Demo Controls */}
      <div className="glass-effect rounded-xl p-4">
        <div className="text-sm text-blue-200 mb-3">Demo Triggers:</div>
        <div className="grid grid-cols-2 gap-2">
          {dopamineTriggers.map((trigger) => (
            <button
              key={trigger.id}
              onClick={() => triggerDopamineReward(trigger.id)}
              className="px-3 py-2 bg-purple-600/20 text-purple-200 text-xs rounded-lg hover:bg-purple-600/40 transition-colors"
            >
              {trigger.type}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DopamineEngine 