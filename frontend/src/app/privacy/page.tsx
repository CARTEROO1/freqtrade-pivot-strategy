'use client'

import { Shield, Lock, Eye, Users, Database, Bell } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              At HappyCareer, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform 
              to search for jobs and career opportunities.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Database className="w-6 h-6 text-blue-600 mr-2" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
                <ul className="text-gray-600 space-y-1 ml-4">
                  <li>• Name and contact information (email, phone number)</li>
                  <li>• Educational background and qualifications</li>
                  <li>• Work experience and skills</li>
                  <li>• Resume and cover letter content</li>
                  <li>• Profile information and preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Usage Information</h3>
                <ul className="text-gray-600 space-y-1 ml-4">
                  <li>• Job search queries and preferences</li>
                  <li>• Application history and interactions</li>
                  <li>• Platform usage patterns and analytics</li>
                  <li>• Device information and IP addresses</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="w-6 h-6 text-green-600 mr-2" />
              How We Use Your Information
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Job Matching</h4>
                  <p className="text-blue-700 text-sm">Match you with relevant job opportunities based on your skills and preferences</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Scam Prevention</h4>
                  <p className="text-green-700 text-sm">Verify employers and detect fraudulent job postings to protect you</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Platform Improvement</h4>
                  <p className="text-purple-700 text-sm">Analyze usage patterns to improve our services and user experience</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Communication</h4>
                  <p className="text-orange-700 text-sm">Send you job alerts, updates, and important safety notifications</p>
                </div>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 text-purple-600 mr-2" />
              Information Sharing
            </h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="text-gray-600 space-y-2 ml-4">
              <li>• <strong>With your consent:</strong> When you explicitly agree to share information with employers</li>
              <li>• <strong>For safety:</strong> To report fraudulent activities to authorities</li>
              <li>• <strong>Legal requirements:</strong> When required by law or to protect our rights</li>
              <li>• <strong>Service providers:</strong> With trusted partners who help us operate our platform</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 text-red-600 mr-2" />
              Data Security
            </h2>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">How We Protect You</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-red-700 mb-1">Encryption</h4>
                  <p className="text-red-600">All data is encrypted using industry-standard SSL/TLS protocols</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-1">Access Control</h4>
                  <p className="text-red-600">Strict access controls limit who can view your personal information</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-1">Regular Audits</h4>
                  <p className="text-red-600">We conduct regular security audits and vulnerability assessments</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-1">Data Backup</h4>
                  <p className="text-red-600">Secure backup systems protect your information from loss</p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Access & Control</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• View and update your personal information</li>
                  <li>• Download your data</li>
                  <li>• Delete your account</li>
                  <li>• Opt-out of communications</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Privacy Settings</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Control profile visibility</li>
                  <li>• Manage job alerts</li>
                  <li>• Set communication preferences</li>
                  <li>• Configure data sharing options</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> privacy@happycareer.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Safety Street, Secure City, SC 12345</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
} 