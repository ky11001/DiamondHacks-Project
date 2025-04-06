"use client";

import React, { useState, useEffect } from "react";

import CodeEditor from "@/app/components/CodeEditor";
import ProblemPanel from "@/app/components/ProblemPanel";
import TestCases from "@/app/components/TestCases";
import { useParams, useRouter } from "next/navigation";

type Difficulty = "Easy" | "Medium" | "Hard";

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
  return ["Easy", "Medium", "Hard"].includes(value);
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
        if (!response.ok) throw new Error('Failed to fetch problem data');
        const data = await response.json();
        if (!isDifficulty(data.difficulty)) throw new Error('Invalid difficulty level from API');
        setProblemData(data);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'An error occurred');
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solution_code: code, language: problemData?.language })
      });

      const data = await response.json();
      if (!data.results || data.error) {
        setTestCaseError(data.error || 'No test results received');
      } else {
        setTestCaseError(undefined);
        setTestCases(data.results.map((result: any) => ({
          id: result.name,
          result: result.outcome === 'passed',
          message: result.message
        })));
      }

    } catch (error) {
      console.error('Error submitting code:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔽 Rendering Logic (MOVED OUT of handleSubmit)
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-4 text-gray-950 flex items-center justify-center">Loading...</div>;
  }

  if (loadError || !problemData) {
    return <div className="min-h-screen bg-gray-50 p-4 text-gray-950 flex items-center justify-center text-red-600">{loadError || 'Problem not found'}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 flex">
      <div className="flex flex-col lg:flex-row w-full">
        <div className="lg:w-1/2 lg:max-h-screen lg:overflow-auto">
          <ProblemPanel
            id={problemData.id}
            title={problemData.title}
            difficulty={problemData.difficulty}
            statement={problemData.statement}
            language={problemData.language}
            testCases={<TestCases cases={testCases} isSubmitting={isSubmitting} error={testCaseError} />}
          />
        </div>
        <div className="lg:w-1/2 h-screen">
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
