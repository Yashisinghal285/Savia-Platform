import React from 'react';

/**
 * Savia Brand Logo Component
 * Supports custom image files (PNG, SVG, JPG, WebP) or built-in vector mark.
 */
export default function BrandLogo({ 
  size = "md", 
  src = null, 
  className = "", 
  showText = false, 
  subtitle = "Pediatric Care" 
}) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* If custom image src provided or custom image exists */}
      {src ? (
        <div className={`${containerSize} rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-md shadow-blue-500/10`}>
          <img 
            src={src} 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        /* Default Icon Emblem */
        <div className={`${containerSize} rounded-2xl bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] p-2 flex items-center justify-center shadow-md shadow-blue-500/20 dark:shadow-none ring-1 ring-white/20 transition-transform duration-200 hover:scale-105 shrink-0`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="saviaGrad1" x1="8" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#E0F2FE" />
            </linearGradient>
            <linearGradient id="heartGrad" x1="24" y1="20" x2="40" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F43F5E" />
              <stop offset="1" stopColor="#FB7185" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Smooth Continuous 'S' Caring Waves */}
          <path
            d="M44 18 C44 11 36 8 28 8 C18 8 12 14 12 22 C12 32 26 31 38 35 C48 38 52 45 52 52 C52 61 42 64 32 64 C20 64 12 56 12 48"
            stroke="url(#saviaGrad1)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#softGlow)"
          />

          {/* Pediatric Care Sparkle / Heart Core */}
          <path
            d="M32 18 C32 18 35 13 39 13 C43 13 46 16 46 20 C46 25 39 30 32 35 C25 30 18 25 18 20 C18 16 21 13 25 13 C29 13 32 18 32 18 Z"
            fill="url(#heartGrad)"
            opacity="0.95"
            transform="scale(0.55) translate(26, 18)"
          />

          {/* Cheerful Energy Dot */}
          <circle cx="48" cy="16" r="3.5" fill="#FDE047" />
        </svg>
      </div>
      )}

      {/* Brand Typography */}
      {showText && (
        <div>
          <h1 className="font-black text-xl text-slate-900 dark:text-white tracking-tight leading-none flex items-center space-x-1">
            <span>Savia</span>
          </h1>
          {subtitle && (
            <p className="text-[10px] font-extrabold text-[#2563EB] dark:text-blue-400 uppercase tracking-wider mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
