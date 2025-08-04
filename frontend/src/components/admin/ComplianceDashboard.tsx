'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  ExternalLink,
  Info
} from 'lucide-react'

interface ComplianceReport {
  compliantSources: string[]
  nonCompliantSources: string[]
  recommendations: string[]
}

interface TermsOfService {
  source: string
  allowsScraping: boolean
  rateLimit: number
  requiresAuth: boolean
  requiresHeaders: boolean
  robotsTxt: string
  termsUrl: string
  lastChecked: Date
}

export default function ComplianceDashboard() {
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComplianceReport()
  }, [])

  const fetchComplianceReport = async () => {
    try {
      // Mock compliance report - in real implementation, this would come from the backend
      const report: ComplianceReport = {
        compliantSources: ['GitHub', 'StackOverflow'],
        nonCompliantSources: ['LinkedIn', 'Indeed', 'Glassdoor', 'Monster'],
        recommendations: [
          'Use only API-based sources for automated data collection',
          'Implement proper rate limiting for all requests',
          'Respect robots.txt files',
          'Monitor for changes in terms of service',
          'Consider using official APIs instead of scraping'
        ]
      }
      setComplianceReport(report)
    } catch (error) {
      console.error('Error fetching compliance report:', error)
    } finally {
      setLoading(false)
    }
  }

  const mockTermsOfService: TermsOfService[] = [
    {
      source: 'LinkedIn',
      allowsScraping: false,
      rateLimit: 0,
      requiresAuth: true,
      requiresHeaders: true,
      robotsTxt: 'https://www.linkedin.com/robots.txt',
      termsUrl: 'https://www.linkedin.com/legal/user-agreement',
      lastChecked: new Date()
    },
    {
      source: 'Indeed',
      allowsScraping: false,
      rateLimit: 0,
      requiresAuth: false,
      requiresHeaders: true,
      robotsTxt: 'https://www.indeed.com/robots.txt',
      termsUrl: 'https://www.indeed.com/legal',
      lastChecked: new Date()
    },
    {
      source: 'GitHub',
      allowsScraping: true,
      rateLimit: 60,
      requiresAuth: false,
      requiresHeaders: false,
      robotsTxt: 'https://jobs.github.com/robots.txt',
      termsUrl: 'https://docs.github.com/en/rest/reference/search#search-jobs',
      lastChecked: new Date()
    },
    {
      source: 'StackOverflow',
      allowsScraping: true,
      rateLimit: 30,
      requiresAuth: false,
      requiresHeaders: false,
      robotsTxt: 'https://stackoverflow.com/jobs/robots.txt',
      termsUrl: 'https://stackoverflow.com/legal/api-terms-of-use',
      lastChecked: new Date()
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading compliance dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Legal Compliance Dashboard</h1>
          <p className="text-gray-600">Terms of service compliance and legal requirements</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-green-600" />
          <span className="text-sm font-medium text-green-600">Compliant System</span>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliant Sources</p>
              <p className="text-2xl font-bold text-gray-900">
                {complianceReport?.compliantSources.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Non-Compliant Sources</p>
              <p className="text-2xl font-bold text-gray-900">
                {complianceReport?.nonCompliantSources.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {complianceReport?.compliantSources.length && complianceReport?.nonCompliantSources.length
                  ? Math.round((complianceReport.compliantSources.length / 
                    (complianceReport.compliantSources.length + complianceReport.nonCompliantSources.length)) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms of Service Analysis</h3>
        <div className="space-y-4">
          {mockTermsOfService.map((terms) => (
            <div key={terms.source} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {terms.allowsScraping ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <h4 className="font-medium text-gray-900">{terms.source}</h4>
                  <span className={`px-2 py-1 text-xs rounded ${
                    terms.allowsScraping 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {terms.allowsScraping ? 'Compliant' : 'Non-Compliant'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <a 
                    href={terms.termsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Terms
                  </a>
                  <a 
                    href={terms.robotsTxt} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Robots.txt
                  </a>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Rate Limit:</span>
                  <span className="ml-1 font-medium">
                    {terms.rateLimit > 0 ? `${terms.rateLimit}/hour` : 'Not allowed'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Auth Required:</span>
                  <span className="ml-1 font-medium">
                    {terms.requiresAuth ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Headers Required:</span>
                  <span className="ml-1 font-medium">
                    {terms.requiresHeaders ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Last Checked:</span>
                  <span className="ml-1 font-medium">
                    {terms.lastChecked.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Recommendations</h3>
        <div className="space-y-3">
          {complianceReport?.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">✅ What We Do Right</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Only use API-based sources (GitHub, Stack Overflow)</li>
              <li>• Implement proper rate limiting</li>
              <li>• Respect robots.txt files</li>
              <li>• Use appropriate User-Agent headers</li>
              <li>• Monitor for compliance violations</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">⚠️ What We Avoid</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Web scraping of non-compliant sites</li>
              <li>• Bypassing rate limits</li>
              <li>• Ignoring robots.txt directives</li>
              <li>• Using fake user agents</li>
              <li>• Violating terms of service</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-800">Legal Disclaimer</h4>
            <p className="text-sm text-yellow-700 mt-1">
              This system is designed to comply with all applicable terms of service and legal requirements. 
              We only collect data from sources that explicitly allow automated access through their APIs. 
              Users are responsible for ensuring their use of this system complies with all applicable laws 
              and regulations in their jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 