'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Palette, Monitor } from 'lucide-react';

const themes = [
  { id: 'default', name: 'Professional Blue', icon: '💼' },
  { id: 'green', name: 'Green Growth', icon: '🌱' },
  { id: 'orange', name: 'Creative Orange', icon: '🎨' },
  { id: 'purple', name: 'Innovation Purple', icon: '🚀' },
  { id: 'dark', name: 'Dark Mode', icon: '🌙' }
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get theme from localStorage or default to 'default'
    const savedTheme = localStorage.getItem('theme') || 'default';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  const getCurrentThemeInfo = () => {
    return themes.find(theme => theme.id === currentTheme) || themes[0];
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
        aria-label="Switch theme"
      >
        <span className="text-lg">{getCurrentThemeInfo().icon}</span>
        <span className="hidden sm:inline text-sm font-medium">
          {getCurrentThemeInfo().name}
        </span>
        <Palette className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Choose Theme
            </h3>
            <div className="space-y-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-all duration-200 ${
                    currentTheme === theme.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-lg">{theme.icon}</span>
                  <span className="text-sm font-medium">{theme.name}</span>
                  {currentTheme === theme.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Theme Preview Component for demo page
export function ThemePreview() {
  const [selectedTheme, setSelectedTheme] = useState('default');

  const applyPreviewTheme = (theme: string) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    setSelectedTheme(theme);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => applyPreviewTheme(theme.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              selectedTheme === theme.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-lg">{theme.icon}</span>
            <span className="font-medium">{theme.name}</span>
          </button>
        ))}
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">
          Current Theme: <span className="font-semibold">{getCurrentThemeInfo().name}</span>
        </p>
        <div className="flex space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
          <div className="w-6 h-6 bg-teal-500 rounded"></div>
          <div className="w-6 h-6 bg-purple-500 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function getCurrentThemeInfo() {
  return themes.find(theme => theme.id === 'default') || themes[0];
} 