import React from "react";
import ReactMarkdown from "react-markdown";

interface ProblemPanelProps {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  statement: string;
  language: string;
  testCases: React.ReactNode;
}

const ProblemPanel: React.FC<ProblemPanelProps> = ({ id, title, difficulty, statement, language, testCases }) => {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
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
            <ReactMarkdown>{statement}</ReactMarkdown>
          </div>
          {testCases}
        </div>
      </div>
    </div>
  );
};

export default ProblemPanel;