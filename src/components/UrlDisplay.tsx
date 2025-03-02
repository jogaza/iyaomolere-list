"use client";

import { usePathname } from "next/navigation";
interface ListProps {
  userId: string;
}
export default function UrlDisplay({ userId }: ListProps) {
  const pathname = usePathname();

  return (
    <div className="text-center text-sm text-gray-500 mt-2 mb-4">
      Share this list using: {window.location.origin}
      {pathname}
      {userId}
    </div>
  );
}
