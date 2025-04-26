import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Page() {
    return (
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
            <Navbar />
            <main className="flex flex-col items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Welcome Back</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Sign in to continue to LearnScope
                        </p>
                    </div>
                    
                    <div className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium">
                                    Username
                                </label>
                                <Input 
                                    id="username"
                                    placeholder="Enter your username" 
                                    className="mt-1 w-full" 
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium">
                                    Password
                                </label>
                                <Input 
                                    id="password"
                                    placeholder="Enter your password" 
                                    type="password" 
                                    className="mt-1 w-full" 
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 focus:ring-2"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <Link href="/forgot-password" className="text-blue-500 hover:underline hover:underline-offset-4">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <Button variant="default" size="lg" className="w-full">
                            Sign In
                        </Button>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-blue-500 hover:underline hover:underline-offset-4">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}