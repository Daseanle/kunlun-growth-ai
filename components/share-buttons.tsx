"use client";

import { useState, useEffect } from "react";

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
      document.body.removeChild(textarea);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url, text: title });
    } catch {
      // user cancelled or share failed
    }
  }

  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  return (
    <div className="share-buttons">
      {canShare && (
        <button type="button" onClick={nativeShare} className="share-btn share-native" aria-label="分享">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" />
          </svg>
          分享
        </button>
      )}
      <button type="button" onClick={copyLink} className="share-btn" aria-label="复制链接">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {copied ? "已复制" : "复制链接"}
      </button>
      <a
        href={`https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
        target="_blank"
        rel="noreferrer"
        className="share-btn"
        aria-label="分享到 X"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.03l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X
      </a>
      <a
        href={`https://service.weibo.com/share/share.php?title=${shareText}&url=${shareUrl}`}
        target="_blank"
        rel="noreferrer"
        className="share-btn"
        aria-label="分享到微博"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.02 6.74-5.411 3.979-.394 7.413 1.4 7.671 4.018.259 2.6-2.759 5.02-6.739 5.413zM9.05 17.219c-.387.492-1.144.715-1.682.498-.531-.213-.687-.81-.291-1.342.391-.531 1.125-.768 1.665-.498.546.27.622.849.308 1.342zm1.93-1.24c-.154.234-.491.355-.747.273-.253-.08-.331-.331-.18-.556.15-.232.474-.353.73-.273.253.08.332.331.197.557zm.263-2.115c-1.083-.287-2.326.165-2.804 1.034-.486.875-.083 1.844 1.004 2.139 1.101.291 2.403-.165 2.875-1.061.474-.901.063-1.829-1.075-2.112zM20.8 8.405c-1.836-.526-3.402-.27-4.422.207l.395.803c1.012-.427 2.395-.547 3.715-.21 1.32.339 2.145.972 2.145 1.582 0 .609-.683 1.243-1.995 1.582-1.312.339-2.692.219-3.705-.207l-.395.803c1.02.477 2.586.733 4.422.207 1.836-.526 3.061-1.585 3.061-2.592 0-1.006-1.225-2.064-3.061-2.592zm-.836-4.248c-.861-.243-1.662-.144-2.207.111l.387.79c.395-.183 1.083-.207 1.762-.016 1.008.285 1.585.96 1.288 1.504-.297.543-1.362.666-2.378.379-.504-.141-.93-.395-1.227-.66l-.388-.79c-.546.255-1.346.354-2.207.111-1.083-.311-1.825-1.059-1.659-1.671.166-.613 1.171-.878 2.254-.566.861.243 1.504.768 1.762 1.254l.387-.79c.546-.255 1.346-.354 2.207-.111 1.083.311 1.825 1.059 1.659 1.671-.166.613-1.171.878-2.254.566-.504-.143-.93-.395-1.227-.66l-.388-.79c-.546.255-1.346.354-2.207.111z" />
        </svg>
        微博
      </a>
    </div>
  );
}
