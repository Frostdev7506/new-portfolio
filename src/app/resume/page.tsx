import { ResumeViewer } from "@/components/resume/resume-viewer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resume | Neeraj Butola",
    description: "Senior Full Stack (MERN) + Cloud Engineer Resume",
};

export default function ResumePage() {
    return (
        <main className="min-h-screen pt-20 pb-12 bg-gray-100 dark:bg-zinc-900">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Resume</h1>
                    <p className="text-muted-foreground">My professional experience and skills, exactly as they appear on paper.</p>
                </div>
                <div className="overflow-x-auto pb-8">
                    <ResumeViewer />
                </div>
            </div>
        </main>
    );
}
