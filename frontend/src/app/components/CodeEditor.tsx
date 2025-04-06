"use client";

import { Editor } from '@monaco-editor/react';
import { useState } from 'react';

interface CodeEditorProps {
  onSubmit: (code: string) => void;
  ai_generated_code: string;
  isSubmitting: boolean;
}

export default function CodeEditor({ onSubmit, ai_generated_code, isSubmitting }: CodeEditorProps) {
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value.toLowerCase());
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleSubmit = () => {
    onSubmit(code);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <select
          className="px-3 py-2 border rounded-md text-sm"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="python">Python3</option>
          <option value="java">Java</option>
        </select>
        <div className="space-x-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="h-[500px] border rounded-md overflow-hidden">
        <Editor
          height="100%"
          language={selectedLanguage}
          value={code}
          defaultValue={ai_generated_code}
          onChange={handleEditorChange}
          theme="vs-light"

          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            readOnly: false
          }}
        />
      </div>
    </div>
  );
}
