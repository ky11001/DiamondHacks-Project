import React from "react";
import CodeEditor from './components/CodeEditor';
import ProblemPanel from "./components/ProblemPanel";
import TestCases from "./components/TestCases";

export default function Home() {
  // async function fetchProblemData() {
  //   const response = await fetch('/api/problem'); // Replace with your backend API endpoint
  //   const data = await response.json();
  //   return {
  //     title: data.title,
  //     difficulty: data.difficulty,
  //     statement: data.statement,
  //   };
  // }

  // Static variables for now
  const title = "1. Two Sum";
  const difficulty = "Easy";
  const statement = `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
  You may assume that each input would have exactly one solution, and you may not use the same element twice.

  Example 1:
  Input: nums = [2,7,11,15], target = 9
  Output: [0,1]
  Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`;

  const testCases = [
    {
      input: "Input: nums = [2,7,11,15], target = 9",
      expected: "[0,1]"
    },
    {
      input: "Input: nums = [3,2,4], target = 6",
      expected: "[1,2]"
    }
  ];

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
          <CodeEditor />

        </div>
      </div>
    </div>
  );
}
