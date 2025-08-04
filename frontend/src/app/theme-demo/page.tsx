'use client';

import { useState } from 'react';
import { ThemePreview } from '../../components/ui/ThemeSwitcher';
import ModernHero from '../../components/home/ModernHero';

export default function ThemeDemoPage() {
  const [currentTheme, setCurrentTheme] = useState('default');

  const themes = [
    { id: 'default', name: 'Professional Blue', description: 'Modern blue theme for professional career platforms' },
    { id: 'green', name: 'Green Growth', description: 'Fresh green theme representing growth and success' },
    { id: 'orange', name: 'Creative Orange', description: 'Energetic orange theme for creative industries' },
    { id: 'purple', name: 'Innovation Purple', description: 'Innovative purple theme for tech companies' },
    { id: 'dark', name: 'Dark Mode', description: 'Sleek dark theme for modern applications' },
  ];

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    setCurrentTheme(theme);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-white border-b border-border-light sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Theme Demo</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">Current: {themes.find(t => t.id === currentTheme)?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Theme Selector */}
      <section className="bg-bg-secondary py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Choose Your Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  currentTheme === theme.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border-light bg-white hover:border-primary/50'
                }`}
              >
                <h3 className="font-semibold mb-2">{theme.name}</h3>
                <p className="text-sm text-text-secondary">{theme.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section Demo */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Hero Section Demo</h2>
          <div className="rounded-lg overflow-hidden border border-border-light">
            <ModernHero />
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-12 bg-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Component Showcase</h2>
          <ThemePreview />
        </div>
      </section>

      {/* Color Palette */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Color Palette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Primary Colors */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Primary Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary shadow-md" />
                  <div>
                    <div className="font-medium">Primary</div>
                    <div className="text-sm text-text-secondary">var(--primary-blue)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-light shadow-md" />
                  <div>
                    <div className="font-medium">Primary Light</div>
                    <div className="text-sm text-text-secondary">var(--primary-blue-light)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-dark shadow-md" />
                  <div>
                    <div className="font-medium">Primary Dark</div>
                    <div className="text-sm text-text-secondary">var(--primary-blue-dark)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Colors */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Secondary Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary shadow-md" />
                  <div>
                    <div className="font-medium">Secondary</div>
                    <div className="text-sm text-text-secondary">var(--secondary-teal)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary-light shadow-md" />
                  <div>
                    <div className="font-medium">Secondary Light</div>
                    <div className="text-sm text-text-secondary">var(--secondary-teal-light)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary-dark shadow-md" />
                  <div>
                    <div className="font-medium">Secondary Dark</div>
                    <div className="text-sm text-text-secondary">var(--secondary-teal-dark)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Accent Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent shadow-md" />
                  <div>
                    <div className="font-medium">Accent</div>
                    <div className="text-sm text-text-secondary">var(--accent-purple)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent-light shadow-md" />
                  <div>
                    <div className="font-medium">Accent Light</div>
                    <div className="text-sm text-text-secondary">var(--accent-purple-light)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent-dark shadow-md" />
                  <div>
                    <div className="font-medium">Accent Dark</div>
                    <div className="text-sm text-text-secondary">var(--accent-purple-dark)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Semantic Colors */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Semantic Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-success shadow-md" />
                  <div>
                    <div className="font-medium">Success</div>
                    <div className="text-sm text-text-secondary">var(--success)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-warning shadow-md" />
                  <div>
                    <div className="font-medium">Warning</div>
                    <div className="text-sm text-text-secondary">var(--warning)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-error shadow-md" />
                  <div>
                    <div className="font-medium">Error</div>
                    <div className="text-sm text-text-secondary">var(--error)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="py-12 bg-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Usage Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CSS Variables */}
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold">CSS Variables</h3>
              </div>
              <div className="card-body">
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
{`/* Using CSS Variables */
.my-button {
  background: var(--primary-blue);
  color: white;
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.my-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-md);
}`}
                </pre>
              </div>
            </div>

            {/* Tailwind Classes */}
            <div className="card">
              <div className="card-header">
                <h3 className="font-semibold">Tailwind Classes</h3>
              </div>
              <div className="card-body">
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
{`<!-- Using Tailwind Classes -->
<button class="bg-primary text-white rounded-md p-4">
  Primary Button
</button>

<div class="bg-bg-primary border border-border-light shadow-md rounded-lg p-4">
  Card Component
</div>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-tertiary py-8 border-t border-border-light">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-secondary">
            Theme system inspired by modern design patterns. Switch themes to see the magic!
          </p>
        </div>
      </footer>
    </div>
  );
} 