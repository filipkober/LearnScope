import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";



export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
        <div className="max-w-4xl w-full space-y-8 text-center">
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={100}
            height={100}
            className="h-24 md:h-32 w-auto mx-auto"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Welcome to LearnScope</h1>
          <p className="mt-4 text-lg text-foreground/80">Your learning journey starts here.</p>
          <p className="mt-2 text-lg text-foreground/80">Explore our features and get started!</p>
          <div className="mt-8">
            <Link href="/register">
              <Button variant="default" size="lg" className="px-8 py-6 text-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="w-full py-6 border-t border-border bg-muted/30">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LearnScope. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
