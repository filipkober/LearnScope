import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
            <Navbar />
            <main className="flex flex-col items-center p-8 font-[family-name:var(--font-geist-sans)]">
                <div className="w-full max-w-4xl space-y-16">
                    {/* Hero section */}
                    <section className="text-center space-y-6">
                        <h1 className="text-4xl font-bold">About LearnScope</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Revolutionizing exam preparation with AI-powered personalized learning
                        </p>
                    </section>

                    {/* What is LearnScope */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold">What is LearnScope?</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            LearnScope is an intelligent study assistant that adapts to your learning needs. 
                            Our platform leverages advanced AI to analyze your existing exam materials or 
                            create new ones based on your descriptions, identifying key topics and generating 
                            personalized practice exams tailored specifically to strengthen your weak points.
                        </p>
                    </section>

                    {/* How it works */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-semibold">How It Works</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300 font-bold text-xl">1</div>
                                <h3 className="text-xl font-medium">Upload or Describe</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Upload your existing exam materials or describe the subjects and topics you need to study.
                                </p>
                            </div>
                            
                            <div className="space-y-3 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300 font-bold text-xl">2</div>
                                <h3 className="text-xl font-medium">AI Analysis</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Our AI identifies key topics, concepts, and knowledge areas from your materials.
                                </p>
                            </div>
                            
                            <div className="space-y-3 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300 font-bold text-xl">3</div>
                                <h3 className="text-xl font-medium">Personalized Exams</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Practice with custom exams that focus on your weak points and adapt as you improve.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Key Features */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-semibold">Key Features</h2>
                        
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Intelligent Topic Analysis</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Upload existing exams or describe your study needs, and our AI will identify key concepts and topics.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Adaptive Learning</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Our system identifies your weak points and dynamically generates practice questions focused on areas where you need improvement.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Custom Mock Exams</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Generate unlimited practice exams with varying difficulty levels tailored to your learning progress.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Progress Tracking</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Monitor your improvement over time with detailed analytics and performance insights.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="text-center space-y-6 py-8">
                        <h2 className="text-2xl font-semibold">Ready to transform your study routine?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="px-8">Get Started</Button>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
            <footer className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} LearnScope. All rights reserved.
            </footer>
        </div>
    );
}