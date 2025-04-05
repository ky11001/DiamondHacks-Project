"use client";

import React, { useState } from "react";
import CodeEditor from './components/CodeEditor';
import ProblemPanel from "./components/ProblemPanel";
import TestCases from "./components/TestCases";

export default function Home() {
  const [testCases, setTestCases] = useState<Array<{ id: number; result: boolean }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static variables for now
  const title = "1. Two Sum";
  const difficulty = "Easy";
  const statement = `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
  You may assume that each input would have exactly one solution, and you may not use the same element twice.

  Example 1:
  Input: nums = [2,7,11,15], target = 9
  Output: [0,1]
  Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`;

  const handleSubmit = async (code: string) => {
    setIsSubmitting(true);
    try {
      // This would be replaced with an actual API call
      // const response = await fetch('/api/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code })
      // });
      // const data = await response.json();

      // Simulated API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResults = [
        { id: 1, result: true },
        { id: 2, result: false },
        { id: 3, result: true }
      ];

      setTestCases(mockResults);
    } catch (error) {
      console.error('Error submitting code:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-950">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: ProblemPanel and TestCases */}
        <div className="flex flex-col gap-4">
          <ProblemPanel
            title={title}
            difficulty={difficulty}
            statement={statement}
          />
          <TestCases cases={testCases} />
        </div>

        {/* Right Column: CodeEditor */}
        <div>
          <CodeEditor onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
