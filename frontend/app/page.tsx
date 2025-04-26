import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="flex flex-col items-center p-4 mt-4">
        <Image
          src={"/logo.png"}
          alt="Logo"
          width={100}
          height={100}
          className="h-[15vh] w-auto"
        />
        <h1 className="text-4xl font-bold">Welcome to LearnScope</h1>
        <p className="mt-4 text-lg">Your learning journey starts here.</p>
        <p className="mt-2 text-lg">Explore our features and get started!</p>
        <div className="mt-8">
          <Button variant="default" size="lg">
            Get Started
          </Button>
        </div>
      </main>
    </div>
  );
}
