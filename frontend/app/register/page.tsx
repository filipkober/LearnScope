"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAgreed: false
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        
        // Validation
        if (!formData.username || !formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!formData.termsAgreed) {
            setError("You must agree to the terms and conditions");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            // Registration successful, redirect to login
            router.push('/login?registered=true');
        } catch (err) {
            if(err instanceof Error) {
            setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

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
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium">
                                    Username
                                </label>
                                <Input 
                                    id="username"
                                    placeholder="Choose a username" 
                                    className="mt-1 w-full" 
                                    value={formData.username}
                                    onChange={handleChange}
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
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    value={formData.password}
                                    onChange={handleChange}
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
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="termsAgreed"
                                name="terms"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 focus:ring-2"
                                checked={formData.termsAgreed}
                                onChange={handleChange}
                            />
                            <label htmlFor="termsAgreed" className="ml-2 block text-sm">
                                I agree to the <Link href="/terms" className="text-blue-500 hover:underline hover:underline-offset-4">Terms of Service</Link> and <Link href="/privacy" className="text-blue-500 hover:underline hover:underline-offset-4">Privacy Policy</Link>
                            </label>
                        </div>

                        <Button 
                            type="submit" 
                            variant="default" 
                            size="lg" 
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-500 hover:underline hover:underline-offset-4">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}