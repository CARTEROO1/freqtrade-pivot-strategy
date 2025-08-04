'use client'

import { useState } from 'react'
import { AlertTriangle, Shield, BookOpen, Users, Save, X, Plus, Upload } from 'lucide-react'
import { blogApi } from '../../lib/api'

interface BlogPostForm {
  title: string
  excerpt: string
  content: string
  category: 'scam-alert' | 'safety-tips' | 'career-guidance' | 'student-resources'
  author: string
  tags: string[]
  urgency: 'low' | 'medium' | 'high' | 'critical'
  featured: boolean
}

export default function BlogPostCreator() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    excerpt: '',
    content: '',
    category: 'scam-alert',
    author: '',
    tags: [],
    urgency: 'medium',
    featured: false
  })
  const [newTag, setNewTag] = useState('')

  const categories = [
    { id: 'scam-alert', name: 'Scam Alert', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-600' },
    { id: 'safety-tips', name: 'Safety Tips', icon: <Shield className="w-4 h-4" />, color: 'text-blue-600' },
    { id: 'career-guidance', name: 'Career Guidance', icon: <BookOpen className="w-4 h-4" />, color: 'text-green-600' },
    { id: 'student-resources', name: 'Student Resources', icon: <Users className="w-4 h-4" />, color: 'text-purple-600' }
  ]

  const urgencyLevels = [
    { id: 'low', name: 'Low', color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { id: 'high', name: 'High', color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 'critical', name: 'Critical', color: 'text-red-600', bg: 'bg-red-100' }
  ]

  const handleInputChange = (field: keyof BlogPostForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Calculate read time based on content length
      const wordCount = formData.content.split(' ').length
      const readTime = Math.ceil(wordCount / 200) // Average reading speed: 200 words per minute

      const blogPost = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        author_id: '00000000-0000-0000-0000-000000000000', // Placeholder - should be actual user ID
        read_time: `${readTime} min read`,
        tags: formData.tags,
        urgency_level: formData.urgency,
        featured: formData.featured,
        status: 'published' as const
      }

      await blogApi.createBlogPost(blogPost)
      
      // Show success message
      alert('Blog post created successfully! This will help protect others from scams.')
      
      // Reset form and close modal
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'scam-alert',
        author: '',
        tags: [],
        urgency: 'medium',
        featured: false
      })
      setIsOpen(false)
    } catch (error) {
      console.error('Error creating blog post:', error)
      alert('Error creating blog post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUrgencyIcon = () => {
    switch (formData.urgency) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <AlertTriangle className="w-5 h-5 text-green-600" />
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
        title="Create New Blog Post"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Blog Post</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Share important safety information, scam alerts, or career guidance to help protect others.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., 🚨 URGENT: New Job Scam Targeting Students"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              {/* Category and Urgency */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    {urgencyLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief summary of the post (will appear in previews)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Content *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write the full blog post content here. Include details about the scam, safety tips, or guidance..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Your name or organization"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tags (press Enter)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isSubmitting}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  disabled={isSubmitting}
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Mark as Featured (will appear prominently)
                </label>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Preview</h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      formData.category === 'scam-alert' ? 'bg-red-100 text-red-800 border-red-200' :
                      formData.category === 'safety-tips' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      formData.category === 'career-guidance' ? 'bg-green-100 text-green-800 border-green-200' :
                      'bg-purple-100 text-purple-800 border-purple-200'
                    }`}>
                      {categories.find(c => c.id === formData.category)?.icon}
                      <span className="ml-1">{formData.category.replace('-', ' ').toUpperCase()}</span>
                    </span>
                    {formData.urgency === 'critical' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {formData.title || 'Your title will appear here'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {formData.excerpt || 'Your excerpt will appear here'}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>{formData.author || 'Author'}</span>
                    <span>Today</span>
                    <span className="flex items-center gap-1">
                      {getUrgencyIcon()}
                      {urgencyLevels.find(u => u.id === formData.urgency)?.name} Urgency
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Publish Post
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
} 