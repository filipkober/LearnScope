"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type Question = {
  id: string;
  type: "open" | "closed";
  question: string;
  options?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  topic?: string;
  difficulty?: string;
}

interface QuestionProps {
  question: Question;
  onNext?: () => void;
  showNavigationButtons?: boolean;
  onPrevious?: () => void;
  isLast?: boolean;
  isFirst?: boolean;
  isExamMode?: boolean;
  onAnswerSubmit?: (answerId: string, isCorrect: boolean) => void;
}

export function Question({
  question,
  onNext,
  showNavigationButtons = false,
  onPrevious,
  isLast = false,
  isFirst = false,
  isExamMode = false,
  onAnswerSubmit
}: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const handleSubmitAnswer = () => {
    setAnswerSubmitted(true);
    if (onAnswerSubmit) {
      const isCorrect = question.type === "closed" ? selectedAnswer === question.correctAnswer : true;
      onAnswerSubmit(question.type === "closed" ? selectedAnswer : textAnswer, isCorrect);
    }
  };

  const handleNextQuestion = () => {
    if (onNext) {
      onNext();
      // Reset the state if moving to the next question
      setSelectedAnswer("");
      setTextAnswer("");
      setAnswerSubmitted(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Question ({question.type === "open" ? "Open-ended" : "Multiple choice"})</CardTitle>
              {question.topic && question.difficulty && (
                <CardDescription>
                  Topic: {question.topic} • Difficulty: {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-lg font-medium">{question.question}</p>
          </div>
          
          {question.type === "closed" ? (
            <RadioGroup 
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              disabled={answerSubmitted && !isExamMode}
              className="space-y-3"
            >
              {question.options && question.options.map((option: { id: string; text: string; }) => (
                <div 
                  key={option.id}
                  className={`flex items-start space-x-3 p-3 rounded-md ${
                    answerSubmitted && !isExamMode && option.id === question.correctAnswer
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900"
                      : answerSubmitted && !isExamMode && option.id === selectedAnswer && option.id !== question.correctAnswer
                      ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900"
                      : ""
                  }`}
                >
                  <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} className="mt-1" />
                  <Label htmlFor={`${question.id}-${option.id}`} className="flex-grow text-base font-normal">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-3">
              <Textarea 
                placeholder="Type your answer here..." 
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={answerSubmitted && !isExamMode}
                className="min-h-[120px]"
              />
              {answerSubmitted && !isExamMode && (
                <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
                  <p className="font-medium">Sample answer:</p>
                  <p className="text-muted-foreground">{question.correctAnswer}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {showNavigationButtons ? (
            <>
              <Button variant="outline" onClick={onPrevious} disabled={isFirst}>
                Previous
              </Button>
              {!isLast ? (
                <Button onClick={handleNextQuestion}>
                  Next
                </Button>
              ) : (
                <Button variant="default">
                  Finish
                </Button>
              )}
            </>
          ) : (
            <>
              {!answerSubmitted ? (
                <Button onClick={handleSubmitAnswer} disabled={
                  (question.type === "closed" && !selectedAnswer) || 
                  (question.type === "open" && !textAnswer.trim())
                }>
                  Submit Answer
                </Button>
              ) : (
                isExamMode ? null : (
                  <Button variant="outline" onClick={onNext}>
                    New Question
                  </Button>
                )
              )}
            </>
          )}
        </CardFooter>
      </Card>
      
      {answerSubmitted && !isExamMode && (
        <Card>
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {question.type === "closed" ? 
                (selectedAnswer === question.correctAnswer ? 
                  "✅ Correct answer! " : 
                  "❌ Incorrect answer. ") :
                ""}
              {question.explanation}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}