import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
}

export const TextCircle = ({ text, size = 24, color = "currentColor", strokeWidth = 1.5, className, ...props }: IconProps & { text: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <text x="12" y="12" textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="bold" stroke="none" fill={color}>{text}</text>
  </svg>
);

export const TextDrop = ({ text, size = 24, color = "currentColor", strokeWidth = 1.5, className, ...props }: IconProps & { text: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    <text x="12" y="15" textAnchor="middle" dominantBaseline="central" fontSize="6.5" fontWeight="bold" stroke="none" fill={color}>{text}</text>
  </svg>
);

export const TextTube = ({ text, size = 24, color = "currentColor", strokeWidth = 1.5, className, ...props }: IconProps & { text: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M9 2v17.5A2.5 2.5 0 0 0 11.5 22h1a2.5 2.5 0 0 0 2.5-2.5V2" />
    <path d="M8 2h8" />
    <path d="M9 16h6" strokeDasharray="1 2" opacity={0.5} />
    <text x="12" y="10" textAnchor="middle" dominantBaseline="central" fontSize="5" fontWeight="bold" stroke="none" fill={color} transform="rotate(-90 12 10)">{text}</text>
  </svg>
);

export const TextHexagon = ({ text, size = 24, color = "currentColor", strokeWidth = 1.5, className, ...props }: IconProps & { text: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <text x="12" y="12" textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="bold" stroke="none" fill={color}>{text}</text>
  </svg>
);

export const TextHeart = ({ text, size = 24, color = "currentColor", strokeWidth = 1.5, className, ...props }: IconProps & { text: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <text x="12" y="10" textAnchor="middle" dominantBaseline="central" fontSize="5.5" fontWeight="bold" stroke="none" fill={color}>{text}</text>
  </svg>
);
