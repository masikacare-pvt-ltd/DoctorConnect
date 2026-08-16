import { IconProps } from './IconFactories';
export { IconDNAStrand, IconBiopsySlide } from './CategoryIcons';

// --- Brain Organ / Neuro ---
export const IconBrain = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.5 4a3.5 3.5 0 0 0-3.3 2.3 3.5 3.5 0 0 0-.7 6.8 3.5 3.5 0 0 0 .5 5.9 3.5 3.5 0 0 0 6.5 1V4Z" />
    <path d="M14.5 4a3.5 3.5 0 0 1 3.3 2.3 3.5 3.5 0 0 1 .7 6.8 3.5 3.5 0 0 1-.5 5.9 3.5 3.5 0 0 1-6.5 1V4Z" />
    <path d="M9.5 8h.01M14.5 8h.01M7 12h.01M17 12h.01M9 16h.01M15 16h.01" strokeWidth="2" />
  </svg>
);

// --- Lungs Organ / Pulmonary ---
export const IconLungs = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3v8M12 7l-3 3M12 7l3 3" />
    <path d="M6 9c-2 1-3 4-3 7s1 5 4 5c3 0 5-2 5-6V9H6Z" />
    <path d="M18 9c2 1 3 4 3 7s-1 5-4 5c-3 0-5-2-5-6V9h6Z" />
  </svg>
);

// --- Kidney Organ / Renal ---
export const IconKidney = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7.5 4C4.5 4 3 6.5 3 10.5c0 4.5 2.5 9.5 6 9.5 2 0 3-1.5 3-3.5 0-2.5-1.5-3.5-3-3.5-1 0-1.5.5-1.5.5s1-2.5 1-4c0-2.5-1-5.5-1-5.5Z" />
    <path d="M16.5 4C19.5 4 21 6.5 21 10.5c0 4.5-2.5 9.5-6 9.5-2 0-3-1.5-3-3.5 0-2.5 1.5-3.5 3-3.5 1 0 1.5.5 1.5.5s-1-2.5-1-4c0-2.5 1-5.5 1-5.5Z" />
  </svg>
);

// --- Liver Organ ---
export const IconLiver = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 8c0-3 3-5 8-5s9 2 9 6c0 5-3 10-10 10-4 0-7-2-7-6V8Z" />
    <path d="M11 3v16" opacity="0.4" />
  </svg>
);

// --- Thyroid Gland ---
export const IconThyroid = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 5c-2 2-3 5-3 8 0 4 2 7 5 7 2 0 3-2 4-5 1 3 2 5 4 5 3 0 5-3 5-7 0-3-1-6-3-8-2 0-4 2-6 5-2-3-4-5-6-5Z" />
    <path d="M12 3v18" opacity="0.4" />
  </svg>
);

// --- Breast Tissue ---
export const IconBreast = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3c-4.5 4.5-7 8-7 12 0 3.8 3.1 7 7 7s7-3.2 7-7c0-4-2.5-7.5-7-12Z" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

// --- Female Reproductive System / Ovary ---
export const IconOvary = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 8v13M12 14c-3 0-5-2-5-5M12 14c3 0 5-2 5-5" />
    <circle cx="5" cy="8" r="3" />
    <circle cx="19" cy="8" r="3" />
    <path d="M9 3h6v4H9z" />
  </svg>
);

// --- Lymph Node Network ---
export const IconLymphNode = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="5" cy="6" r="2" />
    <circle cx="19" cy="6" r="2" />
    <circle cx="5" cy="18" r="2" />
    <circle cx="19" cy="18" r="2" />
    <path d="M6.5 7.5 9.5 10M17.5 7.5 14.5 10M6.5 16.5 9.5 14M17.5 16.5 14.5 14" />
  </svg>
);

// --- Margin Assessment ---
export const IconMarginAssessment = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    <circle cx="16" cy="8" r="1.5" fill="currentColor" />
    <circle cx="8" cy="16" r="1.5" fill="currentColor" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

// --- Scalpel / Surgical Blade ---
export const IconScalpel = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m18 3 3 3-10 10H8v-3L18 3Z" />
    <path d="M3 21l8-8" strokeWidth="2" />
  </svg>
);

// --- Snowflake (Frozen Section) ---
export const IconSnowflake = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" />
    <path d="M10 4l2 2 2-2M10 20l2-2 2 2M4 10l2 2-2 2M20 10l-2 2 2 2" />
  </svg>
);

// --- Clinical Microscope ---
export const IconMicroscope = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 18h12M12 18v-4" />
    <path d="M9 14h6" />
    <path d="M12 10a4 4 0 0 0 4-4V3H8v3a4 4 0 0 0 4 4Z" />
    <path d="M12 3V2" />
    <circle cx="12" cy="18" r="1" fill="currentColor" />
  </svg>
);

