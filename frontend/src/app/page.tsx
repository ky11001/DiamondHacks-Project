// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import Header from "./components/Header";
// import { FaSort } from "react-icons/fa";

// type Difficulty = "Easy" | "Medium" | "Hard";

// function isDifficulty(value: string): value is Difficulty {
//   return ["Easy", "Medium", "Hard"].includes(value);
// }

// export default function Home() {
//   // Static data for now
//   const [problems, setProblems] = useState([
//     { id: "1", title: "Two Sum", category: "DSA", difficulty: "Easy" },
//     { id: "2", title: "Reverse Integer", category: "Math", difficulty: "Medium" },
//     { id: "3", title: "Palindrome Number", category: "DSA", difficulty: "Easy" },
//   ]);

//   // State to track the completion status of problems
//   const [status, setStatus] = useState<{ [key: string]: boolean }>({});

//   // State to track sorting
//   const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

//   // Handle checkbox toggle
//   const handleStatusChange = (id: string) => {
//     setStatus((prevStatus) => ({
//       ...prevStatus,
//       [id]: !prevStatus[id],
//     }));
//   };

//   // Handle sorting
//   const handleSort = (key: string) => {
//     let direction: "asc" | "desc" = "asc";
//     if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });

//     const sortedProblems = [...problems].sort((a, b) => {
//       if (key === "status") {
//         const statusA = status[a.id] || false;
//         const statusB = status[b.id] || false;
//         return direction === "asc" ? Number(statusA) - Number(statusB) : Number(statusB) - Number(statusA);
//       }
//       if (a[key as keyof typeof a] < b[key as keyof typeof b]) {
//         return direction === "asc" ? -1 : 1;
//       }
//       if (a[key as keyof typeof a] > b[key as keyof typeof b]) {
//         return direction === "asc" ? 1 : -1;
//       }
//       return 0;
//     });
//     setProblems(sortedProblems);
//   };

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-gray-50 p-4 text-gray-950 flex flex-col items-center">
//         <h1 className="text-4xl font-bold mb-6">Problems</h1>
//         <div className="overflow-x-auto w-full max-w-5xl">
//           <table className="table-auto w-full">
//             <thead className="bg-gray-100 border-b-2 border-gray-400">
//               <tr>
//                 <th className="px-4 py-2 text-left w-28">
//                   <button
//                     onClick={() => handleSort("status")}
//                     className="flex items-center justify-between w-full"
//                   >
//                     <span>Status</span>
//                     <FaSort className="text-gray-600 opacity-50" />
//                   </button>
//                 </th>
//                 <th className="px-4 py-2 text-left">
//                   <button
//                     onClick={() => handleSort("id")}
//                     className="flex items-center justify-between w-full"
//                   >
//                     <span>Problem</span>
//                     <FaSort className="text-gray-600 opacity-50" />
//                   </button>
//                 </th>
//                 <th className="px-4 py-2 text-left">
//                   <button
//                     onClick={() => handleSort("category")}
//                     className="flex items-center justify-between w-full"
//                   >
//                     <span>Category</span>
//                     <FaSort className="text-gray-600 opacity-50" />
//                   </button>
//                 </th>
//                 <th className="px-4 py-2 text-left">
//                   <button
//                     onClick={() => handleSort("difficulty")}
//                     className="flex items-center justify-between w-full"
//                   >
//                     <span>Difficulty</span>
//                     <FaSort className="text-gray-600 opacity-50" />
//                   </button>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {problems.map((problem) => (
//                 <tr key={problem.id} className="hover:bg-gray-50 border-b border-gray-300">
//                   <td className="px-4 py-2 text-center">
//                     <input
//                       type="checkbox"
//                       checked={status[problem.id] || false}
//                       onChange={() => handleStatusChange(problem.id)}
//                       className="cursor-pointer w-4 h-4"
//                     />
//                   </td>
//                   <td className="px-4 py-2">
//                     <Link
//                       href={`/problem/${problem.id}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       {problem.id}. {problem.title}
//                     </Link>
//                   </td>
//                   <td className="px-4 py-2">{problem.category}</td>
//                   <td className="px-4 py-2">{problem.difficulty}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background Animation */}
      <div className="liquid-gradient-animation"></div>

      {/* Content */}
      <div className="max-w-3xl text-center animate-descend">
        {/* Logo */}
        <div className="flex justify-center mb-10 animate-bob">
          <Image
            src="/vibecheckLogo.png" 
            alt="Vibecheck Logo"
            className="w-auto max-w-[12rem]" 
            width={240} 
            height={120} 
            priority
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-6">
          Take Your Coding Skills to the Next Level
        </h1>
        <p className="text-md md:text-lg text-gray-600 mb-8 leading-relaxed">
          Whether you're a beginner or an experienced developer, our platform is designed to help you grow. 
          Solve engaging coding challenges, learn new concepts, and track your progress as you master the art of programming.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/problem"
            className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}