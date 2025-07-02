import Logo from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-100 to-secondary-50 flex-col justify-center items-center px-12">
        <div className="max-w-md text-center text-neutral-800">
          <div className="mb-6">
            <Logo size="lg" className="justify-center" />
          </div>
          <p className="text-xl mb-8 text-primary-700">
            Improve your resume, find your dream job!
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-primary-800 rounded-full"></div>
              <span className="text-neutral-700">Meet people who are ambitious and driven like you</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-primary-800 rounded-full"></div>
              <span className="text-neutral-700">Get AI resume advice from industry professionals</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-primary-800 rounded-full"></div>
              <span className="text-neutral-700">Download your networking-ready formatted resume</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 my-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="mb-2">
              <Logo size="md" className="justify-center" />
            </div>
            <p className="text-neutral-600">
              Improve your resume, find your dream job!
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
} 