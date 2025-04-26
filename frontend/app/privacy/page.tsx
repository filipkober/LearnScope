import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Page() {
    return (
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
            <Navbar />
            <main className="flex flex-col items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
                <div className="w-full max-w-4xl space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Privacy Policy</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    
                    <div className="mt-8 space-y-6 text-sm">
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">1. Introduction</h2>
                            <p>
                                At LearnScope, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                                and safeguard your information when you use our service. Please read this privacy policy carefully. 
                                If you do not agree with the terms of this privacy policy, please do not access the site.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
                            <h3 className="text-lg font-medium mt-3">2.1 Personal Data</h3>
                            <p>
                                When you register for an account, we may collect personally identifiable information, such as:
                            </p>
                            <ul className="list-disc pl-8 space-y-2">
                                <li>Your name</li>
                                <li>Email address</li>
                                <li>Username</li>
                                <li>Profile information</li>
                            </ul>
                            
                            <h3 className="text-lg font-medium mt-3">2.2 Usage Data</h3>
                            <p>
                                We may also collect information on how the service is accessed and used. This usage data may include:
                            </p>
                            <ul className="list-disc pl-8 space-y-2">
                                <li>Your computer&apos;s Internet Protocol address (IP address)</li>
                                <li>Browser type and version</li>
                                <li>Pages of our service that you visit</li>
                                <li>Time and date of your visit</li>
                                <li>Time spent on those pages</li>
                                <li>Other diagnostic data</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
                            <p>
                                We may use the information we collect for various purposes, including:
                            </p>
                            <ul className="list-disc pl-8 space-y-2">
                                <li>Providing and maintaining our service</li>
                                <li>Notifying you about changes to our service</li>
                                <li>Allowing you to participate in interactive features of our service</li>
                                <li>Providing customer support</li>
                                <li>Gathering analysis to improve our service</li>
                                <li>Monitoring usage of our service</li>
                                <li>Detecting, preventing, and addressing technical issues</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">4. Data Security</h2>
                            <p>
                                The security of your data is important to us, but remember that no method of transmission over 
                                the Internet or method of electronic storage is 100% secure. While we strive to use commercially 
                                acceptable means to protect your personal data, we cannot guarantee its absolute security.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
                            <p>
                                We may employ third-party companies and individuals to facilitate our service, provide the 
                                service on our behalf, perform service-related services, or assist us in analyzing how our service is used.
                            </p>
                            <p>
                                These third parties have access to your personal data only to perform these tasks on our behalf 
                                and are obligated not to disclose or use it for any other purpose.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">6. Children&apos;s Privacy</h2>
                            <p>
                                Our service does not address anyone under the age of 13. We do not knowingly collect personally 
                                identifiable information from anyone under the age of 13. If you are a parent or guardian and you 
                                are aware that your child has provided us with personal data, please contact us so that we can take necessary actions.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">7. Changes to This Privacy Policy</h2>
                            <p>
                                We may update our privacy policy from time to time. We will notify you of any changes by posting 
                                the new privacy policy on this page and updating the &quot;Last updated&quot; date at the top of this privacy policy.
                            </p>
                            <p>
                                You are advised to review this privacy policy periodically for any changes. Changes to this 
                                privacy policy are effective when they are posted on this page.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">8. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy, please contact us at privacy@learnscope.com.
                            </p>
                        </section>

                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                            <Link href="/terms" className="text-blue-500 hover:underline hover:underline-offset-4">
                                View Terms of Service
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