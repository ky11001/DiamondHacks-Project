import CodeEditor from './components/CodeEditor';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Problem Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">1. Two Sum</h1>
            <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
              Easy
            </span>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-600">
              Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.
              You may assume that each input would have exactly one solution, and you may not use the same element twice.
            </p>
            <h3 className="text-lg font-medium mt-4 mb-2">Example 1:</h3>
            <pre className="bg-gray-50 p-4 rounded-md">
              <code>Input: nums = [2,7,11,15], target = 9
                Output: [0,1]
                Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</code>
            </pre>
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CodeEditor />

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
