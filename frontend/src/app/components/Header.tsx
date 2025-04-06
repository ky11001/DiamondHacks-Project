import React from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image for the logo

export default function Header() {
  return (
    <header className="sticky top-0 bg-gray-100 border-b border-gray-300 py-3 z-50">
      <div className="flex justify-center">
        <Link href="/">
          <Image
            src="/vibecheckLogo.png" // Path to the logo in the public folder
            alt="Home Logo"
            className="w-auto h-8" // Adjust height to match the size of the text
            width={32} // Default width
            height={32} // Default height
            priority // Preload the logo for faster loading
          />
        </Link>
      </div>
    </header>
  );
}