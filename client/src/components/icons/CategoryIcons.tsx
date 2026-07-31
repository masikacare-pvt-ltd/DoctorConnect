import { IconProps } from './IconFactories';

// --- Urine Test Icons ---
export const IconUrineDipstick = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 2v18h4V2h-4z" />
    <rect x="11" y="4" width="2" height="2" fill="currentColor" stroke="none" />
    <rect x="11" y="8" width="2" height="2" fill="currentColor" stroke="none" />
    <rect x="11" y="12" width="2" height="2" fill="currentColor" stroke="none" />
    <rect x="11" y="16" width="2" height="2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconUrineBeaker = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 3h12v3l-2 15H8L6 6V3z" />
    <path d="M8 11h8" strokeDasharray="2 2" opacity="0.6" />
    <path d="M8 15c2 1 6-1 8 0" opacity="0.8" />
  </svg>
);

// --- Stool Test Icons ---
export const IconStoolJar = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="7" y="3" width="10" height="3" rx="1" />
    <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
    <path d="M12 10v6M10 13h4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// --- Pathology / Biopsy Icons ---
export const IconBiopsySlide = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" opacity="0.7" />
    <path d="M11 11l2 2M13 11l-2 2" />
  </svg>
);

export const IconTissueSample = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
    <circle cx="9" cy="10" r="2" opacity="0.6" fill="currentColor" />
    <circle cx="15" cy="11" r="1.5" opacity="0.6" fill="currentColor" />
    <circle cx="11" cy="15" r="2.5" opacity="0.6" fill="currentColor" />
  </svg>
);

// --- Imaging: X-Ray, CT Scan, MRI, USG ---
export const IconChestXRay = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M12 5v14" opacity="0.5" />
    <path d="M7 8c2 1 4 1 5 0M12 8c1 1 3 1 5 0" />
    <path d="M7 12c2 1 4 1 5 0M12 12c1 1 3 1 5 0" />
    <path d="M7 16c2 1 4 1 5 0M12 16c1 1 3 1 5 0" />
  </svg>
);

export const IconUltrasoundProbe = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="3" width="6" height="8" rx="2" />
    <path d="M12 11v5" />
    <path d="M7 18c2.5-2 7.5-2 10 0" />
    <path d="M5 21c4-3 10-3 14 0" />
  </svg>
);

export const IconMRIScanner = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" strokeDasharray="3 2" />
    <rect x="7" y="11" width="10" height="2" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCTScanGantry = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
    <path d="M7 12h10" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// --- Cardiology: ECG / Echo ---
export const IconECGWave = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 12h4l2-6 3 12 2-8 2 4h5" />
  </svg>
);

export const IconEchoHeartWave = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M7 12h2l1.5-3 2 6 1.5-3h3" strokeWidth="1.5" />
  </svg>
);

// --- Endoscopy ---
export const IconEndoscope = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 19c4 0 6-2 6-6V5a2 2 0 0 1 4 0v8c0 4 2 6 6 6" />
    <circle cx="4" cy="19" r="2" fill="currentColor" />
    <circle cx="20" cy="19" r="1.5" />
  </svg>
);

// --- Genetics & DNA ---
export const IconDNAStrand = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 18c4-4 4-8 8-12s4-4 8 0" />
    <path d="M4 6c4 4 4 8 8 12s4 4 8 0" />
    <path d="M7 9h10M7 15h10M10 6h4M10 18h4" opacity="0.6" />
  </svg>
);

// --- Health Checkup ---
export const IconCheckupReport = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 13l2 2 4-4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
