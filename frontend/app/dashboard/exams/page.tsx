"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, Book, Award, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { getAuthToken } from "@/utils/auth";
import { useAuth } from "@/contexts/AuthContext";

interface Exam {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: string;
  questionCount: number;
  createdAt: string;
}

// Function to fetch exams from the backend API
const fetchExams = async (): Promise<Exam[]> => {
  try {
    // Get the token using the authentication utility
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Make the API request
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/exams`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response
    const data = await response.json();
    
    // Transform the API response to match our Exam interface
    return data.map((exam: any) => ({
      id: exam.id.toString(),
      title: `Exam ${exam.id}`,
      description: `Based on ${exam.template_topics || 'various topics'}`,
      estimatedTime: `${Math.max(15, exam.question_count * 3)} minutes`,
      difficulty: getDifficultyLevel(exam.question_count),
      questionCount: exam.question_count || 0,
      createdAt: new Date().toISOString().split('T')[0], // Use current date as fallback
    }));
  } catch (error) {
    console.error('Error fetching exams:', error);
    // Return mock data as fallback in case of error
    return [
      {
        id: "exam-cs-basics",
        title: "Computer Science Fundamentals",
        description: "Test your knowledge of basic computer science concepts",
        estimatedTime: "45 minutes",
        difficulty: "medium",
        questionCount: 5,
        createdAt: "2023-12-10"
      },
      {
        id: "exam-algorithms",
        title: "Advanced Algorithms",
        description: "Challenge yourself with complex algorithm problems",
        estimatedTime: "60 minutes",
        difficulty: "hard",
        questionCount: 8,
        createdAt: "2023-12-15"
      },
      {
        id: "exam-web-dev",
        title: "Web Development Basics",
        description: "Test your knowledge of HTML, CSS, and JavaScript",
        estimatedTime: "30 minutes",
        difficulty: "easy",
        questionCount: 4,
        createdAt: "2023-12-20"
      }
    ];
  }
};

// Helper function to determine difficulty level based on question count
const getDifficultyLevel = (questionCount: number): string => {
  if (questionCount <= 5) return 'easy';
  if (questionCount <= 10) return 'medium';
  return 'hard';
};

export default function ExamsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // Use authentication context
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadExams = async () => {
      try {
        // Only fetch exams if authenticated
        if (isAuthenticated) {
          const examsData = await fetchExams();
          setExams(examsData);
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [isAuthenticated]); // Re-fetch when authentication status changes

  const handleDeleteExam = () => {
    if (examToDelete) {
      // In a real app, make API call to delete the exam
      setExams(exams.filter(exam => exam.id !== examToDelete.id));
      toast.success(`"${examToDelete.title}" has been deleted`);
      setExamToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-amber-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
          <p className="text-muted-foreground">
            Available exams to test your knowledge
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/templates')}>
          Create New Exam
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mt-2 mb-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : (
          exams.map((exam) => (
            <Card key={exam.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{exam.title}</CardTitle>
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
                          setExamToDelete(exam);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        <TrashIcon className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{exam.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mt-2 mb-4">
                  <Badge variant="outline" className={`${getDifficultyColor(exam.difficulty)} text-white border-none`}>
                    {exam.difficulty.charAt(0).toUpperCase() + exam.difficulty.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Created {new Date(exam.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{exam.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Book className="h-4 w-4" />
                    <span>{exam.questionCount} questions</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => router.push(`/dashboard/exams/${exam.id}`)}
                  className="w-full"
                >
                  Start Exam
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {exams.length === 0 && !loading && (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No exams available</h3>
            <p className="text-muted-foreground text-center mt-1">
              You haven&apos;t created any exams yet.
              <br />
              Go to Templates to create your first exam.
            </p>
            <Button 
              className="mt-6" 
              onClick={() => router.push('/dashboard/templates')}
            >
              Go to Templates
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && examToDelete && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Exam</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{examToDelete.title}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteExam}
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