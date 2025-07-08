"use client";

import ResumePage from "@/components/upload/Resume";
import { useSession } from "@/contexts/SessionContext";

export default function UploadPage() {
    const { userMetadata } = useSession();

    return (
        <>
            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {userMetadata?.name && (
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2">
                  Hey, {userMetadata?.name.split(' ')[0]}!
                </h2>
              </div>
            )}
            {/* Tab Content */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 xl:p-8 2xl:p-10 max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
                <ResumePage />
            </div>
        </div>
        </>
    );
}