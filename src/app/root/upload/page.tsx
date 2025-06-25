import ResumePage from "@/components/upload/Resume";

export default function Profile() {
    return (
        <>
            {/* Tab Content */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                <ResumePage />
            </div>
        </>
    );
}