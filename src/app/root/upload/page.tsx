"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import ResumePage from "@/components/upload/Resume";
import { FiLoader } from "react-icons/fi";

export default function UploadPage() {
    const router = useRouter();
    const { session, loadingSession } = useSession();

    useEffect(() => {
        if (!loadingSession && !session) {
            router.push('/sign-in');
        }
    }, [session, loadingSession, router]);

    // Show loading state while checking authentication
    if (loadingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 flex items-center gap-4 shadow-lg">
                    <FiLoader className="w-6 h-6 animate-spin text-primary-600" />
                    <p className="text-primary-900 dark:text-white">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render the upload component if user is not authenticated
    if (!session) {
        return null;
    }

    return (
        <>
            {/* Tab Content */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                <ResumePage />
            </div>
        </>
    );
}