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
              Last updated: June 29, 2025
            </p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                1. Introduction
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                ResumeDrop AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered networking platform that matches users based on their skills, experience, and interests extracted from their resumes.
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
                <li>Name, email address, and college/university affiliation during registration</li>
                <li>Profile information including contact details (phone, LinkedIn, GitHub, etc.)</li>
                <li>Resume content and documents you upload (PDF, DOCX, TXT formats up to 5MB)</li>
                <li>Profile pictures and avatar images</li>
                <li>Privacy settings and networking preferences</li>
                <li>Communication preferences and notification settings</li>
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
                <li>Usage data (pages visited, features used, time spent, matching interactions)</li>
                <li>Log data (access times, error logs, performance data)</li>
                <li>Cookies and similar tracking technologies for session management</li>
                <li>Real-time connection data for networking features</li>
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
                <li>Provide and maintain the AI-powered networking Service</li>
                <li>Process and analyze your resume using third-party LLMs and other AI technologies</li>
                <li>Create searchable embeddings for intelligent user matching</li>
                <li>Match you with other users based on skills, experience, and college affiliation</li>
                <li>Generate personalized networking recommendations with AI-written reasoning</li>
                <li>Send real-time notifications about new matches and connections</li>
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
                Our AI technology, including third-party LLMs, processes your resume to:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Extract skills, experience, education, and other relevant information</li>
                <li>Convert resume content into searchable text and embeddings</li>
                <li>Create a comprehensive profile summary for matching purposes</li>
                <li>Identify patterns and similarities with other users</li>
                <li>Generate personalized networking recommendations with specific connection reasons</li>
                <li>Enable college-specific networking within your institution</li>
                <li>Provide real-time matching updates and notifications</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                This AI processing is essential to provide the core functionality of our Service. We do not use your data for purposes other than providing and improving the Service. Your resume content is processed securely and used only for matching and networking purposes.
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
                5.1 With Other Users (Networking Features)
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                When your profile is public, your information may be visible to other users based on AI-generated matching criteria:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Profile information (name, college, skills, experience summary)</li>
                <li>Contact information (email, phone, LinkedIn, GitHub, etc.) as you choose to share</li>
                <li>AI-generated connection suggestions and reasoning</li>
                <li>Similarity scores and matching criteria</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                You control what information is shared through your privacy settings. Private profiles cannot participate in networking features.
              </p>

              <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent-400 rounded-full"></span>
                5.2 AI Service Providers
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We share resume content with third-party LLMs for AI processing and analysis. Third-party LLMs processes your data according to their privacy policy and data handling practices.
              </p>

              <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent-400 rounded-full"></span>
                5.3 Service Providers
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We may share information with trusted third-party service providers who assist us in operating the Service, such as cloud storage providers (Supabase), authentication services, and analytics services.
              </p>

              <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent-400 rounded-full"></span>
                5.4 Legal Requirements
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
                We implement appropriate technical and organizational measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Secure authentication through Supabase Auth</li>
                <li>Encrypted storage and secure file handling</li>
                <li>Secure transmission of data to AI service providers</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and user authentication</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                7. Data Retention
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We retain your information for as long as your account is active or as needed to provide the Service. This includes:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Resume files and extracted text for matching purposes</li>
                <li>Profile information and networking data</li>
                <li>AI-generated embeddings and matching data</li>
                <li>Usage data for service improvement</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                You may request deletion of your account and associated data at any time. Upon deletion, we will remove your data from our systems and request deletion from AI service providers where applicable.
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
                <li><strong>Correction:</strong> Update or correct your personal information and resume content</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from notifications and communications</li>
                <li><strong>Privacy Settings:</strong> Control profile visibility and networking participation</li>
                <li><strong>Resume Management:</strong> Update, replace, or remove your uploaded resume</li>
                <li><strong>Contact Information:</strong> Control which contact details are shared with other users</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                9. Cookies and Tracking Technologies
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, provide personalized content, and maintain session state. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                10. Third-Party Services
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Our Service integrates with third-party services:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li><strong>Third-party LLMs:</strong> For AI processing and analysis of resume content</li>
                <li><strong>Supabase:</strong> For authentication, database, and file storage</li>
                <li><strong>Google OAuth:</strong> For authentication (optional)</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                11. Children's Privacy
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Our Service is intended for college students. We do not knowingly collect personal information from children under 13 years of age. If you believe we have collected such information, please contact us.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                12. International Data Transfers
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Your information may be transferred to and processed in countries other than your own, including for AI processing by third-party LLMs. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                13. Changes to This Privacy Policy
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
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