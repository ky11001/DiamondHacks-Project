"use client";

interface TestCase {
  input: string;
  expected: string;
}

interface TestCasesProps {
  cases: TestCase[];
}

export default function TestCases({ cases }: TestCasesProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Test Cases</h3>
      <div className="space-y-4">
        {cases.map((testCase, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-md">
            <div className="text-sm font-medium text-gray-600 mb-2">
              Case {index + 1}:
            </div>
            <div className="text-sm font-mono">
              {testCase.input}
            </div>
            <div className="text-sm font-mono text-green-600 mt-2">
              Expected: {testCase.expected}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
