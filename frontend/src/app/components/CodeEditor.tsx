interface CodeEditorProps {
  initialCode: string;
  language: string;
}

export default function CodeEditor({ initialCode, language }: CodeEditorProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <select className="px-3 py-2 border rounded-md text-sm">
          <option>Python3</option>
          <option>JavaScript</option>
          <option>Java</option>
        </select>
        <div className="space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
            Submit
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700">
            Run
          </button>
        </div>
      </div>
      <div className="font-mono text-sm bg-gray-50 p-4 rounded-md h-96 overflow-y-auto">
        <pre className="text-gray-800">{initialCode}</pre>
      </div>
    </div>
  );
}
