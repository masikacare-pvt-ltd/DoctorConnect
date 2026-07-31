import { IconProps } from './IconFactories';

// --- Hematology ---
export const IconCBC = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 2v17.5A2.5 2.5 0 0 0 11.5 22h1a2.5 2.5 0 0 0 2.5-2.5V2" />
    <path d="M8 2h8" />
    <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" />
    <circle cx="10.5" cy="17" r="1" fill="currentColor" stroke="none" />
    <circle cx="13.5" cy="17" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconRBC = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="10" r="5" />
    <circle cx="9" cy="10" r="2" opacity="0.4" />
    <circle cx="15" cy="15" r="5" />
    <circle cx="15" cy="15" r="2" opacity="0.4" />
  </svg>
);

export const IconPBS = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="8" r="4" />
    <circle cx="12" cy="8" r="1.5" opacity="0.4" />
    <circle cx="8" cy="15" r="4" />
    <circle cx="8" cy="15" r="1.5" opacity="0.4" />
    <circle cx="16" cy="15" r="4" />
    <circle cx="16" cy="15" r="1.5" opacity="0.4" />
  </svg>
);

export const IconWBC = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a1 1 0 0 1 1 1v2.1a7 7 0 0 1 3.9 1.6l1.5-1.5a1 1 0 0 1 1.4 1.4l-1.5 1.5A7 7 0 0 1 19.9 11h2.1a1 1 0 0 1 0 2h-2.1a7 7 0 0 1-1.6 3.9l1.5 1.5a1 1 0 0 1-1.4 1.4l-1.5-1.5a7 7 0 0 1-3.9 1.6V21a1 1 0 0 1-2 0v-2.1a7 7 0 0 1-3.9-1.6l-1.5 1.5a1 1 0 0 1-1.4-1.4l1.5-1.5A7 7 0 0 1 4.1 13H2a1 1 0 0 1 0-2h2.1a7 7 0 0 1 1.6-3.9L4.2 5.6a1 1 0 0 1 1.4-1.4l1.5 1.5A7 7 0 0 1 11 4.1V3a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="12" r="3" opacity="0.6" />
  </svg>
);

export const IconPlatelets = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3l2 4 4.5 1-3 3.5 1 4.5-4.5-2L7.5 16l1-4.5-3-3.5 4.5-1z" />
    <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const IconFemaleSymbol = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14v7M9 18h6" />
  </svg>
);

export const IconMaleSymbol = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="10" cy="14" r="5" />
    <path d="M13.5 10.5L19 5M15 5h4v4" />
  </svg>
);

export const IconBloodGroup = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <text x="7" y="7" textAnchor="middle" dominantBaseline="central" fontSize="4" fontWeight="bold" stroke="none" fill="currentColor">A</text>
    <rect x="13" y="3" width="8" height="8" rx="2" />
    <text x="17" y="7" textAnchor="middle" dominantBaseline="central" fontSize="4" fontWeight="bold" stroke="none" fill="currentColor">B</text>
    <rect x="3" y="13" width="8" height="8" rx="2" />
    <text x="7" y="17" textAnchor="middle" dominantBaseline="central" fontSize="4" fontWeight="bold" stroke="none" fill="currentColor">O</text>
    <rect x="13" y="13" width="8" height="8" rx="2" />
    <text x="17" y="17" textAnchor="middle" dominantBaseline="central" fontSize="3.5" fontWeight="bold" stroke="none" fill="currentColor">AB</text>
  </svg>
);

export const IconBleedingTime = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    <circle cx="12" cy="15" r="3.5" />
    <path d="M12 13.5v1.5l1 1" />
  </svg>
);

// --- Biochemistry & General Organs ---
export const IconLiver = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21.5 8.5C21.5 12.5 16 18 10 18c-4.5 0-7-2-7-5 0-3 3-4.5 5.5-5.5 3-1 8-2 11-1 1.2.4 2 1.2 2 2z" />
    <path d="M9 13.5C9 13.5 13 13 15 10" opacity="0.5" />
  </svg>
);

