import { createAvatar } from "@dicebear/core";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { initials } from "@dicebear/collection";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { DarkModeSwitch } from "./DarkModeSwitch";

export default function Navbar() {

    const loggedIn = true; // Replace with actual authentication logic
    const user = { name: "Filip Kober" }; // Replace with actual user data

    const profilePicture = createAvatar(initials, {
        seed: user.name,
    })

  return (
    <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-background to-background/95 backdrop-blur-sm border-b sticky w-full top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
            <Link href="/" className="transition-transform hover:scale-105">
                <div className="flex items-center gap-2">
                    <Image
                        src={"/logo.png"}
                        alt="Logo"
                        width={100}
                        height={100}
                        className="h-10 w-auto"
                    />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">LearnScope</h1>
                </div>
            </Link>
            <NavigationMenu className="my-auto">
                <NavigationMenuList className="gap-2">
                    <NavigationMenuItem>
                        <NavigationMenuLink 
                            href="/about"
                            className="px-4 py-2 rounded-md transition-colors hover:bg-muted"
                        >
                            About
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent hover:bg-muted rounded-md">Dashboard</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-2 min-w-[200px] flex flex-col gap-1">
                                <NavigationMenuLink 
                                    href="/dashboard/overview"
                                    className="px-3 py-2 rounded-md transition-colors hover:bg-muted"
                                >
                                    Overview
                                </NavigationMenuLink>
                                <NavigationMenuLink 
                                    href="/dashboard/templates"
                                    className="px-3 py-2 rounded-md transition-colors hover:bg-muted"
                                >
                                    Templates
                                </NavigationMenuLink>
                                <NavigationMenuLink 
                                    href="/dashboard/statistics"
                                    className="px-3 py-2 rounded-md transition-colors hover:bg-muted"
                                >
                                    Statistics
                                </NavigationMenuLink>
                                <NavigationMenuLink 
                                    href="/dashboard/exercise"
                                    className="px-3 py-2 rounded-md transition-colors hover:bg-muted"
                                >
                                    Single Exercise
                                </NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink 
                            href="/terms"
                            className="px-4 py-2 rounded-md transition-colors hover:bg-muted"
                        >
                            Terms of Service
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink 
                            href="/privacy"
                            className="px-4 py-2 rounded-md transition-colors hover:bg-muted"
                        >
                            Privacy Policy
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
        <div className="flex items-center gap-6">
            <DarkModeSwitch className="my-auto" />
            {loggedIn ? (
                <Link href="/dashboard/profile">
                    <Avatar className="h-9 w-9 transition-transform hover:scale-105 ring-2 ring-background hover:ring-primary">
                        <AvatarImage
                            src={profilePicture.toDataUri()}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            ) : (
                <Button variant="default" size="sm" className="font-medium">
                    Login
                </Button>
            )}
        </div>
    </nav>
  )
}
