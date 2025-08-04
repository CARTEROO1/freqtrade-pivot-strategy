'use client'

import { useState } from 'react'
import { Search, MapPin, Briefcase, Users, Award, TrendingUp, Shield } from 'lucide-react'

export default function ModernHero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Add dopamine reward animation
    const button = e.currentTarget.querySelector('button[type="submit"]')
    if (button) {
      button.innerHTML = `
        <div class="success-checkmark">
          <div class="check-icon">
            <span class="icon-line line-tip"></span>
            <span class="icon-line line-long"></span>
            <div class="icon-circle"></div>
            <div class="icon-fix"></div>
          </div>
        </div>
        <span class="ml-2">Success!</span>
      `
      setTimeout(() => {
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search w-5 h-5 group-hover:animate-pulse">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <span class="ml-2">Find Jobs</span>
        `
      }, 2000)
    }
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-6 animate-fade-in">
            HappyCareer
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-slide-up">
            Find your perfect career match with <span className="font-semibold text-blue-600">verified opportunities</span>
          </p>
          
          {/* Trust Signals */}
          <div className="flex justify-center items-center space-x-8 mb-8 animate-scale-in">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Verified Jobs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">50K+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600">Top Rated</span>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12 animate-bounce-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
              >
                <Search className="w-5 h-5 group-hover:animate-pulse" />
                <span>Find Jobs</span>
              </button>
            </div>
          </div>
        </form>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fast Growing</h3>
            <p className="text-gray-600 text-sm">Join the fastest-growing job platform with verified opportunities</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Safe & Secure</h3>
            <p className="text-gray-600 text-sm">All jobs are verified to ensure legitimate opportunities</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Community Driven</h3>
            <p className="text-gray-600 text-sm">Built by professionals, for professionals</p>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-2xl mx-auto animate-pulse-glow">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">Live Activity</span>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p>🎉 Sarah just found a Senior Developer role at Google</p>
            <p>🚀 15 new verified jobs posted in the last hour</p>
            <p>⭐ 47 people got hired this week</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .success-checkmark {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #fff;
          stroke-miterlimit: 10;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }
        
        .check-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #fff;
          stroke-miterlimit: 10;
          position: relative;
        }
        
        .check-icon .icon-line {
          height: 2px;
          background-color: #fff;
          display: block;
          border-radius: 2px;
          position: absolute;
          z-index: 10;
        }
        
        .check-icon .icon-line.line-tip {
          top: 8px;
          left: 3px;
          width: 5px;
          transform: rotate(45deg);
          animation: icon-line-tip 0.75s;
        }
        
        .check-icon .icon-line.line-long {
          top: 6px;
          right: 2px;
          width: 8px;
          transform: rotate(-45deg);
          animation: icon-line-long 0.75s;
        }
        
        .check-icon .icon-circle {
          top: 0;
          left: 0;
          z-index: 10;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          position: absolute;
          box-sizing: content-box;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }
        
        .check-icon .icon-fix {
          top: 0;
          width: 20px;
          height: 20px;
          z-index: 1;
          border-radius: 50%;
          position: absolute;
          box-sizing: content-box;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }
        
        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 30px #4CAF50;
          }
        }
        
        @keyframes scale {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }
        
        @keyframes icon-line-tip {
          0% {
            width: 0;
            left: 1px;
            top: 9px;
          }
          54% {
            width: 0;
            left: 1px;
            top: 9px;
          }
          70% {
            width: 5px;
            left: -8px;
            top: 8px;
          }
          84% {
            width: 5px;
            left: -8px;
            top: 8px;
          }
          100% {
            width: 5px;
            left: 3px;
            top: 8px;
          }
        }
        
        @keyframes icon-line-long {
          0% {
            width: 0;
            right: 2px;
            top: 6px;
          }
          65% {
            width: 0;
            right: 2px;
            top: 6px;
          }
          84% {
            width: 8px;
            right: -6px;
            top: 6px;
          }
          100% {
            width: 8px;
            right: 2px;
            top: 6px;
          }
        }
      `}</style>
    </section>
  )
} 