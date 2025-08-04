'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Shield, Users } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add success animation
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
        <span class="ml-2">Message Sent!</span>
      `
      setTimeout(() => {
        button.innerHTML = `
          <Send className="w-5 h-5" />
          <span class="ml-2">Send Message</span>
        `
      }, 3000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about job safety? Need to report a scam? We're here to help protect you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Inquiry Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="general">General Inquiry</option>
                  <option value="scam-report">Report a Scam</option>
                  <option value="safety-question">Safety Question</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600">support@happycareer.com</p>
                    <p className="text-gray-600">safety@happycareer.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600">123 Safety Street</p>
                    <p className="text-gray-600">Secure City, SC 12345</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM EST</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-red-800">Emergency Safety Contact</h3>
              </div>
              <p className="text-red-700 mb-4">
                If you've been scammed or need immediate assistance:
              </p>
              <div className="space-y-2 text-red-700">
                <p><strong>24/7 Safety Hotline:</strong> +1 (555) 999-8888</p>
                <p><strong>Emergency Email:</strong> emergency@happycareer.com</p>
                <p className="text-sm">We respond to safety emergencies within 1 hour</p>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-blue-800">Response Times</h3>
              </div>
              <div className="space-y-3 text-blue-700">
                <div className="flex justify-between">
                  <span>Safety Emergencies:</span>
                  <span className="font-semibold">Within 1 hour</span>
                </div>
                <div className="flex justify-between">
                  <span>Scam Reports:</span>
                  <span className="font-semibold">Within 4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>General Inquiries:</span>
                  <span className="font-semibold">Within 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Technical Support:</span>
                  <span className="font-semibold">Within 48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I report a job scam?</h3>
                <p className="text-gray-600 text-sm">
                  Use our contact form and select "Report a Scam" or email us directly at safety@happycareer.com 
                  with details about the suspicious job posting.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What information should I include?</h3>
                <p className="text-gray-600 text-sm">
                  Include the job posting URL, company name, contact information, and any suspicious messages 
                  or requests you received.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How quickly do you respond?</h3>
                <p className="text-gray-600 text-sm">
                  We prioritize safety reports and respond to scam reports within 4 hours. General inquiries 
                  are typically answered within 24 hours.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I remain anonymous?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, you can report scams anonymously. However, providing your contact information helps 
                  us follow up with additional questions if needed.
                </p>
              </div>
            </div>
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
    </main>
  )
} 