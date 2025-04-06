"use client";

interface TestCase {
  id: number;
  result: boolean;
  message?: string;
}

interface TestCasesProps {
  cases: TestCase[];
  isSubmitting: boolean;
  error?: string;
}

export default function TestCases({ cases, isSubmitting, error }: TestCasesProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Test Cases</h3>
      {isSubmitting && (
        <div className="text-gray-600">
          Running...
        </div>
      )}
      {!isSubmitting && (
        <div className={"space-y-4" + (cases.length > 0 ? "" : "hidden")}>
          {!error && (
            cases.map((testCase, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm font-mono text-black mt-2">
                  <span className={`text-sm font-mono ${testCase.result ? "text-green-600" : "text-red-600"}`} >
                    Case {index + 1}: {testCase.result ? "Passed" : "Failed"}
                  </span>
                </div>
                {testCase.message && (
                  <div className="text-sm font-mono text-black mt-2">
                    <span className={`text-sm font-mono ${testCase.result ? "text-green-600" : "text-red-600"}`} >
                      {testCase.message}
                    </span>
                  </div>
                )}
              </div>
            )))}
          {cases.length === 0 && !error && (
            <div className="text-gray-600">
              Code has not been run yet.
            </div>
          )}
          {error && (
            <div className="text-red-600">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
