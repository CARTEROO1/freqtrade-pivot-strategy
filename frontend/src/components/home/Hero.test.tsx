import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ModernHero from './ModernHero'

// Mock the ThemeSwitcher component
jest.mock('../ui/ThemeSwitcher', () => {
  return function MockThemeSwitcher() {
    return <div data-testid="theme-switcher">Theme Switcher</div>
  }
})

describe('ModernHero', () => {
  beforeEach(() => {
    // Mock fetch for the search functionality
    global.fetch = jest.fn()
  })

  it('renders hero section with search form', () => {
    render(<ModernHero />)
    
    // Check for main elements
    expect(screen.getByText(/Find Your Dream Job with/)).toBeInTheDocument()
    expect(screen.getByText(/AI-Powered Matching/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Job title, keywords, or company/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Location/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Search Jobs/ })).toBeInTheDocument()
  })

  it('renders statistics section', () => {
    render(<ModernHero />)
    
    // Check for stats
    expect(screen.getByText('50K+')).toBeInTheDocument()
    expect(screen.getByText('Active Jobs')).toBeInTheDocument()
    expect(screen.getByText('10K+')).toBeInTheDocument()
    expect(screen.getByText('Companies')).toBeInTheDocument()
    expect(screen.getByText('100K+')).toBeInTheDocument()
    expect(screen.getByText('Job Seekers')).toBeInTheDocument()
    expect(screen.getByText('95%')).toBeInTheDocument()
    expect(screen.getByText('Success Rate')).toBeInTheDocument()
  })

  it('renders featured companies', () => {
    render(<ModernHero />)
    
    // Check for featured companies
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Microsoft')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Amazon')).toBeInTheDocument()
    expect(screen.getByText('Meta')).toBeInTheDocument()
    expect(screen.getByText('Netflix')).toBeInTheDocument()
  })

  it('handles search form submission', async () => {
    render(<ModernHero />)
    
    const jobInput = screen.getByPlaceholderText(/Job title, keywords, or company/)
    const locationInput = screen.getByPlaceholderText(/Location/)
    const searchButton = screen.getByRole('button', { name: /Search Jobs/ })
    
    // Fill in the form
    fireEvent.change(jobInput, { target: { value: 'Software Engineer' } })
    fireEvent.change(locationInput, { target: { value: 'San Francisco' } })
    
    // Submit the form
    fireEvent.click(searchButton)
    
    // Check that the button shows loading state
    expect(screen.getByText('Searching...')).toBeInTheDocument()
  })

  it('renders navigation elements', () => {
    render(<ModernHero />)
    
    // Check for navigation elements
    expect(screen.getByText('JobPortal')).toBeInTheDocument()
    expect(screen.getByText('Find Jobs')).toBeInTheDocument()
    expect(screen.getByText('Post Jobs')).toBeInTheDocument()
    expect(screen.getByText('Companies')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('renders theme switcher', () => {
    render(<ModernHero />)
    
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument()
  })

  it('displays AI-powered badge', () => {
    render(<ModernHero />)
    
    expect(screen.getByText('AI-Powered Job Matching')).toBeInTheDocument()
  })

  it('renders scroll indicator', () => {
    render(<ModernHero />)
    
    // The scroll indicator should be present (it's an animated element)
    const scrollIndicator = document.querySelector('.animate-bounce')
    expect(scrollIndicator).toBeInTheDocument()
  })
}) 