"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function SettingsPage() {
    // In a real app, these would come from a user context or API
    const [notifications, setNotifications] = useState({
        email: true,
        practice: true,
        results: true,
        weeklyReport: false,
        marketing: false
    });
    
    const [preferences, setPreferences] = useState({
        theme: "system",
        difficulty: "adaptive"
    });

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                {/* Profile Settings */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your profile information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src="/placeholder-avatar.jpg" alt="Profile picture" />
                                    <AvatarFallback className="text-xl">US</AvatarFallback>
                                </Avatar>
                                
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-base font-medium">Profile Picture</h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        This will be displayed on your profile and in your activities
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Upload New</Button>
                                        <Button variant="outline" size="sm">Remove</Button>
                                    </div>
                                </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="grid gap-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input id="fullName" placeholder="Your full name" defaultValue="User Sample" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="displayName">Display Name</Label>
                                        <Input id="displayName" placeholder="How you'll appear to others" defaultValue="User" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea 
                                        id="bio" 
                                        placeholder="A brief description about yourself"
                                        className="min-h-[100px]"
                                        defaultValue="Student learning with LearnScope"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Brief description for your profile. Maximum 160 characters.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <Button>Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                {/* Account Settings */}
                <TabsContent value="account" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>
                                Update your account details and email
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" placeholder="Your email address" defaultValue="user@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="Your username" defaultValue="user123" />
                            </div>
                            
                            <div className="flex justify-end">
                                <Button>Update Account</Button>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your password to secure your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" type="password" placeholder="Enter your current password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" type="password" placeholder="Enter your new password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" type="password" placeholder="Confirm your new password" />
                            </div>
                            
                            <div className="flex justify-end">
                                <Button>Change Password</Button>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-red-200 dark:border-red-900">
                        <CardHeader>
                            <CardTitle className="text-red-500">Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible and destructive actions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium">Delete Account</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently delete your account and all of your data
                                    </p>
                                </div>
                                <Button variant="destructive">Delete Account</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Control when and how you receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive email notifications from LearnScope
                                        </p>
                                    </div>
                                    <Switch 
                                        checked={notifications.email}
                                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                                    />
                                </div>
                                
                                <Separator />
                                
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Practice Reminders</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Get reminders to practice regularly
                                        </p>
                                    </div>
                                    <Switch 
                                        checked={notifications.practice}
                                        onCheckedChange={(checked) => setNotifications({...notifications, practice: checked})}
                                    />
                                </div>
                                
                                <Separator />
                                
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Exam Results</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive notifications about your exam results
                                        </p>
                                    </div>
                                    <Switch 
                                        checked={notifications.results}
                                        onCheckedChange={(checked) => setNotifications({...notifications, results: checked})}
                                    />
                                </div>
                                
                                <Separator />
                                
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Weekly Progress Report</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Get a weekly summary of your learning progress
                                        </p>
                                    </div>
                                    <Switch 
                                        checked={notifications.weeklyReport}
                                        onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
                                    />
                                </div>
                                
                                <Separator />
                                
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Marketing Updates</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Learn about new features and promotions
                                        </p>
                                    </div>
                                    <Switch 
                                        checked={notifications.marketing}
                                        onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <Button>Save Preferences</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                {/* App Preferences */}
                <TabsContent value="preferences" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Preferences</CardTitle>
                            <CardDescription>
                                Customize how LearnScope works for you
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="theme">Theme Preference</Label>
                                        <Select 
                                            value={preferences.theme} 
                                            onValueChange={(value) => setPreferences({...preferences, theme: value})}
                                        >
                                            <SelectTrigger id="theme">
                                                <SelectValue placeholder="Select a theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">Light</SelectItem>
                                                <SelectItem value="dark">Dark</SelectItem>
                                                <SelectItem value="system">System Default</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground">
                                            Choose the appearance of the application
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="difficulty">Default Difficulty</Label>
                                        <Select 
                                            value={preferences.difficulty} 
                                            onValueChange={(value) => setPreferences({...preferences, difficulty: value})}
                                        >
                                            <SelectTrigger id="difficulty">
                                                <SelectValue placeholder="Select difficulty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="easy">Easy</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                                <SelectItem value="adaptive">Adaptive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground">
                                            Default difficulty level for practice questions
                                        </p>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Data Collection</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Allow anonymous usage data to improve LearnScope
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <Button>Save Preferences</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}