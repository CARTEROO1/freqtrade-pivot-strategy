import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/themes.css'
import Navigation from '../components/ui/Navigation'
import Footer from '../components/ui/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'HappyCareer - Protecting Students from Job Scams & Fraud',
  description: 'Safe job search platform for students. Find verified opportunities while avoiding scams and fraud. AI-powered scam detection keeps you protected.',
  keywords: 'student jobs, scam prevention, job safety, verified employers, fraud protection, internship safety, career guidance',
  authors: [{ name: 'HappyCareer Team' }],
  openGraph: {
    title: 'HappyCareer - Student Job Safety Platform',
    description: 'Protecting students from job scams and fraud with verified opportunities',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="default">
      <body className="min-h-screen bg-bg-primary text-text-primary">
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
} 