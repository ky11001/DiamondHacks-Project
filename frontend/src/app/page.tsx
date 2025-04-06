"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import { FaSort } from "react-icons/fa";

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