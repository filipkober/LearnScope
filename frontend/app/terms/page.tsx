import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Page() {
    return (
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
            <Navbar />
            <main className="flex flex-col items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
                <div className="w-full max-w-4xl space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Terms of Service</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    
                    <div className="mt-8 space-y-6 text-sm">
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">1. Introduction</h2>
                            <p>
                                Welcome to LearnScope. By using our website and services, you agree to comply with and be bound by the following terms and conditions. 
                                Please review these terms carefully before using our platform.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">2. Definitions</h2>
                            <p>
                                <strong>&quot;Service&quot;</strong> refers to the LearnScope website, platform, and all content and services provided by LearnScope.
                            </p>
                            <p>
                                <strong>&quot;User&quot;</strong> refers to any individual who accesses or uses the Service, whether registered or not.
                            </p>
                            <p>
                                <strong>&quot;Account&quot;</strong> refers to the registered profile of a User on the Service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">3. Account Registration and Security</h2>
                            <p>
                                To use certain features of the Service, you may be required to register for an Account. You agree to provide accurate, current, and complete information 
                                during the registration process and to update such information to keep it accurate, current, and complete.
                            </p>
                            <p>
                                You are responsible for maintaining the confidentiality of your Account credentials and for all activities that occur under your Account. 
                                You agree to immediately notify LearnScope of any unauthorized use of your Account or any other breach of security.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">4. User Conduct</h2>
                            <p>
                                You agree not to use the Service to:
                            </p>
                            <ul className="list-disc pl-8 space-y-2">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe upon the rights of others</li>
                                <li>Distribute or upload harmful software or content</li>
                                <li>Impersonate any person or entity</li>
                                <li>Interfere with or disrupt the Service</li>
                                <li>Attempt to gain unauthorized access to the Service</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">5. Intellectual Property Rights</h2>
                            <p>
                                The Service and its original content, features, and functionality are owned by LearnScope and are protected by international copyright, 
                                trademark, patent, trade secret, and other intellectual property laws.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">6. Termination</h2>
                            <p>
                                We may terminate or suspend your Account and bar access to the Service immediately, without prior notice or liability, 
                                under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">7. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice 
                                prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">8. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms, please contact us at support@learnscope.com.
                            </p>
                        </section>

                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                            <Link href="/privacy" className="text-blue-500 hover:underline hover:underline-offset-4">
                                View Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} LearnScope. All rights reserved.
            </footer>
        </div>
    );
}