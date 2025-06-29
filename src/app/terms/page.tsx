import BackButton from '@/components/BackButton';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-accent-500 rounded-full"></div>
              <h1 className="text-3xl font-bold text-primary-900 dark:text-white">
                Terms of Service
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
                1. Acceptance of Terms
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                By accessing and using ResumeDrop AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                2. Description of Service
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                ResumeDrop AI is an AI-powered networking platform that revolutionizes professional connections by using advanced artificial intelligence to match users based on their skills, experience, and interests extracted from their resumes. The service provides:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>AI-powered resume analysis and text extraction from PDF, DOCX, and TXT files</li>
                <li>Intelligent matching using third-party LLMs to find users with complementary skills and similar professional interests</li>
                <li>College-specific networking to connect with students from your institution</li>
                <li>Real-time profile discovery and connection suggestions</li>
                <li>Professional contact information sharing and networking tools</li>
                <li>Resume template generation and professional formatting assistance</li>
                <li>Privacy controls for profile visibility and data sharing</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                3. User Accounts and Registration
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                To use the Service, you must register for an account and provide accurate, current, and complete information including your name, email address, and college/university affiliation. You agree to update such information to keep it accurate, current, and complete.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                4. Resume Upload and Content
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                By uploading your resume to the Service, you:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Grant us permission to process and analyze your resume using AI technology including third-party LLMs</li>
                <li>Represent that you own or have the right to use all content in your resume</li>
                <li>Agree that your resume content is accurate and truthful</li>
                <li>Consent to the sharing of your profile information with other users based on AI-generated matching criteria</li>
                <li>Accept that your resume will be converted to searchable text and analyzed for skills, experience, and interests</li>
                <li>Understand that file size is limited to 5MB and supported formats are PDF, DOCX, and TXT</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                You retain ownership of your resume content, but grant us a license to use it for the purposes of providing the Service, including AI analysis and matching.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                5. AI Processing and Data Usage
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Our AI technology, including third-party LLMs, processes your resume to:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Extract skills, experience, education, and other relevant information</li>
                <li>Create searchable embeddings for intelligent matching</li>
                <li>Generate personalized networking recommendations with specific connection reasons</li>
                <li>Identify users with similar backgrounds and complementary skills</li>
                <li>Provide college-specific networking opportunities</li>
                <li>Improve our matching algorithms and AI capabilities</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                This processing is essential to provide the core functionality of our Service. We do not use your data for purposes other than providing and improving the Service.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                6. Networking and Profile Sharing
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                The Service enables professional networking by:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Displaying your profile information to other users based on AI-generated matches</li>
                <li>Sharing contact information (email, phone, LinkedIn, GitHub, etc.) with matched users</li>
                <li>Providing real-time updates when new matches are available</li>
                <li>Enabling college-specific networking within your institution</li>
                <li>Generating personalized connection suggestions with AI-written reasoning</li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                You control your profile visibility through privacy settings and can toggle between public and private modes. Private profiles cannot participate in networking features.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                7. User Conduct
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
                <li>Upload false, misleading, or fraudulent information in your resume or profile</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Use automated systems to access the Service</li>
                <li>Share inappropriate or offensive content</li>
                <li>Attempt to reverse engineer or extract AI algorithms</li>
                <li>Use the Service for commercial purposes without authorization</li>
              </ul>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                8. Privacy and Data Protection
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your information, including AI processing and data sharing.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                9. Intellectual Property
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                The Service and its original content, features, and functionality are owned by ResumeDrop AI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. This includes our AI algorithms, matching technology, and platform design.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                10. Disclaimers
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                The Service is provided "as is" without warranties of any kind. We do not guarantee the accuracy of AI-generated matches, the availability of the Service, or the quality of networking connections. We are not responsible for the actions or content of other users, and we do not guarantee employment opportunities or career outcomes.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                11. Limitation of Liability
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                In no event shall ResumeDrop AI be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service, including but not limited to lost opportunities, career impacts, or data loss.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                12. Termination
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We may terminate or suspend your account and access to the Service at any time, with or without cause, with or without notice. You may terminate your account at any time by contacting us. Upon termination, your data will be deleted in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                13. Changes to Terms
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the "Last updated" date. Your continued use of the Service after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8 p-6 bg-accent-50 dark:bg-accent-900/20 rounded-lg border border-accent-200 dark:border-accent-800">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
                14. Contact Information
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
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