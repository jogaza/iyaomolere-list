"use client";

import { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg overflow-hidden mb-4 bg-white shadow-sm">
      <button
        type="button"
        className="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-50 focus:outline-none transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-1xl font-semibold text-gray-800">{title}</h3>
        <span className="ml-6 flex-shrink-0">
          <svg
            className={`w-6 h-6 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`p-4 pt-0 border-t ${isOpen ? "block" : "hidden"}`}>{children}</div>
      </div>
    </div>
  );
}
