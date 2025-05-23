"use client";

import { useState, useEffect } from "react";
import { FiCopy, FiCheck, FiShare2 } from "react-icons/fi";
import { FaTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface ListProps {
  userId: string;
}

export default function UrlDisplay({ userId }: ListProps) {
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    // Set the URL only on the client side
    const baseUrl = process.env.APP_LIST_URL || window.location.origin;
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
      <div className="flex justify-center gap-2 mt-2">
        <button
          onClick={copyToClipboard}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors",
            "bg-info/20 hover:bg-info/30 text-info"
          )}
          aria-label="Copy to clipboard"
        >
          {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors",
              "bg-success/20 hover:bg-success/30 text-success"
            )}
            aria-label="Share options"
          >
            <FiShare2 className="w-4 h-4" />
            <span>Share Link</span>
          </button>

          {showShareOptions && (
            <div className="absolute mt-2 p-2 bg-card shadow-lg rounded-md z-10 flex gap-2 border border-border">
              <button
                onClick={() => handleShare("twitter")}
                className="p-2 text-info hover:bg-secondary rounded-full"
                aria-label="Share on Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="p-2 text-primary hover:bg-secondary rounded-full"
                aria-label="Share on Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="p-2 text-success hover:bg-secondary rounded-full"
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