export const IconKidney = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 15c-3 1-5 1-6-1-1-2-.5-3.5 1-5 1.5-1.5 2-4.5.5-6.5C10 1 5 3 4 8c-1 6 2 13 8 14 5 1 9-3 8-7-1-4-2-2-4 0z" />
  </svg>
);

export const IconLipidProfile = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    <circle cx="12" cy="15" r="2.5" />
    <path d="M14 13l-1.5 1.5" />
  </svg>
);

export const IconGlucoseMeter = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="7" y="3" width="10" height="18" rx="2" />
    <rect x="9" y="6" width="6" height="5" rx="1" />
    <path d="M12 14v4" />
    <path d="M12 18a1 1 0 0 1-1-1" />
  </svg>
);

export const IconHbA1cHex = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 11V7l-3.5-2-3.5 2v4l3.5 2 3.5-2z" />
    <path d="M10.5 13v4l3.5 2 3.5-2v-4l-3.5-2-3.5 2z" />
    <circle cx="10.5" cy="9" r="1" fill="currentColor" stroke="none" />
    <circle cx="14" cy="15" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconElectrolytes = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="7" r="3" />
    <circle cx="7" cy="17" r="3" />
    <circle cx="17" cy="17" r="3" />
    <path d="M10.5 9.5l-2 5" />
    <path d="M13.5 9.5l2 5" />
    <path d="M9.5 17h5" />
  </svg>
);

export const IconUricAcid = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3L6 9v6l6 6 6-6V9z" />
    <path d="M12 3v6" />
    <path d="M12 9l6 3" />
    <path d="M12 9l-6 3" />
    <path d="M6 15l6-3 6 3" />
    <path d="M12 15v6" />
  </svg>
);

export const IconGlobulin = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="5" r="2" />
    <circle cx="6" cy="16" r="2" />
    <circle cx="18" cy="16" r="2" />
    <path d="M12 7v2" />
    <path d="M7.5 14.5l2-1.5" />
    <path d="M16.5 14.5l-2-1.5" />
  </svg>
);

// --- Hormone & Endocrine ---
export const IconThyroid = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 6c-2 0-4 2-4 5s2 6 5 6c2 0 3-1 4-2.5 1 1.5 2 2.5 4 2.5 3 0 5-3 5-6s-2-5-4-5c-2 0-3 1.5-4 3-1-1.5-2-3-4-3z" />
    <path d="M12 9v6" opacity="0.4" />
  </svg>
);

export const IconPituitary = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 4c-4.5 0-8 3-8 7.5 0 3 1.5 5 4 6.5" />
    <path d="M12 4c4.5 0 8 3 8 7.5 0 3-1.5 5-4 6.5" />
    <circle cx="10" cy="19" r="2" />
    <circle cx="14" cy="19" r="2" />
    <path d="M12 11.5v5.5" />
  </svg>
);

export const IconCortisol = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 10l4-2 4 2v4l-4 2-4-2z" />
    <path d="M14 10l4-2 4 2v4l-4 2-4-2z" opacity="0.7" />
    <circle cx="10" cy="16" r="1.5" />
  </svg>
);

// --- Infectious Disease ---
export const IconMosquito = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <ellipse cx="12" cy="13" rx="2" ry="5" />
    <circle cx="12" cy="6" r="1.5" />
    <path d="M12 4.5V2" />
    <path d="M10 10L5 6" />
    <path d="M14 10l5-4" />
    <path d="M10 14L4 18" />
    <path d="M14 14l6 4" />
  </svg>
);

