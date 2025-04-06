import React from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image for the logo

export default function Header() {
  return (
    <header className="sticky top-0 border-b border-gray-300 py-3 z-50">
      <div className="flex justify-center">
        <Link href="/" className="text-purple-800">
          vibecheck
        </Link>
      </div>
    </header>
  );
}