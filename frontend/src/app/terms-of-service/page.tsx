import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">⚠️ IMPORTANT LEGAL NOTICE</h2>
            <p className="text-red-700">
              <strong>HappyCareer is NOT a law firm and does NOT provide legal advice.</strong> 
              Our AI assistant provides general legal information for educational purposes only.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. AI Legal Assistant Disclaimer</h2>
            <p className="mb-4">
              <strong>IMPORTANT:</strong> HappyCareer provides AI-powered legal information, not legal advice. 
              Our AI assistant is for educational purposes only and should not be considered as professional legal counsel.
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>AI responses are based on general legal principles</li>
              <li>AI may not be aware of recent legal changes</li>
              <li>AI cannot provide personalized legal advice</li>
              <li>AI cannot represent you in legal matters</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. No Attorney-Client Relationship</h2>
            <p className="mb-4">
              Using our AI legal assistant does not create an attorney-client relationship. 
              For specific legal matters, consult with a qualified attorney.
            </p>
            <p className="mb-4">
              <strong>When to consult a lawyer:</strong>
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Specific legal matters requiring professional advice</li>
              <li>Contract negotiations and legal disputes</li>
              <li>Complex employment issues</li>
              <li>Regulatory compliance matters</li>
              <li>Any situation requiring legal representation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Accuracy of Information</h2>
            <p className="mb-4">
              While we strive for accuracy, legal information may change over time and vary by jurisdiction. 
              We do not guarantee the completeness or accuracy of AI-generated responses.
            </p>
            <p className="mb-4">
              <strong>Jurisdiction Limitations:</strong> Laws vary by:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Country and state/province</li>
              <li>Industry and employment type</li>
              <li>Specific circumstances</li>
              <li>Recent legal developments</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Limitation of Liability</h2>
            <p className="mb-4">
              HappyCareer is not liable for any damages arising from the use of our AI legal assistant 
              or reliance on its responses. This includes but is not limited to:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Direct, indirect, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Legal costs or attorney fees</li>
              <li>Any damages resulting from legal decisions made based on AI responses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. User Responsibilities</h2>
            <p className="mb-4">Users are responsible for:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Verifying legal information independently</li>
              <li>Consulting qualified professionals for specific legal matters</li>
              <li>Not relying solely on AI responses for legal decisions</li>
              <li>Understanding the limitations of AI-generated information</li>
              <li>Complying with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Lawyer Network Services</h2>
            <p className="mb-4">
              When using our lawyer network services:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Lawyers are independent professionals, not employees of HappyCareer</li>
              <li>We facilitate connections but do not provide legal services</li>
              <li>Attorney-client relationships are between you and the lawyer</li>
              <li>We are not responsible for lawyer advice or services</li>
              <li>You should verify lawyer credentials independently</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Document Generation</h2>
            <p className="mb-4">
              AI-generated legal documents:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Are templates only and should be reviewed by qualified attorneys</li>
              <li>May not be suitable for all jurisdictions or circumstances</li>
              <li>Do not guarantee legal validity or enforceability</li>
              <li>Should be customized for your specific situation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Use our services for illegal purposes</li>
              <li>Misrepresent legal advice as coming from HappyCareer</li>
              <li>Attempt to circumvent our disclaimers or limitations</li>
              <li>Use our services to provide legal advice to others</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. 
              Continued use of our services constitutes acceptance of updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact Information</h2>
            <p className="mb-4">
              For questions about these terms, contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> legal@happycareer.com</p>
              <p><strong>Address:</strong> [Your Business Address]</p>
              <p><strong>Phone:</strong> [Your Phone Number]</p>
            </div>
          </section>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
            <p className="text-yellow-800">
              <strong>By using HappyCareer's services, you acknowledge that you have read, 
              understood, and agree to these Terms of Service.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 