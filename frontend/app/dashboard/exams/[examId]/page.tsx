"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Question as QuestionComponent, Question } from "@/components/Question";
import { Progress } from "@/components/ui/progress";

interface Exam {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  questions: Question[];
}

// Mock function to simulate fetching an exam from an API
const fetchExam = async (examId: string): Promise<Exam> => {
  // In a real app, this would be an API call
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Sample data
  return {
    id: examId,
    title: "Computer Science Fundamentals",
    description: "Test your knowledge of basic computer science concepts",
    estimatedTime: "45 minutes",
    questions: [
      {
        id: "q1",
        type: "closed",
        question: "Which data structure follows the First In First Out (FIFO) principle?",
        options: [
          { id: "a", text: "Stack" },
          { id: "b", text: "Queue" },
          { id: "c", text: "Tree" },
          { id: "d", text: "Graph" }
        ],
        correctAnswer: "b",
        explanation: "A Queue follows the First In First Out (FIFO) principle, where the first element added is the first one to be removed.",
        topic: "Data Structures",
        difficulty: "easy"
      },
      {
        id: "q2",
        type: "open",
        question: "Explain how an array differs from a linked list in terms of memory allocation and access patterns.",
        correctAnswer: "Arrays allocate memory in contiguous blocks, allowing for constant-time random access but making insertion/deletion expensive. Linked lists allocate memory dynamically with pointers, making insertion/deletion efficient but random access slower.",
        explanation: "Arrays store elements in contiguous memory locations, which makes them efficient for random access (O(1)) but inefficient for insertions/deletions in the middle (O(n)). Linked lists store elements in nodes that point to the next node, making insertions/deletions efficient (O(1) if you have a pointer to the position) but random access inefficient (O(n)).",
        topic: "Data Structures",
        difficulty: "medium"
      },
      {
        id: "q3",
        type: "closed",
        question: "What is the time complexity of a binary search algorithm?",
        options: [
          { id: "a", text: "O(n)" },
          { id: "b", text: "O(n²)" },
          { id: "c", text: "O(log n)" },
          { id: "d", text: "O(n log n)" }
        ],
        correctAnswer: "c",
        explanation: "Binary search has a time complexity of O(log n) because it divides the search interval in half at each step.",
        topic: "Algorithms",
        difficulty: "medium"
      },
      {
        id: "q4",
        type: "closed",
        question: "Which of the following is NOT a principle of object-oriented programming?",
        options: [
          { id: "a", text: "Encapsulation" },
          { id: "b", text: "Inheritance" },
          { id: "c", text: "Normalization" },
          { id: "d", text: "Polymorphism" }
        ],
        correctAnswer: "c",
        explanation: "Normalization is a concept in database design, not an object-oriented programming principle. The core principles of OOP are encapsulation, inheritance, polymorphism, and abstraction.",
        topic: "Object-Oriented Programming",
        difficulty: "medium"
      },
      {
        id: "q5",
        type: "open",
        question: "Describe the concept of recursion and provide a simple example of a recursive algorithm.",
        correctAnswer: "Recursion is a programming technique where a function calls itself to solve a problem. A common example is calculating factorial: factorial(n) = n * factorial(n-1) with base case factorial(0) = 1.",
        explanation: "Recursion is when a function calls itself as part of its execution. It requires at least one base case to prevent infinite recursion. Examples include factorial calculation, tree traversal, and the Fibonacci sequence. The factorial function is a simple example: factorial(n) = n * factorial(n-1) with factorial(0) = 1 as the base case.",
        topic: "Algorithms",
        difficulty: "hard"
      }
    ]
  };
};

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes in seconds

  useEffect(() => {
    const loadExam = async () => {
      try {
        const examData = await fetchExam(examId as string);
        setExam(examData);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId]);

  useEffect(() => {
    // Timer countdown
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      // Auto-submit when time runs out
      handleFinishExam();
    }
  }, [timeLeft, showResults]);

  const handleNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerSubmit = (answerId: string, isCorrect: boolean) => {
    if (exam) {
      setAnswers({
        ...answers,
        [exam.questions[currentQuestionIndex].id]: answerId
      });
    }
  };

  const handleFinishExam = () => {
    if (exam) {
      // Calculate score
      let correctAnswers = 0;
      exam.questions.forEach(question => {
        if (question.type === "closed") {
          const userAnswer = answers[question.id];
          if (userAnswer === question.correctAnswer) {
            correctAnswers++;
          }
        } else {
          // For open questions, we can't automatically grade them
          // In a real app, they might be manually graded or use NLP to evaluate
        }
      });
      
      // Calculate percentage score for closed questions only
      const closedQuestions = exam.questions.filter(q => q.type === "closed");
      setScore(closedQuestions.length > 0 ? (correctAnswers / closedQuestions.length) * 100 : 0);
      setShowResults(true);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-4 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-[400px]" />
          <div className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">Error</h1>
        <p>Failed to load exam. It may not exist or you may not have access to it.</p>
        <Button className="mt-4" onClick={() => router.push('/dashboard/exams')}>
          Back to Exams
        </Button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exam.title} - Results</h1>
          <p className="text-muted-foreground">Exam completed</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exam Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Multiple Choice Score:</span>
                <span className="font-medium">{score.toFixed(0)}%</span>
              </div>
              <Progress value={score} />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Answers Summary</h3>
              <div className="space-y-2">
                {exam.questions.map((question, index) => (
                  <div key={question.id} className="p-3 bg-muted rounded-md">
                    <p className="font-medium">Q{index + 1}: {question.question.substring(0, 60)}...</p>
                    {question.type === "closed" ? (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm">Your answer: {
                          answers[question.id] ? 
                          question.options?.find(o => o.id === answers[question.id])?.text.substring(0, 30) + "..." : 
                          "Not answered"
                        }</span>
                        <span className={`text-sm ${answers[question.id] === question.correctAnswer ? "text-green-600" : "text-red-600"}`}>
                          {answers[question.id] === question.correctAnswer ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm">Open-ended question (manual grading)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard/exams')}>
              Back to Exams
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exam.title}</h1>
          <p className="text-muted-foreground">
            {exam.description}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
          <p className="text-muted-foreground">Remaining time</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Question {currentQuestionIndex + 1} of {exam.questions.length}</span>
          <span>{progress.toFixed(0)}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      <QuestionComponent
        question={currentQuestion}
        onNext={handleNextQuestion}
        onPrevious={handlePreviousQuestion}
        showNavigationButtons={true}
        isLast={currentQuestionIndex === exam.questions.length - 1}
        isFirst={currentQuestionIndex === 0}
        isExamMode={true}
        onAnswerSubmit={handleAnswerSubmit}
      />

      <div className="flex justify-end">
        <Button 
          variant="destructive" 
          onClick={handleFinishExam}
          className="ml-auto"
        >
          Finish Exam
        </Button>
      </div>
    </div>
  );
}