export const IconVirusCell = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.9 2.9M15.5 15.5l2.9 2.9M5.6 18.4l2.9-2.9M15.5 8.5l2.9-2.9" />
    <circle cx="12" cy="3" r="1" fill="currentColor" />
    <circle cx="12" cy="21" r="1" fill="currentColor" />
    <circle cx="3" cy="12" r="1" fill="currentColor" />
    <circle cx="21" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const IconBacteriaSpiral = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 16c3-4 5 4 8 0s5 4 6 0" />
    <circle cx="6" cy="14" r="1" fill="currentColor" />
    <circle cx="12" cy="14" r="1" fill="currentColor" />
    <circle cx="18" cy="14" r="1" fill="currentColor" />
  </svg>
);

export const IconAntibodyY = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 21v-9M12 12L6 4M12 12l6-8" />
    <path d="M4 3h4M16 3h4" />
  </svg>
);

export const IconLungs = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 4v8" />
    <path d="M12 6c-2-2-4-2-4-2" />
    <path d="M12 6c2-2 4-2 4-2" />
    <path d="M11 12C8 12 5 14 5 17.5 5 20 7 21 9 21c2 0 3-1.5 3-3.5V12z" />
    <path d="M13 12c3 0 6 2 6 5.5 0 2.5-2 3.5-4 3.5-2 0-3-1.5-3-3.5V12z" />
  </svg>
);

export const IconRibbon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3c-2.5 0-4 1.5-4 4 0 3 4 8 4 8s4-5 4-8c0-2.5-1.5-4-4-4z" />
    <path d="M9.5 13.5L5 21M14.5 13.5L19 21" />
  </svg>
);

// --- Cardiac Markers ---
export const IconHeartVeins = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 5v5M10 7h4M14 11l2 2" opacity="0.6" />
  </svg>
);

export const IconBicep = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 18c.5-3 2.5-4 4.5-4 1.5 0 2.5 1 3.5 1s2-1.5 3.5-1.5c2.5 0 4.5 2.5 4.5 5.5 0 1-.5 2-2 2H7c-1.5 0-2-.5-2-3z" />
    <path d="M9.5 14c-1-2.5 0-5 2.5-6.5C14 6 16.5 7 16.5 7" />
  </svg>
);

export const IconDropSwirl = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    <path d="M10 15a2 2 0 1 0 3-1.7" />
  </svg>
);

export const IconHeartArrow = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M4 4l16 16" />
    <path d="M17 20h3v-3" />
  </svg>
);

// --- Diabetes / Glucose ---
export const IconDropSugar = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    <rect x="10" y="13" width="4" height="4" rx="0.5" fill="currentColor" stroke="none" opacity="0.8" />
  </svg>
);

export const IconForkKnife = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 4v7a2 2 0 0 0 2 2v7" />
    <path d="M5 4v4M9 4v4" />
    <path d="M16 4v16M16 4a3 3 0 0 1 3 3v4h-3" />
  </svg>
);

export const IconDropClock = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    <circle cx="12" cy="15" r="3" />
    <path d="M12 13.5v1.5l1 0.5" />
  </svg>
);

export const IconBottle75g = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 2h4M11 2v3l-3 3v11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9l-3-3V2" />
    <text x="12" y="14" textAnchor="middle" dominantBaseline="central" fontSize="4" fontWeight="bold" stroke="none" fill="currentColor">75g</text>
  </svg>
);

export const IconSyringe = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m18 2 4 4M17 5l3 3M19 9l-8.5 8.5c-.75.75-1.75 1-2.5 1L5 20l1.5-3c0-.75.25-1.75 1-2.5L16 6" />
    <path d="m3 21 3-3M9 11l2 2" />
  </svg>
);

// --- Iron & Kidney ---
export const IconTransferrin = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="6" cy="18" r="2" />
    <circle cx="10" cy="14" r="2" />
    <circle cx="14" cy="10" r="2" />
    <circle cx="18" cy="6" r="2" />
    <path d="M7.5 16.5l1-1M11.5 12.5l1-1M15.5 8.5l1-1" />
  </svg>
);

export const IconDial = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
    <path d="M12 12l4-4" />
    <path d="M7 12h1M17 12h1M12 7v1" />
  </svg>
);

