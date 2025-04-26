"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RegisterPage() {
    const[username, setUsername] = useState("");
    const[email,setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        if (password !== confirmPassword) {
          alert("Hasła się nie zgadzają!");
          return;
        }

        try {const res = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, email, password}),
        });

        const data = await res.json();
        alert(data.message||data.error);
        }catch (error) {
            console.error("Error during registration:", error);
            alert("Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.");
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
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)
                                    }
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
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                        <Button variant="default" size="lg" className="w-full" onClick={handleRegister}>
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