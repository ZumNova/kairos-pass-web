/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface KairosLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  light?: boolean;
}

export function KairosLogoSymbol({ sizeClass = "w-16 h-16" }: { sizeClass?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClass} drop-shadow-[0_2px_10px_rgba(180,136,58,0.15)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main outer gold hourglass shape */}
      <path
        d="M20 10H80L50 50L20 10Z"
        fill="url(#kairosGoldGradient)"
      />
      <path
        d="M20 90H80L50 50L20 90Z"
        fill="url(#kairosGoldGradient)"
      />

      {/* Black sand/cutout layers recreating the official brand image with absolute precision */}
      {/* Top half inner black inverted triangle */}
      <path
        d="M32 15H68L50 35L32 15Z"
        fill="#000000"
      />

      {/* Bottom half inner black arrow-up shape with column cutout to the database line */}
      {/* A sharp black triangle pointing up, connected to a vertical line dividing the bottom */}
      <path
        d="M32 85H68L50 63L32 85Z"
        fill="#000000"
      />
      {/* Vertical solid center line cutout from waist pointing straight down */}
      <rect
        x="47"
        y="60"
        width="6"
        height="30"
        fill="#000000"
      />

      {/* Luxury Metallic Gold Gradients */}
      <defs>
        <linearGradient
          id="kairosGoldGradient"
          x1="20"
          y1="10"
          x2="80"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#8F6A1D" /> {/* Dark Gold */}
          <stop offset="35%" stopColor="#D8B56A" /> {/* Champagne Gold */}
          <stop offset="70%" stopColor="#B4882A" /> {/* Primary Gold */}
          <stop offset="100%" stopColor="#8F6A1D" /> {/* Dark Gold */}
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function KairosLogo({
  className = "",
  size = "md",
  showTagline = true,
  light = false,
}: KairosLogoProps) {
  const sizes = {
    sm: { symbol: "w-8 h-8", title: "text-lg tracking-[0.25em]", tag: "text-[7px]" },
    md: { symbol: "w-14 h-14", title: "text-2xl tracking-[0.3em]", tag: "text-[9px] mt-0.5" },
    lg: { symbol: "w-20 h-20", title: "text-3xl tracking-[0.35em]", tag: "text-[11px] mt-1" },
    xl: { symbol: "w-32 h-32", title: "text-5xl tracking-[0.4em]", tag: "text-[14px] mt-2.5" },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Logo Emblem */}
      <KairosLogoSymbol sizeClass={currentSize.symbol} />

      {/* Logo Typography - Beautiful KΛIROS spelling with customized A lacking crossbar */}
      <div className="mt-2.5 flex flex-col items-center">
        <h1
          className={`font-display font-medium ${
            light ? "text-stone-900" : "text-white"
          } ${currentSize.title} select-none`}
        >
          K<span className="text-kairos-gold">Λ</span>IROS
        </h1>

        {/* Brand Tagline */}
        {showTagline && (
          <p
            className={`font-sans uppercase font-medium tracking-[0.35em] ${
              light ? "text-stone-500" : "text-kairos-gold"
            } ${currentSize.tag} select-none`}
          >
            DUEÑO DEL MOMENTO
          </p>
        )}
      </div>
    </div>
  );
}
