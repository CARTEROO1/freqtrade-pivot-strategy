import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <h2 className="text-xl font-bold text-blue-800 mb-2">🔒 Your Privacy Matters</h2>
            <p className="text-blue-700">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-700 mb-3">1.1 Personal Information</h3>
            <p className="mb-4">We collect information you provide directly to us:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Name, email address, and contact information</li>
              <li>Resume, work history, and professional details</li>
              <li>Job preferences and career goals</li>
              <li>Legal questions and AI interactions</li>
              <li>Lawyer consultation requests</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mb-3">1.2 Legal Information Collection</h3>
            <p className="mb-4">
              When you use our legal services, we collect:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Legal questions and AI responses for service improvement</li>
              <li>Document generation requests and templates used</li>
              <li>Lawyer consultation preferences and history</li>
              <li>Jurisdiction and legal topic preferences</li>
            </ul>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Note:</strong> Legal information is anonymized and used to enhance our AI system. 
              We do not share specific legal questions with third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Provide job matching and career services</li>
              <li>Improve our AI legal assistant</li>
              <li>Connect you with legal professionals</li>
              <li>Generate personalized recommendations</li>
              <li>Send relevant job alerts and updates</li>
              <li>Improve our services and user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Information Sharing</h2>
            
            <h3 className="text-xl font-semibold text-gray-700 mb-3">3.1 Lawyer Consultation Data</h3>
            <p className="mb-4">
              When you book lawyer consultations, we share necessary information with legal professionals:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Your contact information and consultation request</li>
              <li>Legal issue description and jurisdiction</li>
              <li>Preferred consultation time and method</li>
            </ul>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Attorney-Client Privilege:</strong> Communications with lawyers are protected by 
              attorney-client privilege and are not shared with us.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mb-3">3.2 Third-Party Legal Services</h3>
            <p className="mb-4">
              Lawyer consultations are provided by independent legal professionals. 
              Their privacy practices are separate from ours and governed by their own policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Security</h2>
            <p className="mb-4">We implement robust security measures to protect your information:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure servers and data centers</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Compliance with data protection regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Data Retention</h2>
            <p className="mb-4">We retain your information for:</p>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Account data:</strong> As long as your account is active</li>
              <li><strong>Legal interactions:</strong> 7 years for compliance purposes</li>
              <li><strong>AI training data:</strong> Anonymized and retained indefinitely</li>
              <li><strong>Lawyer consultations:</strong> As required by legal professionals</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt out of marketing communications</li>
              <li>Request data portability</li>
              <li>Object to data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Cookies and Tracking</h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze website usage and performance</li>
              <li>Provide personalized content and recommendations</li>
              <li>Improve our services and user experience</li>
            </ul>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              Our services are not intended for children under 13. We do not knowingly collect 
              personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any 
              material changes by email or through our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this privacy policy, contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@happycareer.com</p>
              <p><strong>Address:</strong> [Your Business Address]</p>
              <p><strong>Phone:</strong> [Your Phone Number]</p>
            </div>
          </section>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
            <p className="text-green-800">
              <strong>We are committed to protecting your privacy and will continue to improve 
              our data protection practices.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 