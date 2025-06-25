import BackButton from '@/components/BackButton';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-accent-500 rounded-full"></div>
              <h1 className="text-3xl font-bold text-primary-900 dark:text-white">
                Privacy Policy
              </h1>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-400 rounded-full"></span>
              Last updated: 6/24/2025
            </p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                1. Introduction
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                ResumeDrop AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our resume networking platform.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                2. Information We Collect
              </h2>
              
              <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent-400 rounded-full"></span>
                2.1 Personal Information
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Name and email address during registration</li>
                <li>Profile information and preferences</li>
                <li>Resume content and documents you upload</li>
                <li>Profile pictures and other images</li>
                <li>Communication preferences and settings</li>
              </ul>

              <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent-400 rounded-full"></span>
                2.2 Automatically Collected Information
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We automatically collect certain information when you use our Service:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Log data (access times, error logs, performance data)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                3. How We Use Your Information
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Provide and maintain the Service</li>
                <li>Process and analyze your resume using AI technology</li>
                <li>Match you with other users based on skills and experience</li>
                <li>Send you notifications and updates about the Service</li>
                <li>Improve our AI algorithms and matching capabilities</li>
                <li>Ensure the security and integrity of the Service</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                4. AI Processing and Data Analysis
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Our AI technology processes your resume to:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Extract skills, experience, education, and other relevant information</li>
                <li>Create a searchable profile for matching purposes</li>
                <li>Identify patterns and similarities with other users</li>
                <li>Generate personalized networking recommendations</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                This processing is essential to provide the core functionality of our Service. We do not use your data for purposes other than providing and improving the Service.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                5. Information Sharing and Disclosure
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent-400 rounded-full"></span>
                5.1 With Other Users
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Your profile information (excluding personal contact details) may be visible to other users based on matching criteria. You control what information is shared through your privacy settings.
              </p>

              <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent-400 rounded-full"></span>
                5.2 Service Providers
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We may share information with trusted third-party service providers who assist us in operating the Service, such as cloud storage providers and analytics services.
              </p>

              <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent-400 rounded-full"></span>
                5.3 Legal Requirements
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We may disclose your information if required by law or in response to valid legal requests.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                6. Data Security
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                7. Data Retention
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We retain your information for as long as your account is active or as needed to provide the Service. You may request deletion of your account and associated data at any time.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                8. Your Rights and Choices
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                You have the following rights regarding your information:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Update or correct your personal information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Privacy Settings:</strong> Control what information is shared with other users</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                9. Cookies and Tracking Technologies
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                10. Third-Party Services
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                11. Children's Privacy
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                12. International Data Transfers
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                13. Changes to This Privacy Policy
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8 p-6 bg-accent-50 dark:bg-accent-900/20 rounded-lg border border-accent-200 dark:border-accent-800">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                14. Contact Us
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                <p className="text-neutral-700 dark:text-neutral-300 mb-2">
                  <span className="font-semibold text-accent-600 dark:text-accent-400">Email:</span> resumedropai@gmail.com
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Narayan Topalli (Cornell '28)
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <BackButton />
          </div>
        </div>
      </div>
    </div>
  );
} 