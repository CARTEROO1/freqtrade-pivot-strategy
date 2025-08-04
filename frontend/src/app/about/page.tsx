'use client'

import { Users, Target, Heart, Award, Shield, TrendingUp, GraduationCap, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About HappyCareer
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Building a safer future for students and recent graduates
          </p>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            We're on a mission to protect students from job scams while connecting them with legitimate career opportunities
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  HappyCareer was founded in 2023 by a team of former students who experienced firsthand the 
                  challenges of navigating the job market while avoiding scams and fraudulent opportunities.
                </p>
                <p>
                  After witnessing friends fall victim to job scams that cost them money, time, and personal 
                  information, we decided to create a platform that would protect students and recent graduates 
                  from these threats.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 students and have prevented hundreds of scams, 
                  helping young professionals start their careers safely and confidently.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why We Started</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Personal Experience</h4>
                    <p className="text-gray-600 text-sm">Our founders were victims of job scams during their student years</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Growing Problem</h4>
                    <p className="text-gray-600 text-sm">Job scams targeting students increased by 300% in recent years</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Solution Needed</h4>
                    <p className="text-gray-600 text-sm">No existing platform focused on student safety and scam prevention</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Student Safety First</h3>
              <p className="text-gray-600">
                Every decision we make prioritizes the safety and security of our student users
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-600">
                We believe in open communication and clear, honest practices
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Empathy</h3>
              <p className="text-gray-600">
                We understand the challenges students face and design solutions with compassion
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our technology to better protect and serve our community
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Education</h3>
              <p className="text-gray-600">
                We believe in empowering students with knowledge to make informed decisions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We build and nurture a supportive community of students and employers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind HappyCareer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Chen</h3>
              <p className="text-blue-600 font-semibold mb-3">CEO & Co-Founder</p>
              <p className="text-gray-600 text-sm">
                Former software engineer at Google. Experienced job scam victim who turned her pain into purpose.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Michael Rodriguez</h3>
              <p className="text-green-600 font-semibold mb-3">CTO & Co-Founder</p>
              <p className="text-gray-600 text-sm">
                Cybersecurity expert with 10+ years experience. Built the AI-powered scam detection system.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emily Johnson</h3>
              <p className="text-purple-600 font-semibold mb-3">Head of Student Success</p>
              <p className="text-gray-600 text-sm">
                Former career counselor. Dedicated to helping students navigate their career journey safely.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">David Kim</h3>
              <p className="text-red-600 font-semibold mb-3">Head of Product</p>
              <p className="text-gray-600 text-sm">
                UX/UI expert focused on creating intuitive, safe experiences for students.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-12 h-12 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lisa Thompson</h3>
              <p className="text-yellow-600 font-semibold mb-3">Head of Partnerships</p>
              <p className="text-gray-600 text-sm">
                Former HR manager. Ensures all employer partners meet our strict verification standards.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-12 h-12 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Alex Patel</h3>
              <p className="text-indigo-600 font-semibold mb-3">Head of Community</p>
              <p className="text-gray-600 text-sm">
                Community builder and safety advocate. Manages our reporting system and user support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-xl opacity-90">
              Real results that show our commitment to student safety
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="opacity-90">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="opacity-90">Scams Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">47</div>
              <div className="opacity-90">Students Protected</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="opacity-90">Verified Jobs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Help us create a safer job market for students everywhere
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => alert('Start Safe Job Search feature coming soon! This will take you to our verified job listings with scam protection.')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Safe Job Search
            </button>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-4 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Our Team
            </button>
          </div>
        </div>
      </section>
    </main>
  )
} 