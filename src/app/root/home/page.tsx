"use client";

import HomePageContent from "@/components/home/HomePageContent";

export default function HomePage() {
    return (
        <>
            {/* Tab Content */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 xl:p-8 2xl:p-10 max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
                <HomePageContent />
            </div>
        </>
    );
}