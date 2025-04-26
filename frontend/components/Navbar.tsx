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
    const user = { name: "John Doe" }; // Replace with actual user data

    const profilePicture = createAvatar(initials, {
        seed: user.name,
    })

  return (
    <nav className="flex items-center justify-between p-4 bg-border sticky w-screen top-0 z-50">
        <div className="flex gap-8">
        <Link href="/">
        <div className="flex gap-2">
        <Image
        src={"/logo.png"}
        alt="Logo"
        width={100}
        height={100}
        className="h-10 w-auto"
        />
        <h1 className="text-2xl font-bold my-auto">LearnScope</h1>
        </div>
        </Link>
        <NavigationMenu className="my-auto">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/about" >About</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">Dashboard</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink href="/dashboard/overview">Overview</NavigationMenuLink>
                        <NavigationMenuLink href="/dashboard/templates">Templates</NavigationMenuLink>
                        <NavigationMenuLink href="/dashboard/statistics">Statistics</NavigationMenuLink>
                        <NavigationMenuLink href="/dashboard/exercise">Single Exercise</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        </div>
        <div className="flex gap-8">
        <DarkModeSwitch className="my-auto" />
        {loggedIn ? (
            <Link href="dashboard/profile">
            <Avatar>
                <AvatarImage
                src={profilePicture.toDataUri()} />
                <AvatarFallback>
                    {user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
            </Avatar>
            </Link>
        ) : (
            <Button>
                Login
            </Button>
        )}
        </div>
    </nav>
  )
}
