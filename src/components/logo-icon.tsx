export function LogoIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="50 40 200 220"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mu-top" gradientUnits="userSpaceOnUse" x1="150" y1="50" x2="150" y2="150">
          <stop offset="0%" stopColor="#A1B1C2" /><stop offset="100%" stopColor="#4A5A6A" />
        </linearGradient>
        <linearGradient id="mu-left" gradientUnits="userSpaceOnUse" x1="150" y1="150" x2="63.3975" y2="200">
          <stop offset="0%" stopColor="#3A4857" /><stop offset="100%" stopColor="#12181E" />
        </linearGradient>
        <linearGradient id="mu-right" gradientUnits="userSpaceOnUse" x1="150" y1="150" x2="236.6025" y2="200">
          <stop offset="0%" stopColor="#55687C" /><stop offset="100%" stopColor="#1C2530" />
        </linearGradient>
        <mask id="mu-cut">
          <rect x="0" y="0" width="1000" height="1000" fill="white" />
          <path d="M 142 40 V 135 L 80 170.7957 V 260 H 110 V 176.906 L 150 200 L 190 176.906 V 260 H 220 V 170.7957 L 158 135 V 40 Z" fill="black" />
        </mask>
      </defs>
      <g mask="url(#mu-cut)">
        <path d="M 150 150 L 63.3975 100 L 150 50 L 236.6025 100 Z" fill="url(#mu-top)" />
        <path d="M 150 150 L 63.3975 100 L 63.3975 200 L 150 250 Z" fill="url(#mu-left)" />
        <path d="M 150 150 L 236.6025 100 L 236.6025 200 L 150 250 Z" fill="url(#mu-right)" />
      </g>
    </svg>
  );
}
