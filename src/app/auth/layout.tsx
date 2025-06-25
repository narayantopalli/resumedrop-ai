export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-300 to-accent-200 flex-col justify-center items-center px-12">
        <div className="max-w-md text-center text-neutral-800">
          <h1 className="text-5xl text-accent-600 font-bold mb-6">
            resumedrop.ai
          </h1>
          <p className="text-xl mb-8 text-neutral-700">
            Find peers who have similar interests!
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-neutral-800 rounded-full"></div>
              <span className="text-neutral-700">Meet peers who are ambitious and driven like you</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-neutral-800 rounded-full"></div>
              <span className="text-neutral-700">Get free resume advice from AI tuned to your field</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-neutral-800 rounded-full"></div>
              <span className="text-neutral-700">All you need to do is upload your resume</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 my-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-accent-600 mb-2">
              resumedrop.ai
            </h1>
            <p className="text-neutral-600">
              Find the people who think like you!
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
} 