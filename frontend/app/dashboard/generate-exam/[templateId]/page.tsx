"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Template = {
    id: string;
    name: string;
    description: string;
    topics: string[];
};

// In a real app, this data would come from your API
const sampleTemplates = [
    {
        id: "1",
        name: "Computer Science Fundamentals",
        description: "Core concepts in programming, algorithms, and data structures",
        topics: ["Data Structures", "Algorithms", "Object-Oriented Programming", "Time Complexity"]
    },
    {
        id: "2",
        name: "Advanced Mathematics",
        description: "Calculus, linear algebra, and differential equations",
        topics: ["Calculus", "Linear Algebra", "Differential Equations", "Vector Calculus"]
    },
    {
        id: "3",
        name: "Software Engineering Practices",
        description: "Software development methodologies and best practices",
        topics: ["Agile Development", "Design Patterns", "Testing Methodologies", "DevOps"]
    }
];

export default function GenerateExamPage() {
    const { templateId } = useParams<{ templateId: string }>();
    const router = useRouter();
    
    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [difficulty, setDifficulty] = useState<string>("medium");
    const [questionCount, setQuestionCount] = useState<number>(5);
    const [timeLimit, setTimeLimit] = useState<number>(45); // in minutes
    const [generating, setGenerating] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    useEffect(() => {
        // Simulating API call to fetch template details
        const fetchTemplate = async () => {
            try {
                // In a real app, fetch from API
                const found = sampleTemplates.find(t => t.id === templateId);
                if (found) {
                    setTemplate(found);
                    // By default, select all topics
                    setSelectedTopics(found.topics);
                }
            } catch (error) {
                console.error("Failed to fetch template:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [templateId]);

    const handleTopicToggle = (topic: string) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter(t => t !== topic));
        } else {
            setSelectedTopics([...selectedTopics, topic]);
        }
    };

    const handleGenerateExam = async () => {
        if (selectedTopics.length === 0) {
            toast.error("Please select at least one topic");
            return;
        }

        setGenerating(true);
        
        try {
            // In a real app, make API call to generate the exam
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Generate a unique exam ID
            const examId = `exam-${Date.now()}`;
            
            // Pretend we've created the exam successfully
            toast.success("Exam created successfully!");
            
            // Redirect to the newly created exam
            router.push(`/dashboard/exams/${examId}`);
        } catch (error) {
            console.error("Failed to generate exam:", error);
            toast.error("Failed to generate exam. Please try again.");
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold">Template Not Found</h1>
                <p className="mt-2">We couldn&apos;t find the template you&apos;re looking for.</p>
                <Button 
                    className="mt-4"
                    onClick={() => router.push('/dashboard/templates')}
                >
                    Back to Templates
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Generate Exam</h1>
                <p className="text-muted-foreground">
                    Create a custom exam from the &quot;{template.name}&quot; template
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Settings</CardTitle>
                        <CardDescription>
                            Customize the difficulty, length, and time limit of your exam
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <RadioGroup 
                                defaultValue={difficulty}
                                value={difficulty}
                                onValueChange={setDifficulty}
                                className="flex flex-col space-y-1"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="easy" id="easy" />
                                    <Label htmlFor="easy">Easy</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="medium" id="medium" />
                                    <Label htmlFor="medium">Medium</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="hard" id="hard" />
                                    <Label htmlFor="hard">Hard</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="mixed" id="mixed" />
                                    <Label htmlFor="mixed">Mixed</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="question-count">Number of Questions</Label>
                                <span className="text-sm font-medium">{questionCount}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setQuestionCount(Math.max(1, questionCount - 1))}
                                    disabled={questionCount <= 1}
                                >
                                    -
                                </Button>
                                <Slider 
                                    id="question-count"
                                    value={[questionCount]} 
                                    min={1} 
                                    max={20} 
                                    step={1} 
                                    onValueChange={(values) => setQuestionCount(values[0])}
                                    className="flex-1"
                                />
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setQuestionCount(Math.min(20, questionCount + 1))}
                                    disabled={questionCount >= 20}
                                >
                                    +
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                                <span className="text-sm font-medium">{timeLimit} min</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setTimeLimit(Math.max(5, timeLimit - 5))}
                                    disabled={timeLimit <= 5}
                                >
                                    -
                                </Button>
                                <Slider 
                                    id="time-limit"
                                    value={[timeLimit]} 
                                    min={5} 
                                    max={120} 
                                    step={5} 
                                    onValueChange={(values) => setTimeLimit(values[0])}
                                    className="flex-1"
                                />
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setTimeLimit(Math.min(120, timeLimit + 5))}
                                    disabled={timeLimit >= 120}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Topics</CardTitle>
                        <CardDescription>
                            Select which topics to include in your exam
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Select topics to include:</span>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-xs h-auto p-0"
                                    onClick={() => {
                                        if (selectedTopics.length === template.topics.length) {
                                            setSelectedTopics([]);
                                        } else {
                                            setSelectedTopics([...template.topics]);
                                        }
                                    }}
                                >
                                    {selectedTopics.length === template.topics.length ? "Deselect All" : "Select All"}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {template.topics.map((topic) => (
                                    <div key={topic} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`topic-${topic}`}
                                            checked={selectedTopics.includes(topic)}
                                            onChange={() => handleTopicToggle(topic)}
                                            className="rounded"
                                        />
                                        <label htmlFor={`topic-${topic}`} className="text-sm">
                                            {topic}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="space-y-2 w-full">
                            <div className="flex justify-between">
                                <Button 
                                    variant="outline" 
                                    onClick={() => router.push('/dashboard/templates')}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleGenerateExam}
                                    disabled={generating || selectedTopics.length === 0}
                                >
                                    {generating ? "Generating..." : "Generate Exam"}
                                </Button>
                            </div>
                            {selectedTopics.length === 0 && (
                                <p className="text-xs text-red-500">Please select at least one topic</p>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Exam Preview</CardTitle>
                    <CardDescription>
                        Summary of your exam configuration
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium">Template</h3>
                                <p>{template.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">Difficulty</h3>
                                <p className="capitalize">{difficulty}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">Questions</h3>
                                <p>{questionCount}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">Time Limit</h3>
                                <p>{timeLimit} minutes</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Selected Topics</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedTopics.length > 0 ? (
                                    selectedTopics.map((topic) => (
                                        <span key={topic} className="px-2 py-1 bg-muted rounded-full text-xs">
                                            {topic}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No topics selected</p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}