"use client";

import { useSession } from "@/contexts/SessionContext";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const { userMetadata } = useSession();

    return (
      <>
        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {userMetadata?.name && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2">
                Hey, {userMetadata?.name}!
              </h2>
            </div>
          )}
          {children}
        </main>
      </>
    );
}