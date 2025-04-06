"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import CodeEditor from "@/app/components/CodeEditor";
import ProblemPanel from "@/app/components/ProblemPanel";
import TestCases from "@/app/components/TestCases";
import ChatBot from "@/app/components/ChatBot";
import { useParams } from "next/navigation";

type Difficulty = "easy" | "medium" | "hard";

interface ProblemData {
  id: string;
  title: string;
  statement: string;
  difficulty: Difficulty;
  ai_generated_code: string;
  language: string;
}

interface TestCase {
  id: number;
  result: boolean;
  message: string;
}

function isDifficulty(value: string): value is Difficulty {
  return ["easy", "medium", "hard"].includes(value.toLowerCase());
}

export default function ProblemPage() {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [problemData, setProblemData] = useState<ProblemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [testCaseError, setTestCaseError] = useState<string | undefined>(undefined);
  const [currentCode, setCurrentCode] = useState("");
  const params = useParams();

  const id = params?.id as string;

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const response = await fetch(`/get_problem/${id}`);
        if (!response.ok) throw new Error("Failed to fetch problem data");
        const data = await response.json();
        data.difficulty = data.difficulty.toLowerCase();
        if (!isDifficulty(data.difficulty)) throw new Error("Invalid difficulty level from API");
        setProblemData(data);
        setCurrentCode(data.ai_generated_code);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblemData();
  }, [id]);

  const handleSubmit = async (code: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/run/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution_code: code, language: problemData?.language }),
      });

      const data = await response.json();
      if (!data.results || data.error) {
        setTestCaseError(data.error || "No test results received");
        return;
      } else {
        setTestCaseError(undefined);
        setTestCases(
          data.results.map((result: any) => ({
            id: result.name,
            result: result.outcome === "passed",
            message: result.message,
          }))
        );
      }
    } catch (error) {
      console.error("Error submitting code:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 text-gray-950 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Render error state
  if (loadError || !problemData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 text-gray-950 flex items-center justify-center text-red-600">
        {loadError || "Problem not found"}
      </div>
    );
  }

  // Render the main content
  return (
    <>
    <Header />
    <div className="relative min-h-screen p-4 text-gray-950 overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 liquid-gradient-animation"></div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* Left Column: Problem Panel and Test Cases */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <ProblemPanel
              id={problemData.id}
              title={problemData.title}
              difficulty={problemData.difficulty}
              statement={problemData.statement}
              language={problemData.language}
              testCases={
                <TestCases
                  cases={testCases}
                  isSubmitting={isSubmitting}
                  error={testCaseError}
                />
              }
            />
          </div>
        </div>

        {/* Right Column: Code Editor */}
        <div className="lg:w-1/2 bg-white shadow-lg rounded-lg p-4">
          <CodeEditor
            onSubmit={handleSubmit}
            onCodeChange={(code) => setCurrentCode(code)}
            ai_generated_code={problemData.ai_generated_code}
            isSubmitting={isSubmitting}
            language={problemData.language}
          />
        </div>
      </div>

      {/* ChatBot */}
      <div className="mt-4">
        <ChatBot currentCode={currentCode} />
      </div>
    </div>
    </>
  );
}