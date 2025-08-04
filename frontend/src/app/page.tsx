'use client'

import ModernHero from '../components/home/ModernHero'
import FeaturedJobs from '../components/home/FeaturedJobs'
import BlogSection from '../components/blog/BlogSection'
import BlogPostCreator from '../components/blog/BlogPostCreator'

export default function Home() {
  return (
    <main className="relative">
      {/* Main Content */}
      <ModernHero />
      <FeaturedJobs />
      <BlogSection />
      <BlogPostCreator />
      
      {/* Success Animation Trigger for Demo */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button 
          onClick={() => {
            const checkmark = document.createElement('div')
            checkmark.className = 'success-checkmark'
            checkmark.innerHTML = `
              <svg class="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="success-checkmark__check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
            `
            document.body.appendChild(checkmark)
            setTimeout(() => checkmark.remove(), 2000)
          }}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover-lift"
        >
          🎉 Trigger Success Animation
        </button>
      </div>
    </main>
  )
} 