'use client'

import { Shield, AlertTriangle, GraduationCap, Eye, Users, Target, Heart, Zap } from 'lucide-react'

export default function VisionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our Vision
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            <span className="font-bold">Protecting Students</span> from Job Scams & Fraud
          </p>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Building a safer future where every student can pursue their career dreams without fear of exploitation
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              HappyCareer was founded with a simple yet powerful mission: to create a safe, 
              trusted platform where students and recent graduates can find legitimate career 
              opportunities without falling victim to scams and fraud.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                The Problem We're Solving
              </h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Rising Job Scams</h4>
                    <p>Students are increasingly targeted by sophisticated job scams, losing money and personal information</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Fake Internships</h4>
                    <p>Fraudulent internship offers that ask for upfront fees or personal data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Identity Theft</h4>
                    <p>Scammers posing as legitimate employers to steal personal information</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Solution
              </h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">AI-Powered Verification</h4>
                    <p>Advanced algorithms detect and block fraudulent job postings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Company Verification</h4>
                    <p>All employers are thoroughly vetted before posting opportunities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Community Reporting</h4>
                    <p>Students can report suspicious activities to protect others</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600">
              Real numbers that show our commitment to student safety
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">500+</div>
              <div className="text-gray-600">Scams Blocked</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">47</div>
              <div className="text-gray-600">Students Protected</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Verified Jobs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How We Protect You
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive safety measures to keep students secure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scam Detection</h3>
              <p className="text-gray-600 mb-4">
                AI-powered algorithms analyze job postings to identify potential scams and fraudulent activities.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pattern recognition for common scam tactics</li>
                <li>• Real-time fraud detection</li>
                <li>• Automated blocking of suspicious posts</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Company Verification</h3>
              <p className="text-gray-600 mb-4">
                Every employer is thoroughly vetted before being allowed to post job opportunities.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Business registration verification</li>
                <li>• Domain and email validation</li>
                <li>• Background checks on employers</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Student-Focused</h3>
              <p className="text-gray-600 mb-4">
                Built specifically for students and recent graduates with their unique needs in mind.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Internship and entry-level focus</li>
                <li>• Student-friendly application process</li>
                <li>• Career guidance and resources</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Reporting</h3>
              <p className="text-gray-600 mb-4">
                Students can report suspicious activities to help protect the entire community.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Easy reporting system</li>
                <li>• Quick response to alerts</li>
                <li>• Community-driven safety</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safety Education</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive resources to help students identify and avoid job scams.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Safety tips and guidelines</li>
                <li>• Red flag identification</li>
                <li>• Best practices for job hunting</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Alerts</h3>
              <p className="text-gray-600 mb-4">
                Instant notifications about new scams and safety threats in the job market.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Immediate scam notifications</li>
                <li>• Market trend alerts</li>
                <li>• Safety updates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Help us create a safer job market for students everywhere
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => alert('Start Safe Job Search feature coming soon! This will take you to our verified job listings with scam protection.')}
              className="px-8 py-4 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Safe Job Search
            </button>
            <button 
              onClick={() => alert('Report a Scam feature coming soon! This will help protect other students from fraudulent job postings.')}
              className="px-8 py-4 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
            >
              Report a Scam
            </button>
          </div>
        </div>
      </section>
    </main>
  )
} 