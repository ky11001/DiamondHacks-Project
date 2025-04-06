import React from "react";

interface ProblemPanelProps {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  statement: string;
  language: string;
  testCases: React.ReactNode;
}

const ProblemPanel: React.FC<ProblemPanelProps> = ({ id, title, difficulty, statement, language, testCases }) => {
  const difficultyColors = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  };

  return (
    <div className="w-full bg-white h-full">
      <div className="p-6">
        {/* Problem Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">{id}. {title}</h1>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${difficultyColors[difficulty]}`}
            >
              {difficulty}
            </span>
          </div>
          <div className="prose max-w-none">
            <i className="text-gray-600">Programming Language: {language}</i>
          </div>
          <div className="prose max-w-none mb-8">
            <p className="text-gray-600">{statement}</p>
          </div>
          {testCases}
        </div>
      </div>
    </div>
  );
};

export default ProblemPanel;