// --- Cytology Cell ---
export const IconCytologyCell = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 20 7 20 17 12 22 4 17 4 7 12 2" />
    <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

// --- Antibody Y ---
export const IconAntibodyY = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22v-9M12 13 6 5M12 13l6-8" strokeWidth="2" />
    <circle cx="6" cy="5" r="2" fill="currentColor" />
    <circle cx="18" cy="5" r="2" fill="currentColor" />
  </svg>
);

// --- Stomach GI Organ ---
export const IconStomach = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 3v4c0 6 3 12 9 12 3 0 4-2 4-4 0-4-3-6-7-6-2 0-4 1-5 2V3H9Z" />
  </svg>
);

// --- Stool Routine Icons matching Reference Screenshot ---
export const IconPhysicalExam = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" strokeWidth="2" />
    <circle cx="11" cy="11" r="2" fill="currentColor" opacity="0.4" />
  </svg>
);

export const IconStoolConsistency = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 4c-4 0-7 3-7 7 0 4 3 9 7 9s7-5 7-9c0-4-3-7-7-7Z" />
    <path d="M9 10c0 2 1.5 3.5 3 3.5s3-1.5 3-3.5" opacity="0.5" />
  </svg>
);

export const IconMucusDrop = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3c-4.5 4.5-7 8-7 12 0 3.8 3.1 7 7 7s7-3.2 7-7c0-4-2.5-7.5-7-12Z" />
    <path d="M12 9c-2 2-3 4-3 6" opacity="0.6" strokeWidth="2" />
  </svg>
);

export const IconPusCells = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
    <circle cx="15" cy="9" r="1.5" fill="currentColor" />
    <circle cx="12" cy="15" r="1.5" fill="currentColor" />
  </svg>
);

export const IconRBCCells = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="16" cy="8" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="8" cy="16" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="16" cy="16" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="8" cy="8" r="4" />
    <circle cx="16" cy="8" r="4" />
    <circle cx="8" cy="16" r="4" />
    <circle cx="16" cy="16" r="4" />
  </svg>
);

export const IconYeastCell = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <ellipse cx="10" cy="14" rx="6" ry="7" />
    <ellipse cx="16" cy="8" rx="4" ry="4.5" />
  </svg>
);

export const IconLeaf = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 20A9 9 0 0 0 20 11V3h-8a9 9 0 0 0-9 9c0 4.5 3.5 8 8 8Z" />
    <path d="M11 20v-9" strokeWidth="2" />
  </svg>
);

export const IconStarchGranules = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 3 17 8 12 13 7 8 12 3" fill="currentColor" opacity="0.3" />
    <polygon points="12 3 17 8 12 13 7 8 12 3" />
    <polygon points="7 14 11 18 7 22 3 18 7 14" />
    <polygon points="17 14 21 18 17 22 13 18 17 14" />
  </svg>
);

export const IconCapsule = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="8" width="16" height="8" rx="4" transform="rotate(-45 12 12)" />
    <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" opacity="0.6" />
  </svg>
);

export const IconColon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 19V9a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v10" />
    <path d="M5 14h14" opacity="0.5" />
  </svg>
);

// --- Skin / Dermatology ---
export const IconSkin = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M7 12c1-2 3-3 5-3s4 1 5 3" opacity="0.6" />
    <circle cx="9" cy="9" r="1" fill="currentColor" />
    <circle cx="15" cy="9" r="1" fill="currentColor" />
    <path d="M9 16s1 2 3 2 3-2 3-2" />
  </svg>
);

// --- Bone Marrow ---
export const IconBoneMarrow = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M8 3c-1.5 2-2 4-2 6 0 2.5 1 4.5 2 5.5V21h8v-6.5c1-1 2-3 2-5.5 0-2-.5-4-2-6" />
    <path d="M8 9h8M8 13h8" opacity="0.5" />
    <circle cx="12" cy="6" r="2" fill="currentColor" opacity="0.3" />
  </svg>
);

// --- Prostate Gland ---
export const IconProstate = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <ellipse cx="12" cy="10" rx="7" ry="5" />
    <path d="M12 15v6" />
    <path d="M9 18h6" opacity="0.6" />
    <circle cx="12" cy="10" r="2.5" fill="currentColor" opacity="0.25" />
  </svg>
);

// --- Fluid Drop (Body Fluid Cytology) ---
export const IconFluidDrop = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3c-4.5 4.5-7 8-7 12 0 3.8 3.1 7 7 7s7-3.2 7-7c0-4-2.5-7.5-7-12Z" />
    <path d="M9 14c0 1.7 1.3 3 3 3" opacity="0.6" strokeWidth="2" />
    <circle cx="16" cy="7" r="1" fill="currentColor" opacity="0.7" />
    <circle cx="18" cy="11" r="0.8" fill="currentColor" opacity="0.5" />
  </svg>
);
