import React from 'react';
import {
  BloodDrop,
  UrineSample,
  MedicalSample,
  MicroscopeWithSpecimen,
  Xray,
  UltrasoundScanner,
  HeartCardiogram,
  Dna,
  Hematology,
  Liver,
  Sonography,
  Radiology,
} from 'healthicons-react';

type P = React.SVGProps<SVGSVGElement>;

// ─── Main Category Icons using healthicons-react ─────────────────────────────
// These are production-quality, professionally designed medical SVG icons
// from healthicons.org — free public domain (CC0)

// 1. Blood Test — red blood drop
export const IconBloodDrop = (p: P) => (
  <BloodDrop style={{ color: '#E53935' }} {...p} />
);

// 2. Urine Test — amber urine sample cup
export const IconUrineDipstick = (p: P) => (
  <UrineSample style={{ color: '#F57C00' }} {...p} />
);

// 3. Stool Test — brown specimen jar
export const IconStoolJar = (p: P) => (
  <MedicalSample style={{ color: '#795548' }} {...p} />
);

// 4. Pathology / Biopsy — purple microscope with specimen
export const IconBiopsySlide = (p: P) => (
  <MicroscopeWithSpecimen style={{ color: '#7B1FA2' }} {...p} />
);

// 5. X-Ray — dark indigo xray
export const IconChestXRay = (p: P) => (
  <Xray style={{ color: '#283593' }} {...p} />
);

// 6. Ultrasound — teal ultrasound scanner
export const IconUltrasoundProbe = (p: P) => (
  <UltrasoundScanner style={{ color: '#00897B' }} {...p} />
);

// 7. MRI — cyan brain (use Radiology icon from healthicons)
export const IconMRIScanner = (p: P) => (
  <Radiology style={{ color: '#0288D1' }} {...p} />
);

// 8. CT Scan — blue-grey Sonography/scanner gantry
export const IconCTScanGantry = (p: P) => (
  <Sonography style={{ color: '#455A64' }} {...p} />
);

// 9. ECG / Echo — pink heart cardiogram
export const IconECGWave = (p: P) => (
  <HeartCardiogram style={{ color: '#E91E63' }} {...p} />
);

// 10. Endoscopy — olive/green Gastroenterology icon
export const IconEndoscope = (p: P) => (
  <Liver style={{ color: '#558B2F' }} {...p} />
);

// 11. Genetic Test — teal DNA
export const IconDNAStrand = (p: P) => (
  <Dna style={{ color: '#00796B' }} {...p} />
);

// 12. Health Checkup — indigo Hematology lab
export const IconCheckupReport = (p: P) => (
  <Hematology style={{ color: '#283593' }} {...p} />
);

// ─── Legacy aliases ──────────────────────────────────────────────────────────
export const IconUrineBeaker   = IconUrineDipstick;
export const IconTissueSample  = IconBiopsySlide;
export const IconChestXRayIcon = IconChestXRay;
export const IconEchoHeartWave = IconECGWave;
