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
                        <h1 className="text-2xl font-bold">Create Account</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Sign up to join LearnScope
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
                                    placeholder="Choose a username" 
                                    className="mt-1 w-full" 
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email
                                </label>
                                <Input 
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email" 
                                    className="mt-1 w-full" 
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium">
                                    Password
                                </label>
                                <Input 
                                    id="password"
                                    placeholder="Create a password" 
                                    type="password" 
                                    className="mt-1 w-full" 
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                    Confirm Password
                                </label>
                                <Input 
                                    id="confirmPassword"
                                    placeholder="Confirm your password" 
                                    type="password" 
                                    className="mt-1 w-full" 
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 focus:ring-2"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm">
                                I agree to the <Link href="/terms" className="text-blue-500 hover:underline hover:underline-offset-4">Terms of Service</Link> and <Link href="/privacy" className="text-blue-500 hover:underline hover:underline-offset-4">Privacy Policy</Link>
                            </label>
                        </div>

                        <Button variant="default" size="lg" className="w-full">
                            Create Account
                        </Button>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-500 hover:underline hover:underline-offset-4">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}