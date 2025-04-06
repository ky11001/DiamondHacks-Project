import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 bg-gray-50 border-b border-gray-300 py-3 z-50">
      <div className="flex justify-center">
        <Link href="/" className="text-purple-800">
          vibecheck
        </Link>
      </div>
    </header>
  );
}