import React from "react";
import CodeEditor from './components/CodeEditor';
import ProblemPanel from './components/ProblemPanel';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-950">
      <div className="max-w-5xl mx-auto">
        <ProblemPanel
          title="1. Two Sum"
          difficulty="Easy"
          statement={`Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
          You may assume that each input would have exactly one solution, and you may not use the same element twice.

          Example 1:
          Input: nums = [2,7,11,15], target = 9
          Output: [0,1]
          Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
        />

        {/* Code Editor Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CodeEditor
            initialCode="def twoSum(self, nums: List[int], target: int) -> List[int]:
    # Write your code here"
            language="python3"
          />

          {/* Test Cases & Results */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Test Cases</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm font-medium text-gray-600 mb-2">Case 1:</div>
                <div className="text-sm font-mono">
                  Input: nums = [2,7,11,15], target = 9
                </div>
                <div className="text-sm font-mono text-green-600 mt-2">
                  Expected: [0,1]
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm font-medium text-gray-600 mb-2">Case 2:</div>
                <div className="text-sm font-mono">
                  Input: nums = [3,2,4], target = 6
                </div>
                <div className="text-sm font-mono text-green-600 mt-2">
                  Expected: [1,2]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
