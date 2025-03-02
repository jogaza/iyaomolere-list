"use client";

import { useState, useEffect } from "react";
import { FiCopy, FiCheck, FiShare2 } from "react-icons/fi";
import { FaTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa";

interface ListProps {
  userId: string;
}

export default function UrlDisplay({ userId }: ListProps) {
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    // Set the URL only on the client side
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    setFullUrl(`${baseUrl}/${userId}`);
  }, [userId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent("Check out my list!")}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`Check out my list: ${fullUrl}`)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setShowShareOptions(false);
  };

  return (
    <div className="text-center mt-6 mb-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-sm text-gray-500">Share this list: </span>
        <span className="text-sm font-medium text-gray-700">{fullUrl}</span>
      </div>

      <div className="flex justify-center gap-2 mt-2">
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
            aria-label="Share options"
          >
            <FiShare2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          {showShareOptions && (
            <div className="absolute mt-2 p-2 bg-white shadow-lg rounded-md z-10 flex gap-2">
              <button
                onClick={() => handleShare("twitter")}
                className="p-2 text-blue-400 hover:bg-gray-100 rounded-full"
                aria-label="Share on Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="p-2 text-blue-600 hover:bg-gray-100 rounded-full"
                aria-label="Share on Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="p-2 text-green-500 hover:bg-gray-100 rounded-full"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
