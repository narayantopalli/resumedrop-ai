import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-4">
              resumedrop.ai
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4 max-w-md">
              Ready to land your dream job? Just upload a copy of your resume and we'll take care of the rest. 😊
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/resumedrop.ai/"
                className="text-neutral-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-primary-900 dark:text-white uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-700 dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-700 dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              © 2025 resumedrop.ai. All rights reserved.
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 md:mt-0">
              A <span className="font-medium text-primary-700 dark:text-primary-300">Narayan Topalli</span> Production
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 