"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import CodeEditor from "@/app/components/CodeEditor";
import ProblemPanel from "@/app/components/ProblemPanel";
import TestCases from "@/app/components/TestCases";
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
export default function Home() {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [problemData, setProblemData] = useState<ProblemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [testCaseError, setTestCaseError] = useState<string | undefined>(undefined);
  const params = useParams();

  const id = params?.id as string;

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const response = await fetch(`/get_problem/${id}`);
        if (!response.ok) throw new Error("Failed to fetch problem data");
        const data = await response.json();
        data.difficulty = data.difficulty.toLowerCase();
        if (!isDifficulty(data.difficulty)) throw new Error('Invalid difficulty level from API');
        setProblemData(data);
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
    <div className="min-h-screen bg-gray-50 p-4 text-gray-950">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: ProblemPanel and TestCases */}
        <div className="flex flex-col gap-4">
          <ProblemPanel
            id={problemData.id}
            title={problemData.title}
            difficulty={problemData.difficulty}
            statement={problemData.statement}
            language={problemData.language}
          />
          <TestCases cases={testCases} isSubmitting={isSubmitting} error={testCaseError} />
        </div>

        {/* Right Column: CodeEditor */}
        <div>
          <CodeEditor
            onSubmit={handleSubmit}
            ai_generated_code={problemData.ai_generated_code}
            isSubmitting={isSubmitting}
            language={problemData.language}
          />
        </div>
      </div>
    </div>
  );
}