'use client'

import { FileText, AlertTriangle, Shield, Users, Gavel, CheckCircle } from 'lucide-react'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using HappyCareer ("the Platform"), you agree to be bound by these Terms of Service. 
              These terms govern your use of our job search platform and outline the rules and responsibilities for all users.
            </p>
          </section>

          {/* Platform Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 text-blue-600 mr-2" />
              About HappyCareer
            </h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-blue-800 mb-4">
                HappyCareer is a job search platform designed to connect students and recent graduates with legitimate 
                career opportunities while protecting them from scams and fraudulent job postings.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-blue-700 mb-1">Our Mission</h4>
                  <p className="text-blue-600">Protect students from job scams and fraud</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-1">Our Promise</h4>
                  <p className="text-blue-600">100% verified job opportunities</p>
                </div>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 text-purple-600 mr-2" />
              User Responsibilities
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Account Creation</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Provide accurate and truthful information</li>
                  <li>• Maintain the security of your account credentials</li>
                  <li>• Notify us immediately of any unauthorized access</li>
                  <li>• Keep your profile information up to date</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Platform Usage</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Use the platform for legitimate job searching only</li>
                  <li>• Respect other users and employers</li>
                  <li>• Report suspicious activities or fraudulent job postings</li>
                  <li>• Comply with all applicable laws and regulations</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Prohibited Activities</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Creating fake accounts or impersonating others</li>
                  <li>• Posting fraudulent job opportunities</li>
                  <li>• Attempting to scam or defraud other users</li>
                  <li>• Violating intellectual property rights</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Platform Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">What We Provide</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Access to verified job opportunities</li>
                  <li>• AI-powered scam detection</li>
                  <li>• Company verification services</li>
                  <li>• Job application tools</li>
                  <li>• Career guidance resources</li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">What We Don't Provide</h3>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Guaranteed job placement</li>
                  <li>• Direct employment services</li>
                  <li>• Legal or financial advice</li>
                  <li>• Background check services</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Safety and Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              Safety and Security
            </h2>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Our Safety Measures</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-red-700 mb-1">Job Verification</h4>
                  <p className="text-red-600">All job postings are verified for legitimacy</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-1">Scam Detection</h4>
                  <p className="text-red-600">AI algorithms identify and block fraudulent posts</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-1">Company Vetting</h4>
                  <p className="text-red-600">Employers are thoroughly background-checked</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-1">Community Reporting</h4>
                  <p className="text-red-600">Users can report suspicious activities</p>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Platform Rights</h3>
                <p className="text-gray-600 text-sm">
                  HappyCareer owns all intellectual property rights to the platform, including but not limited to 
                  trademarks, copyrights, and trade secrets. Users retain rights to their personal content.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">User Content</h3>
                <p className="text-gray-600 text-sm">
                  By posting content on our platform, you grant us a license to use, display, and distribute 
                  your content for platform purposes while maintaining your ownership rights.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Gavel className="w-6 h-6 text-gray-600 mr-2" />
              Limitation of Liability
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                While we strive to provide a safe and reliable platform, HappyCareer cannot guarantee:
              </p>
              <ul className="text-gray-600 space-y-2 ml-4">
                <li>• 100% elimination of all fraudulent job postings</li>
                <li>• Successful job placement for all users</li>
                <li>• Continuous platform availability</li>
                <li>• Accuracy of all employer information</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Our liability is limited to the amount paid for our services, if any.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Termination</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">By You</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• You may delete your account at any time</li>
                  <li>• Account deletion is permanent</li>
                  <li>• We will delete your personal data</li>
                  <li>• Some data may be retained for legal purposes</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">By Us</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Violation of these terms</li>
                  <li>• Fraudulent or illegal activities</li>
                  <li>• Extended periods of inactivity</li>
                  <li>• Platform discontinuation</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <div className="bg-yellow-50 rounded-lg p-6">
              <p className="text-yellow-800 mb-4">
                We may update these Terms of Service from time to time. We will notify users of significant changes 
                through email or platform notifications.
              </p>
              <p className="text-yellow-700 text-sm">
                Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> legal@happycareer.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Safety Street, Secure City, SC 12345</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
} 