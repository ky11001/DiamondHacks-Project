"use client";

import { Editor } from "@monaco-editor/react";
import { useState } from "react";

interface CodeEditorProps {
  onSubmit: (code: string) => void;
  onCodeChange?: (code: string) => void;
  ai_generated_code: string;
  isSubmitting: boolean;
  language: string;
}

export default function CodeEditor({
  onSubmit,
  onCodeChange,
  ai_generated_code,
  isSubmitting,
  language,
}: {
  onSubmit: (code: string) => void;
  onCodeChange?: (code: string) => void;
  ai_generated_code: string;
  isSubmitting: boolean;
  language: string;
}) {
  const [code, setCode] = useState(ai_generated_code);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      onCodeChange?.(value);
    }
  };

  const handleSubmit = () => {
    onSubmit(code);
  };

  return (
    <div className="bg-white h-screen flex flex-col rounded-lg shadow-md">
      {/* Header with Submit Button */}
      <div className="flex items-center justify-end p-4">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Code Editor with Border */}
      <div className="flex-1 overflow-hidden p-4 border border-gray-300 rounded-lg">
        <Editor
          height="100%"
          language={language.toLowerCase()}
          value={code}
          defaultValue={ai_generated_code}
          onChange={handleEditorChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "off",
            lineNumbers: "on",
            renderWhitespace: "selection",
            readOnly: false,
          }}
        />
      </div>
    </div>
  );
}