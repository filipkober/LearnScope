"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRightIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useState } from "react";

// Sample performance data (would come from API in real app)

type TemplatePerformanceData = {
    id: string;
    name: string;
    overallScore: number;
    questionsAttempted: number;
    topicPerformance: {
        topic: string;
        score: number;
        trend: "increasing" | "decreasing" | "stable";
        questionsAttempted: number;
    }[];
};

const templatePerformanceData: TemplatePerformanceData[] = [
    {
        id: "1",
        name: "Computer Science Fundamentals (sample)",
        overallScore: 72,
        questionsAttempted: 45,
        topicPerformance: [
            { topic: "Data Structures", score: 65, trend: "decreasing", questionsAttempted: 15 },
            { topic: "Algorithms", score: 58, trend: "decreasing", questionsAttempted: 12 },
            { topic: "Object-Oriented Programming", score: 85, trend: "increasing", questionsAttempted: 10 },
            { topic: "Time Complexity", score: 77, trend: "stable", questionsAttempted: 8 }
        ]
    },
    {
        id: "2",
        name: "Advanced Mathematics (sample)",
        overallScore: 68,
        questionsAttempted: 36,
        topicPerformance: [
            { topic: "Calculus", score: 72, trend: "stable", questionsAttempted: 12 },
            { topic: "Linear Algebra", score: 48, trend: "decreasing", questionsAttempted: 10 },
            { topic: "Differential Equations", score: 82, trend: "increasing", questionsAttempted: 8 },
            { topic: "Vector Calculus", score: 70, trend: "stable", questionsAttempted: 6 }
        ]
    },
    {
        id: "3",
        name: "Software Engineering Practices (sample)",
        overallScore: 80,
        questionsAttempted: 25,
        topicPerformance: [
            { topic: "Agile Development", score: 90, trend: "increasing", questionsAttempted: 8 },
            { topic: "Design Patterns", score: 62, trend: "decreasing", questionsAttempted: 6 },
            { topic: "Testing Methodologies", score: 85, trend: "stable", questionsAttempted: 6 },
            { topic: "DevOps", score: 77, trend: "increasing", questionsAttempted: 5 }
        ]
    }
];

export default function StatisticsPage() {
    const [selectedTemplate, setSelectedTemplate] = useState("overall");
    const [timeRange, setTimeRange] = useState("all");

    // Get the currently selected template data
    const getSelectedTemplateData = () => {
        if (selectedTemplate === "overall") {
            return templatePerformanceData;
        }
        return templatePerformanceData.filter(template => template.id === selectedTemplate);
    };

    // Sort topics based on score (ascending to show weakest first)
    const getWeakestTopics = () => {
        const allTopics: { topic: string; score: number; trend: "increasing" | "decreasing" | "stable"; questionsAttempted: number; templateName: string; }[] = [];
        
        if (selectedTemplate === "overall") {
            templatePerformanceData.forEach(template => {
                template.topicPerformance.forEach(topic => {
                    allTopics.push({
                        ...topic,
                        templateName: template.name
                    });
                });
            });
        } else {
            const template = templatePerformanceData.find(t => t.id === selectedTemplate);
            if (template) {
                template.topicPerformance.forEach(topic => {
                    allTopics.push({
                        ...topic,
                        templateName: template.name
                    });
                });
            }
        }
        
        return allTopics.sort((a, b) => a.score - b.score);
    };

    const weakestTopics = getWeakestTopics();
    const selectedData = getSelectedTemplateData();

    // Function to get appropriate color classes based on score
    const getScoreColorClass = (score: number) => {
        if (score < 60) return "text-red-500";
        if (score < 75) return "text-amber-500";
        return "text-green-500";
    };

    // Function to get trend icon
    const getTrendIcon = (trend: "increasing" | "decreasing" | "stable") => {
        switch (trend) {
            case "increasing":
                return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
            case "decreasing":
                return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Performance Statistics</h1>
                    <p className="text-muted-foreground">
                        Track your progress and identify areas that need improvement
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-36">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="month">Last Month</SelectItem>
                            <SelectItem value="week">Last Week</SelectItem>
                            <SelectItem value="day">Last 24 Hours</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {/* Template selector */}
            <Tabs defaultValue="overall" value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <TabsList className="mb-6 overflow-x-auto flex-wrap">
                    <TabsTrigger value="overall">Overall Performance</TabsTrigger>
                    {templatePerformanceData.map(template => (
                        <TabsTrigger key={template.id} value={template.id}>
                            {template.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            
            {/* Performance overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
                        {selectedTemplate === "overall" ? (
                            <div className="text-3xl font-bold">
                                {Math.round(
                                    templatePerformanceData.reduce((acc, template) => acc + template.overallScore, 0) / 
                                    templatePerformanceData.length
                                )}%
                            </div>
                        ) : (
                            <div className="text-3xl font-bold">
                                {selectedData[0]?.overallScore}%
                            </div>
                        )}
                    </CardHeader>
                </Card>
                
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Questions Attempted</CardTitle>
                        {selectedTemplate === "overall" ? (
                            <div className="text-3xl font-bold">
                                {templatePerformanceData.reduce((acc, template) => acc + template.questionsAttempted, 0)}
                            </div>
                        ) : (
                            <div className="text-3xl font-bold">
                                {selectedData[0]?.questionsAttempted}
                            </div>
                        )}
                    </CardHeader>
                </Card>
                
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Weakest Topic</CardTitle>
                        <div className="text-xl font-bold truncate">
                            {weakestTopics[0]?.topic || "No data"}
                        </div>
                        {weakestTopics[0] && (
                            <CardDescription className="flex items-center">
                                Score: <span className={`ml-1 font-medium ${getScoreColorClass(weakestTopics[0].score)}`}>
                                    {weakestTopics[0].score}%
                                </span>
                            </CardDescription>
                        )}
                    </CardHeader>
                </Card>
            </div>
            
            {/* Areas for improvement */}
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Areas for Improvement</CardTitle>
                        <CardDescription>
                            Topics with the lowest scores across your templates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {weakestTopics.length > 0 ? (
                                weakestTopics.slice(0, 5).map((topic, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-base font-medium">{topic.topic}</p>
                                                {getTrendIcon(topic.trend)}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedTemplate === "overall" ? `${topic.templateName} • ` : ""}
                                                {topic.questionsAttempted} questions attempted
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 rounded-full bg-gray-200">
                                                    <div 
                                                        className={`h-2 rounded-full ${
                                                            topic.score < 60 ? "bg-red-500" : 
                                                            topic.score < 75 ? "bg-amber-500" : 
                                                            "bg-green-500"
                                                        }`}
                                                        style={{ width: `${topic.score}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-sm font-medium ${getScoreColorClass(topic.score)}`}>
                                                    {topic.score}%
                                                </span>
                                            </div>
                                            
                                            <Button variant="outline" size="sm" className="px-2 text-xs" asChild>
                                                <a href={`/dashboard/practice?template=${topic.templateName}&topic=${topic.topic}`}>
                                                    Practice <ChevronRightIcon className="w-3 h-3 ml-1" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <p>No performance data available yet.</p>
                                    <p className="text-sm text-muted-foreground">
                                        Complete some practice exercises to see your statistics.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Performance by template section - only show in overall view */}
            {selectedTemplate === "overall" && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Performance by Template</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {templatePerformanceData.map(template => (
                            <Card key={template.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle>{template.name}</CardTitle>
                                    <CardDescription>
                                        Overall Score: <span className={`font-medium ${getScoreColorClass(template.overallScore)}`}>
                                            {template.overallScore}%
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {template.topicPerformance
                                            .sort((a, b) => a.score - b.score)
                                            .slice(0, 3)
                                            .map((topic, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm">{topic.topic}</span>
                                                        {getTrendIcon(topic.trend)}
                                                    </div>
                                                    <span className={`text-sm font-medium ${getScoreColorClass(topic.score)}`}>
                                                        {topic.score}%
                                                    </span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="mt-4 text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-xs gap-1"
                                            onClick={() => setSelectedTemplate(template.id)}
                                        >
                                            View details <ChevronRightIcon className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Template-specific topic breakdown */}
            {selectedTemplate !== "overall" && selectedData.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Topic Breakdown</h2>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance by Topic</CardTitle>
                            <CardDescription>
                                Detailed breakdown of your performance in {selectedData[0]?.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {selectedData[0]?.topicPerformance.map((topic, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{topic.topic}</p>
                                                {getTrendIcon(topic.trend)}
                                            </div>
                                            <span className={`font-medium ${getScoreColorClass(topic.score)}`}>
                                                {topic.score}%
                                            </span>
                                        </div>
                                        
                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div
                                                className={`h-2 rounded-full ${
                                                    topic.score < 60 ? "bg-red-500" : 
                                                    topic.score < 75 ? "bg-amber-500" : 
                                                    "bg-green-500"
                                                }`}
                                                style={{ width: `${topic.score}%` }}
                                            ></div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                                            <div>{topic.questionsAttempted} questions attempted</div>
                                            <Button variant="outline" size="sm" className="px-2 text-xs" asChild>
                                                <a href={`/dashboard/practice?template=${selectedData[0]?.name}&topic=${topic.topic}`}>
                                                    Practice Topic <ChevronRightIcon className="w-3 h-3 ml-1" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}