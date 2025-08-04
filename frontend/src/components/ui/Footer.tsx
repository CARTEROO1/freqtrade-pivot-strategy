'use client'

import React from 'react';
import Link from 'next/link';
import { Shield, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  const handleSocialClick = (platform: string) => {
    // You can replace these URLs with your actual social media profiles
    const socialUrls = {
      linkedin: 'https://linkedin.com/company/happycareer',
      reddit: 'https://reddit.com/r/happycareer',
      quora: 'https://quora.com/profile/HappyCareer',
      facebook: 'https://facebook.com/happycareer',
      medium: 'https://medium.com/@happycareer'
    }
    
    const url = socialUrls[platform as keyof typeof socialUrls]
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      // Fallback: show a message or alert
      alert(`${platform.charAt(0).toUpperCase() + platform.slice(1)} profile coming soon!`)
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">HappyCareer</h3>
            <p className="text-gray-300 mb-4">
              AI-powered job platform with advanced legal assistance and career guidance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-white">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href="/post-job" className="text-gray-300 hover:text-white">
                  Post Job
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-of-service" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal-disclaimer" className="text-gray-300 hover:text-white">
                  Legal Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/ai-legal-terms" className="text-gray-300 hover:text-white">
                  AI Legal Terms
                </Link>
              </li>
              <li>
                <Link href="/lawyer-network-terms" className="text-gray-300 hover:text-white">
                  Lawyer Network Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} HappyCareer. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-300 text-sm">
                <strong>⚠️ Important:</strong> HappyCareer provides AI-powered legal information, not legal advice. 
                For specific legal matters, consult qualified attorneys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 