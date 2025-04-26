"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, MoreVerticalIcon, FileTextIcon, CameraIcon, TrashIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Sample template data (would come from backend in real app)


type Template = {
    id: string;
    name: string;
    description: string;
    topics: string[];
    createdAt: string;
};

const sampleTemplates: Template[] = [
    {
        id: "1",
        name: "Computer Science Fundamentals",
        description: "Core concepts in programming, algorithms, and data structures",
        topics: ["Data Structures", "Algorithms", "Object-Oriented Programming", "Time Complexity"],
        createdAt: "2023-10-15"
    },
    {
        id: "2",
        name: "Advanced Mathematics",
        description: "Calculus, linear algebra, and differential equations",
        topics: ["Calculus", "Linear Algebra", "Differential Equations", "Vector Calculus"],
        createdAt: "2023-11-02"
    },
    {
        id: "3",
        name: "Software Engineering Practices",
        description: "Software development methodologies and best practices",
        topics: ["Agile Development", "Design Patterns", "Testing Methodologies", "DevOps"],
        createdAt: "2023-12-05"
    }
];

export default function Page() {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [templates, setTemplates] = useState(sampleTemplates);

    const handleDeleteTemplate = (id: string) => {
        setTemplates(templates.filter(template => template.id !== id));
        setShowDeleteConfirm(false);
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Exam Templates</h1>
                    <p className="text-muted-foreground">
                        Manage your exam templates and generate practice tests
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <PlusIcon className="w-4 h-4" /> New Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Exam Template</DialogTitle>
                            <DialogDescription>
                                Choose how you want to create your new exam template
                            </DialogDescription>
                        </DialogHeader>
                        
                        <Tabs defaultValue="text" className="w-full mt-4">
                            <TabsList className="grid grid-cols-3 w-full">
                                <TabsTrigger value="text">Text Description</TabsTrigger>
                                <TabsTrigger value="pdf">Upload PDF</TabsTrigger>
                                <TabsTrigger value="photo">Upload Photo</TabsTrigger>
                            </TabsList>
                            <TabsContent value="text" className="space-y-4 mt-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Template Name</h4>
                                    <input 
                                        type="text" 
                                        placeholder="Enter a name for this template" 
                                        className="w-full p-2 rounded-md border"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Describe the exam content</h4>
                                    <Textarea 
                                        placeholder="Describe the topics, concepts, and knowledge areas that should be covered in this exam template..." 
                                        className="min-h-[150px]"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Our AI will analyze your description and identify key topics to create a template.
                                </p>
                            </TabsContent>
                            
                            <TabsContent value="pdf" className="space-y-4 mt-4">
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FileTextIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-muted-foreground">PDF (MAX. 10MB)</p>
                                        </div>
                                        <input type="file" className="hidden" accept=".pdf" />
                                    </label>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Template Name</h4>
                                    <input 
                                        type="text" 
                                        placeholder="Enter a name for this template" 
                                        className="w-full p-2 rounded-md border"
                                    />
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="photo" className="space-y-4 mt-4">
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <CameraIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-muted-foreground">JPG, PNG (MAX. 5MB)</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" />
                                    </label>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Template Name</h4>
                                    <input 
                                        type="text" 
                                        placeholder="Enter a name for this template" 
                                        className="w-full p-2 rounded-md border"
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                        
                        <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Create Template</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            {/* Template cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl font-semibold">{template.name}</CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreVerticalIcon className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem 
                                            className="text-red-600 flex items-center gap-2"
                                            onClick={() => {
                                                setSelectedTemplate(template);
                                                setShowDeleteConfirm(true);
                                            }}
                                        >
                                            <TrashIcon className="h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardDescription className="text-sm text-muted-foreground">
                                {template.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-2">
                                <h4 className="text-sm font-medium mb-1">Topics</h4>
                                <div className="flex flex-wrap gap-2">
                                    {template.topics.slice(0, 3).map((topic, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-muted rounded-full text-xs">
                                            {topic}
                                        </span>
                                    ))}
                                    {template.topics.length > 3 && (
                                        <span className="px-2 py-1 bg-muted rounded-full text-xs">
                                            +{template.topics.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Created on {new Date(template.createdAt).toLocaleDateString()}
                            </p>
                        </CardContent>
                        <CardFooter className="pt-2 flex justify-between">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-xs">Preview Topics</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{template.name}</DialogTitle>
                                        <DialogDescription>
                                            Topics and concepts covered in this template
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4 space-y-4">
                                        <div className="flex flex-col">
                                            <h3 className="text-sm font-medium mb-2">Topics</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {template.topics.map((topic, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted/40 rounded-md">
                                                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{topic}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">{template.description}</p>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Link href={`/dashboard/generate-exam/${template.id}`}>
                                <Button size="sm" className="text-xs">Generate Exam</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            
            {/* Empty state if no templates */}
            {templates.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-lg">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <FileTextIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No templates yet</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                        Create your first template by uploading an existing exam or describing the topics you want to study
                    </p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <PlusIcon className="w-4 h-4" /> New Template
                            </Button>
                        </DialogTrigger>
                        {/* Dialog content (same as above) */}
                    </Dialog>
                </div>
            )}
            
            {/* Delete confirmation dialog */}
            {showDeleteConfirm && selectedTemplate && (
                <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Template</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete &quot;{selectedTemplate.name}&quot;? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}