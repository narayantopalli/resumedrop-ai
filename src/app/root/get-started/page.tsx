'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiUser, 
  FiFileText, 
  FiUsers, 
  FiTarget, 
  FiCheck, 
  FiArrowRight, 
  FiArrowLeft,
  FiUpload,
  FiEdit3,
  FiTrendingUp,
  FiZap,
  FiStar
} from 'react-icons/fi';

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

function Step({ title, description, icon, isActive, isCompleted, onClick }: StepProps) {
  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-xl transition-all duration-300 cursor-pointer text-left ${
        isActive 
          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-105' 
          : isCompleted 
            ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-md' 
            : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isActive 
            ? 'bg-white/20 backdrop-blur-sm' 
            : isCompleted 
              ? 'bg-white/20' 
              : 'bg-neutral-100 dark:bg-neutral-700'
        }`}>
          {isCompleted ? (
            <FiCheck className="w-6 h-6 text-white" />
          ) : (
            <div className={isActive ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}>
              {icon}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${
            isActive || isCompleted ? 'text-white' : 'text-neutral-900 dark:text-white'
          }`}>
            {title}
          </h3>
          <p className={`text-sm mt-1 ${
            isActive || isCompleted ? 'text-white/90' : 'text-neutral-600 dark:text-neutral-400'
          }`}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

function FeatureCard({ title, description, icon, gradient }: FeatureCardProps) {
  return (
    <div 
      className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${gradient})`,
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
          <div className="text-white">
            {icon}
          </div>
        </div>
        <h3 className="font-bold text-white text-lg">
          {title}
        </h3>
      </div>
      <p className="text-white/90 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const router = useRouter();

  const steps = [
    {
      title: "Welcome",
      description: "Let's get you started with ResumeDrop",
      icon: <FiUser className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiStar className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-300 dark:to-secondary-300 bg-clip-text text-transparent mb-4">
              Welcome to ResumeDrop!
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              The ultimate platform for college networking and career development. 
              Let's set up your profile and get you connected with opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <FeatureCard
              title="Smart Networking"
              description="Connect with peers, clubs, and opportunities that match your interests and career goals."
              icon={<FiUsers className="w-6 h-6" />}
              gradient="#ff8a00 0%, #e52e71 100%"
            />
            <FeatureCard
              title="AI-Powered Resume"
              description="Get personalized feedback and suggestions to improve your resume with our advanced AI editor."
              icon={<FiEdit3 className="w-6 h-6" />}
              gradient="#00b09b 0%, #96c93d 100%"
            />
            <FeatureCard
              title="Career Growth"
              description="Discover events, internships, and opportunities tailored to your skills and aspirations."
              icon={<FiTrendingUp className="w-6 h-6" />}
              gradient="#ff6b9d 0%, #c44569 100%"
            />
          </div>
        </div>
      )
    },
    {
      title: "Upload Resume",
      description: "Add your resume to get started",
      icon: <FiUpload className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Upload Your Resume
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Upload your resume to get personalized recommendations and networking opportunities.
            </p>
          </div>
          
          <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl p-12 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiUpload className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Drop your resume here
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              or click to browse files
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
              Choose File
            </button>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-4">
              Supports PDF, DOCX, and TXT files up to 10MB
            </p>
          </div>
          
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6">
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">
              Why upload your resume?
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex items-center gap-2">
                <FiCheck className="w-4 h-4 text-success-500" />
                Get personalized job and internship recommendations
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="w-4 h-4 text-success-500" />
                Receive AI-powered resume improvement suggestions
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="w-4 h-4 text-success-500" />
                Connect with relevant clubs and organizations
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="w-4 h-4 text-success-500" />
                Find networking opportunities that match your skills
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Set Goals",
      description: "Tell us about your career goals",
      icon: <FiTarget className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              What are your career goals?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Help us personalize your experience by sharing your interests and aspirations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Find Internships", description: "Looking for summer or semester internships", icon: <FiTrendingUp className="w-5 h-5" /> },
              { title: "Join Clubs", description: "Connect with campus organizations", icon: <FiUsers className="w-5 h-5" /> },
              { title: "Improve Resume", description: "Get feedback and suggestions", icon: <FiEdit3 className="w-5 h-5" /> },
              { title: "Network", description: "Build professional connections", icon: <FiZap className="w-5 h-5" /> }
            ].map((goal, index) => (
              <button
                key={index}
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-md transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {goal.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white">
                      {goal.title}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {goal.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6">
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">
              💡 Pro Tip
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              You can always update your preferences later in your profile settings. 
              The more specific you are, the better we can match you with relevant opportunities.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Complete",
      description: "You're all set!",
      icon: <FiCheck className="w-6 h-6" />,
      content: (
        <div className="space-y-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
            You're All Set! 🎉
          </h2>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
            Welcome to ResumeDrop! Your profile is ready and you're now connected to a world of opportunities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                Explore Events
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Discover exciting opportunities and events
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiEdit3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                Edit Resume
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Improve your resume with AI suggestions
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                Find Opportunities
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Get matched with relevant positions
              </p>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/root/home')}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-lg flex items-center gap-3 mx-auto"
          >
            Get Started
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex) || stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 dark:from-neutral-900 dark:via-primary-900/20 dark:to-secondary-900/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-300 dark:to-secondary-300 bg-clip-text text-transparent mb-4">
            Get Started
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Complete these steps to set up your profile
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isActive={index === currentStep}
                isCompleted={completedSteps.includes(index)}
                onClick={() => handleStepClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="p-8">
            {steps[currentStep].content}
          </div>
          
          {/* Navigation */}
          <div className="px-8 py-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentStep === 0
                    ? 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <FiArrowLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <div className="w-32 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Next
                  <FiArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => router.push('/root/home')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Get Started
                  <FiArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 