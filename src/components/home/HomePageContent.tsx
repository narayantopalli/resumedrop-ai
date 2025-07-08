'use client';

import { useSession } from '@/contexts/SessionContext';
import { FiEdit3, FiUsers, FiArrowRight, FiZap, FiInfo, FiTarget, FiTrendingUp } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

function NavigationCard({ title, description, href, icon, color, gradient }: NavigationCardProps) {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push(href)}
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
          <h3 className="font-bold text-white text-xl drop-shadow-sm">
            {title}
          </h3>
        </div>
        
        <p className="text-white/90 text-sm leading-relaxed drop-shadow-sm text-left">
          {description}
        </p>
      </div>
      
      <div className="mt-4 flex items-center justify-between relative z-10">
        <span className="text-white font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
          Go to {title}
          <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </div>
    </button>
  );
}

export default function HomePageContent() {
  const { userMetadata, quote, quoteLoading } = useSession();
  const router = useRouter();

  const navigationCards = [
    {
      title: "Find Leads",
      description: "Discover exciting opportunities within your college network or post your own leads to the community.",
      href: "/leads",
      icon: <FiTrendingUp className="w-7 h-7" />,
      color: "orange",
      gradient: "#ff8a00 0%, #e52e71 100%"
    },
    {
      title: "Skill Building",
      description: "Improve your skills with recommendations based on your resume and jobs you want to apply for.",
      href: "/skills",
      icon: <FiTarget className="w-7 h-7" />,
      color: "purple",
      gradient: "#8b5cf6 0%, #a855f7 100%"
    },
    {
      title: "Resume Editor",
      description: "Edit and format your resume with AI-powered suggestions and real-time feedback based on professionals in your field.",
      href: "/editor",
      icon: <FiEdit3 className="w-7 h-7" />,
      color: "teal",
      gradient: "#00b09b 0%, #96c93d 100%"
    },
    {
      title: "Find Profiles",
      description: "Discover and connect with students from your college with similar interests.",
      href: "/profiles",
      icon: <FiUsers className="w-7 h-7" />,
      color: "pink",
      gradient: "#ff6b9d 0%, #c44569 100%"
    }
  ];

  return (
    <div className="w-full h-full max-h-full bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 dark:from-neutral-900 dark:via-primary-900/20 dark:to-secondary-900/20 rounded-xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 flex flex-col overflow-hidden">
      <div className="p-4 sm:p-6 pb-2 border-b border-neutral-200/50 dark:border-neutral-700/50 flex-shrink-0 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-300 dark:to-secondary-300 bg-clip-text text-transparent leading-tight">
              {userMetadata?.name ? `Welcome back, ${userMetadata?.name.split(' ')[0]}!` : 'Welcome to ResumeDrop'}
            </h2>
            <div className="h-8 sm:h-10 md:h-12 flex items-center mt-1">
              <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 italic line-clamp-2">
                {quoteLoading ? (
                  'Loading inspiration...'
                ) : quote ? (
                  <>"{quote.q}" <span className="whitespace-nowrap">- {quote.a}</span></>
                ) : (
                  <>"It does not matter how slowly you go as long as you do not stop." <span className="whitespace-nowrap">- Confucius</span></>
                )}
              </p>
            </div>
          </div>
          <button className="flex flex-col items-center text-center flex-shrink-0" onClick={() => router.push('/game')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary-400 to-secondary-400 dark:from-primary-700 dark:to-secondary-700 rounded-full flex items-center justify-center shadow-lg hover:rotate-180 hover:scale-110 transition-all duration-300">
              <FiZap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
            </div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 sm:mt-2 italic">Tap Me!</span>
          </button>
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
        
        <div className="mt-8 p-6 bg-white/80 dark:bg-neutral-800/80 rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center">
              <FiInfo className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-lg">
              Quick Tips
            </h3>
          </div>
          <ul className="text-sm space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: 'linear-gradient(135deg, #ff8a00 0%, #e52e71 100%)' }}></div>
              <span className="leading-relaxed text-neutral-700 dark:text-neutral-300">Check out the leads page to find exciting opportunities within your college network</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' }}></div>
              <span className="leading-relaxed text-neutral-700 dark:text-neutral-300">Upload a job posting to get curated recommendations for skills to improve</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)' }}></div>
              <span className="leading-relaxed text-neutral-700 dark:text-neutral-300">Use the editor to improve your resume with personalized analysis and in-text suggestions</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)' }}></div>
              <span className="leading-relaxed text-neutral-700 dark:text-neutral-300">Keep your resume updated for better analysis and networking suggestions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}