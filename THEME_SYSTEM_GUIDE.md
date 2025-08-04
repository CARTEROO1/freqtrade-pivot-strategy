# 🎨 HappyCareer Theme System Guide

## Overview

This theme system is inspired by modern design patterns similar to [Hamhey's website](https://www.hamhey.com/) but with different color schemes and enhanced functionality. It provides a comprehensive design system with multiple color themes, component styles, and utility classes.

## 🎯 Features

### ✅ Multiple Color Themes
- **Professional Blue** (Default) - Modern, trustworthy
- **Green Growth** - Fresh, success-oriented
- **Creative Orange** - Energetic, innovative
- **Innovation Purple** - Tech-focused, premium
- **Dark Mode** - Sleek, modern

### ✅ Component System
- Hero sections with gradient backgrounds
- Card components with hover effects
- Button variants (primary, secondary, ghost)
- Form elements with consistent styling
- Navigation components

### ✅ Utility Classes
- CSS custom properties for easy theming
- Tailwind CSS integration
- Responsive design utilities
- Animation classes

## 🚀 Quick Start

### 1. Import Theme Styles
```typescript
// In your layout.tsx
import '../styles/themes.css'
```

### 2. Use Theme Switcher
```tsx
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'

// Add to your navigation
<ThemeSwitcher />
```

### 3. Apply Themes Programmatically
```typescript
// Switch themes
const root = document.documentElement
root.setAttribute('data-theme', 'green') // or 'orange', 'purple', 'dark'
```

## 🎨 Available Themes

### Professional Blue (Default)
```css
--primary-blue: #2563eb
--secondary-teal: #0d9488
--accent-purple: #7c3aed
```
**Best for**: Professional career platforms, corporate websites

### Green Growth
```css
--primary-blue: #059669
--secondary-teal: #0891b2
--accent-purple: #7c3aed
```
**Best for**: Growth-focused companies, sustainability themes

### Creative Orange
```css
--primary-blue: #ea580c
--secondary-teal: #dc2626
--accent-purple: #7c2d12
```
**Best for**: Creative industries, energetic brands

### Innovation Purple
```css
--primary-blue: #7c3aed
--secondary-teal: #ec4899
--accent-purple: #3b82f6
```
**Best for**: Tech companies, innovative startups

### Dark Mode
```css
--bg-primary: #0f172a
--text-primary: #f8fafc
--border-light: #334155
```
**Best for**: Modern applications, developer tools

## 🧩 Components

### Hero Section
```tsx
import ModernHero from '@/components/home/ModernHero'

// Use in your page
<ModernHero />
```

**Features**:
- Gradient backgrounds
- Animated elements
- Search functionality
- Stats display
- Company logos

### Cards
```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Buttons
```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-ghost">Ghost Button</button>
```

### Forms
```html
<div class="form-group">
  <label class="form-label">Input Label</label>
  <input type="text" class="form-input" placeholder="Enter text..." />
</div>
```

## 🎯 CSS Custom Properties

### Color Variables
```css
/* Primary Colors */
--primary-blue: #2563eb
--primary-blue-dark: #1d4ed8
--primary-blue-light: #3b82f6

/* Secondary Colors */
--secondary-teal: #0d9488
--secondary-teal-dark: #0f766e
--secondary-teal-light: #14b8a6

/* Accent Colors */
--accent-purple: #7c3aed
--accent-purple-dark: #6d28d9
--accent-purple-light: #8b5cf6

/* Semantic Colors */
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6
```

### Background & Text
```css
--bg-primary: #ffffff
--bg-secondary: #f8fafc
--bg-tertiary: #f1f5f9
--text-primary: #1e293b
--text-secondary: #64748b
--text-muted: #94a3b8
```

### Spacing & Borders
```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
--spacing-2xl: 3rem
--spacing-3xl: 4rem

--border-light: #e2e8f0
--border-medium: #cbd5e1
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

## 🎨 Tailwind Integration

### Custom Colors
```html
<!-- Primary Colors -->
<div class="bg-primary text-white">Primary Background</div>
<div class="bg-primary-light">Light Primary</div>
<div class="bg-primary-dark">Dark Primary</div>

<!-- Secondary Colors -->
<div class="bg-secondary">Secondary Background</div>
<div class="bg-secondary-light">Light Secondary</div>
<div class="bg-secondary-dark">Dark Secondary</div>

<!-- Background Colors -->
<div class="bg-bg-primary">Primary Background</div>
<div class="bg-bg-secondary">Secondary Background</div>
<div class="bg-bg-tertiary">Tertiary Background</div>

<!-- Text Colors -->
<div class="text-text-primary">Primary Text</div>
<div class="text-text-secondary">Secondary Text</div>
<div class="text-text-muted">Muted Text</div>
```

### Gradients
```html
<div class="bg-gradient-primary">Primary Gradient</div>
<div class="bg-gradient-secondary">Secondary Gradient</div>
<div class="bg-gradient-hero">Hero Gradient</div>
```

### Animations
```html
<div class="animate-fade-in">Fade In Animation</div>
<div class="animate-slide-up">Slide Up Animation</div>
<div class="animate-scale-in">Scale In Animation</div>
<div class="animate-pulse-glow">Pulse Glow Animation</div>
```

## 🎯 Usage Examples

### Creating a Themed Page
```tsx
'use client'

import { useState } from 'react'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'
import ModernHero from '@/components/home/ModernHero'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navigation with Theme Switcher */}
      <nav className="navbar">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="navbar-brand">JobPortal</h1>
          <ThemeSwitcher />
        </div>
      </nav>

      {/* Hero Section */}
      <ModernHero />

      {/* Content Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="card-header">
                <h3>Feature 1</h3>
              </div>
              <div className="card-body">
                <p>Description of feature 1</p>
              </div>
            </div>
            {/* More cards... */}
          </div>
        </div>
      </section>
    </div>
  )
}
```

### Custom Component with Theme
```tsx
interface JobCardProps {
  title: string
  company: string
  location: string
  salary?: string
}

export function JobCard({ title, company, location, salary }: JobCardProps) {
  return (
    <div className="card hover:scale-105 transition-transform">
      <div className="card-body">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-text-secondary mb-1">{company}</p>
        <p className="text-text-muted text-sm mb-3">{location}</p>
        {salary && (
          <p className="text-primary font-medium">{salary}</p>
        )}
        <button className="btn btn-primary mt-4">
          Apply Now
        </button>
      </div>
    </div>
  )
}
```

## 🎨 Customization

### Adding New Themes
```css
/* Add to themes.css */
[data-theme="custom"] {
  --primary-blue: #your-color;
  --secondary-teal: #your-color;
  --accent-purple: #your-color;
  /* ... other variables */
}
```

### Modifying Existing Themes
```css
/* Override specific variables */
[data-theme="default"] {
  --primary-blue: #your-custom-blue;
}
```

### Creating Custom Components
```css
/* Add to themes.css */
.custom-component {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}

.custom-component:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

## 🚀 Demo Page

Visit `/theme-demo` to see all themes in action:
- Theme switcher
- Component showcase
- Color palette
- Usage examples

## 📱 Responsive Design

The theme system includes responsive utilities:
```html
<!-- Mobile-first responsive design -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Content -->
</div>

<!-- Responsive text -->
<h1 class="text-2xl md:text-4xl lg:text-6xl">Responsive Title</h1>
```

## 🎯 Best Practices

### 1. Use Semantic Colors
```html
<!-- Good -->
<div class="text-success">Success message</div>
<div class="text-error">Error message</div>

<!-- Avoid -->
<div class="text-green-500">Success message</div>
```

### 2. Leverage CSS Variables
```css
/* Good */
.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Avoid hardcoded colors */
.my-component {
  background: #ffffff;
  color: #1e293b;
}
```

### 3. Use Consistent Spacing
```html
<!-- Good -->
<div class="p-lg m-md">Content</div>

<!-- Avoid -->
<div class="p-6 m-4">Content</div>
```

## 🔧 Development

### Theme Development Workflow
1. Design color palette
2. Define CSS variables
3. Create Tailwind config
4. Build components
5. Test across themes
6. Document usage

### Testing Themes
```bash
# Start development server
npm run dev

# Visit theme demo page
http://localhost:3000/theme-demo
```

## 📚 Resources

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Design System Best Practices](https://www.designsystems.com/)

---

**Theme System Version**: 1.0.0  
**Last Updated**: August 2024  
**Compatibility**: Next.js 14+, Tailwind CSS 3.3+ 