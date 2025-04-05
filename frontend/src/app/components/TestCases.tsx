"use client";

interface TestCase {
  id: number,
  result: boolean
}

interface TestCasesProps {
  cases: TestCase[];
}

export default function TestCases({ cases }: TestCasesProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Test Cases</h3>
      <div className={"space-y-4" + (cases.length > 0 ? "" : "hidden")}>
        {cases.map((testCase, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-md">
            <div className="text-sm font-mono text-black mt-2">
              <span className={`text-sm font-mono ${testCase.result ? "text-green-600" : "text-red-600"}`} >
                Case {index + 1}: {testCase.result ? "Passed" : "Failed"}
              </span>
            </div>
          </div>
        ))}
        {cases.length === 0 && (
          <div className="text-gray-600">
            Code has not been run yet.
          </div>
        )}
      </div>
    </div>
  );
}
