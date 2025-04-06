"use client";
import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Image from "next/image"; // Import Image for the logo
import { FaSort } from "react-icons/fa";

export default function Home() {
  const [problems, setProblems] = useState([
    { id: "1", title: "Two Sum", category: "DSA", difficulty: "Easy" },
    { id: "2", title: "Reverse Integer", category: "Math", difficulty: "Medium" },
    { id: "3", title: "Palindrome Number", category: "DSA", difficulty: "Easy" },
  ]);

  const [status, setStatus] = useState<{ [key: string]: boolean }>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const handleStatusChange = (id: string) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [id]: !prevStatus[id],
    }));
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedProblems = [...problems].sort((a, b) => {
      if (key === "status") {
        const statusA = status[a.id] || false;
        const statusB = status[b.id] || false;
        return direction === "asc" ? Number(statusA) - Number(statusB) : Number(statusB) - Number(statusA);
      }
      if (a[key as keyof typeof a] < b[key as keyof typeof b]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key as keyof typeof a] > b[key as keyof typeof b]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setProblems(sortedProblems);
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen p-4 text-gray-950 flex flex-col items-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 -z-10 liquid-gradient-animation"></div>

        {/* Content */}
        <div className="flex justify-center mb-10 animate-bob">
          <Image
            src="/problemsLogo.png" // Path to the problems logo in the public folder
            alt="Problems Logo"
            className="w-auto max-w-[20rem]" // Ensure the logo doesn't get too large
            width={480} // Default width
            height={340} // Default height
            priority // Preload the logo for faster loading
          />
        </div>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl overflow-hidden">
          <table className="table-auto w-full rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left w-28">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <span>Status</span>
                    <FaSort className="text-gray-600 opacity-50" />
                  </button>
                </th>
                <th className="px-4 py-2 text-left">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <span>Problem</span>
                    <FaSort className="text-gray-600 opacity-50" />
                  </button>
                </th>
                <th className="px-4 py-2 text-left">
                  <button
                    onClick={() => handleSort("category")}
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <span>Category</span>
                    <FaSort className="text-gray-600 opacity-50" />
                  </button>
                </th>
                <th className="px-4 py-2 text-left">
                  <button
                    onClick={() => handleSort("difficulty")}
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <span>Difficulty</span>
                    <FaSort className="text-gray-600 opacity-50" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr
                  key={problem.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                  } hover:bg-gray-150 border-b border-gray-300`}
                >
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={status[problem.id] || false}
                      onChange={() => handleStatusChange(problem.id)}
                      className="cursor-pointer w-4 h-4 accent-purple-600"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/problem/${problem.id}`}
                      className="text-purple-700 hover:underline"
                    >
                      {problem.id}. {problem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{problem.category}</td>
                  <td className="px-4 py-2">{problem.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}