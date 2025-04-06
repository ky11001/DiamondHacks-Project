import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 bg-gray-100 border-b border-gray-300 py-3 z-50">
      <div className="flex justify-center">
        <Link
          href="/"
          className="text-gray-700 font-medium text-lg hover:text-gray-900 transition"
        >
          Home
        </Link>
      </div>
    </header>
  );
}