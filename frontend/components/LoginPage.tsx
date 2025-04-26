"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthToken } from "@/utils/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rememberMe: false
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const {checkAuthentication} = useAuth();

    useEffect(() => {
        // Check if user just registered
        if (searchParams.get("registered") === "true") {
            setSuccessMessage("Registration successful! Please log in with your new account.");
        }
    }, [searchParams]);

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
        setSuccessMessage("");
        
        // Validation
        if (!formData.username || !formData.password) {
            setError("Username and password are required");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Store token using the auth utility
            setAuthToken(data.access_token, formData.rememberMe);
            
            // Set token in a cookie for middleware authentication
            document.cookie = `auth_token=${data.access_token}; path=/; ${formData.rememberMe ? '' : 'max-age=86400'}`;
            sessionStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('auth_token', data.access_token);

            await checkAuthentication();
            
            // Check if there's a redirect parameter
            const redirectTo = searchParams.get('redirect') || '/dashboard';
            router.push(redirectTo);
        } catch (err) {
            if (err instanceof Error) {
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
                        <h1 className="text-2xl font-bold">Welcome Back</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Sign in to continue to LearnScope
                        </p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{successMessage}</span>
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
                                    placeholder="Enter your username" 
                                    className="mt-1 w-full"
                                    value={formData.username}
                                    onChange={handleChange} 
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
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 focus:ring-2"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <Link href="/forgot-password" className="text-blue-500 hover:underline hover:underline-offset-4">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <Button 
                            type="submit"
                            variant="default" 
                            size="lg" 
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-blue-500 hover:underline hover:underline-offset-4">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
  )
}
