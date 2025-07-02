'use client';

import { useSession } from '@/contexts/SessionContext';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import { FiEdit3, FiUsers, FiFileText, FiArrowRight, FiZap, FiInfo } from 'react-icons/fi';

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

function NavigationCard({ title, description, href, icon, color, gradient }: NavigationCardProps) {
  return (
    <Link
      href={href}
      className={`relative p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col h-full group overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${gradient})`,
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8">
        <div className="w-full h-full rounded-full bg-white"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10 transform -translate-x-6 translate-y-6">
        <div className="w-full h-full rounded-full bg-white"></div>
      </div>
      
      <div className="flex-1 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 shadow-lg`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-xl drop-shadow-sm">
              {title}
            </h3>
          </div>
        </div>
        
        <p className="text-white/90 text-sm leading-relaxed drop-shadow-sm">
          {description}
        </p>
      </div>
      
      <div className="mt-4 flex items-center justify-between relative z-10">
        <span className="text-white font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
          Go to {title}
          <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </div>
    </Link>
  );
}

export default function HomePageContent() {
  const { userMetadata } = useSession();

  const navigationCards = [
    {
      title: "Resume Editor",
      description: "Edit and format your resume with AI-powered suggestions and real-time feedback based on professionals in your field.",
      href: "/editor",
      icon: <FiEdit3 className="w-7 h-7" />,
      color: "teal",
      gradient: "#00b09b 0%, #96c93d 100%"
    },
    {
      title: "Find Matches",
      description: "Discover and connect with students from your college who are interested in similar things.",
      href: "/matches",
      icon: <FiUsers className="w-7 h-7" />,
      color: "pink",
      gradient: "#ff6b9d 0%, #c44569 100%"
    }
  ];

  return (
    <div className="w-full h-full max-h-full bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 dark:from-neutral-900 dark:via-primary-900/20 dark:to-secondary-900/20 rounded-xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-neutral-200/50 dark:border-neutral-700/50 flex-shrink-0 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {userMetadata?.name ? `Welcome back, ${userMetadata?.name}!` : 'Welcome to ResumeDrop'}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-lg">
              What would you like to do today?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center shadow-lg hover:rotate-180 transition-all duration-300">
              <FiZap className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navigationCards.map((card, index) => (
            <NavigationCard
              key={index}
              title={card.title}
              description={card.description}
              href={card.href}
              icon={card.icon}
              color={card.color}
              gradient={card.gradient}
            />
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-primary-400/20 via-secondary-400/20 to-primary-500/20 dark:from-primary-400/10 dark:via-secondary-400/10 dark:to-primary-500/10 rounded-xl border border-primary-200/50 dark:border-primary-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center">
              <FiInfo className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-lg">
              Quick Tips
            </h3>
          </div>
          <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-secondary-500 to-primary-600 rounded-full"></div>
              Use the AI editor to improve your resume
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-secondary-400 to-primary-500 rounded-full"></div>
              Keep your resume updated for better match suggestions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 