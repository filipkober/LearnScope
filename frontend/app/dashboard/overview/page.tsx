import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardOverview() {
    // This would normally come from authentication
    const userName = "User";
    
    return (
        <div className="p-6 space-y-8">
            <section className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Hello, {userName}!</h1>
                <p className="text-muted-foreground">
                    Welcome to your LearnScope dashboard. What would you like to do today?
                </p>
            </section>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Templates Tile */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                            </svg>
                        </div>
                        <CardTitle>Exam Templates</CardTitle>
                        <CardDescription>
                            Upload or create new exam templates for your subjects
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Generate practice materials from your existing exams or describe the content you want to study.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/templates" className="w-full">
                            <Button className="w-full">Manage Templates</Button>
                        </Link>
                    </CardFooter>
                </Card>

                {/* Statistics Tile */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                            </svg>
                        </div>
                        <CardTitle>Statistics</CardTitle>
                        <CardDescription>
                            Track your performance and identify weak areas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Review your progress over time and see which topics need more attention based on your performance.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/statistics" className="w-full">
                            <Button className="w-full">View Statistics</Button>
                        </Link>
                    </CardFooter>
                </Card>

                {/* Single Exercise Tile */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-300 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                        </div>
                        <CardTitle>Practice Now</CardTitle>
                        <CardDescription>
                            Start a quick practice session on any topic
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Generate a single exercise focused on specific topics or try a quick assessment to test your knowledge.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/practice" className="w-full">
                            <Button className="w-full">Start Exercise</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <section className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="bg-muted/40 p-4 rounded-lg text-center">
                    <p className="text-muted-foreground">You haven&apos;t completed any exercises yet.</p>
                    <p className="text-sm text-muted-foreground">Your recent activity will appear here once you start practicing.</p>
                </div>
            </section>
        </div>
    );
}