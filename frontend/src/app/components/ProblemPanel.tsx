import React from "react";

interface ProblemPanelProps {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  statement: string;
}

const ProblemPanel: React.FC<ProblemPanelProps> = ({ title, difficulty, statement }) => {
  const difficultyColors = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/2 bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Problem Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${difficultyColors[difficulty]}`}
            >
              {difficulty}
            </span>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-600">{statement}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPanel;