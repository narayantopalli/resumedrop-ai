"use client";

import HomePageContent from "@/components/home/HomePageContent";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const resumeText = localStorage.getItem('resumeText');
        const selectedResume = localStorage.getItem('selectedResume');
        console.log(resumeText, selectedResume);
        if (resumeText || selectedResume) {
            router.push("/upload");
        }
    }, []);

    return (
        <>
            {/* Tab Content */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 xl:p-8 2xl:p-10 max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
                <HomePageContent />
            </div>
        </>
    );
}