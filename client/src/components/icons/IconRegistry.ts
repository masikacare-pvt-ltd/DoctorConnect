import React from 'react';
import { TextCircle, TextDrop, TextTube, TextHexagon, TextHeart } from './IconFactories';
import * as BloodIcons from './BloodTestIcons';
import * as CatIcons from './CategoryIcons';
import * as OrganIcons from './MedicalOrganIcons';

// Central Registry mapping test item titles & category names to React Icon components
export const TEST_ICON_MAP: Record<string, React.FC<any>> = {
  // --- Pathology & Organ Biopsies ---
  'General Frozen Section': OrganIcons.IconScalpel,
  'Brain Tumor Frozen Section': OrganIcons.IconBrain,
  'Breast Lump Frozen Section': OrganIcons.IconBreast,
  'Thyroid Nodule Frozen Section': OrganIcons.IconThyroid,
  'Renal (Kidney) Frozen Section': OrganIcons.IconKidney,
  'Liver Lesion Frozen Section': OrganIcons.IconLiver,
  'Lung Nodule Frozen Section': OrganIcons.IconLungs,
  'Ovarian Mass Frozen Section': OrganIcons.IconOvary,
  'Lymph Node Frozen Section': OrganIcons.IconLymphNode,
  'Margin Assessment Frozen Section': OrganIcons.IconMarginAssessment,
  'Brain': OrganIcons.IconBrain,
  'Breast': OrganIcons.IconBreast,
  'Thyroid': OrganIcons.IconThyroid,
  'Kidney': OrganIcons.IconKidney,
  'Renal': OrganIcons.IconKidney,
  'Liver': OrganIcons.IconLiver,
  'Lung': OrganIcons.IconLungs,
  'Pulmonary': OrganIcons.IconLungs,
  'Ovary': OrganIcons.IconOvary,
  'Lymph Node': OrganIcons.IconLymphNode,
  'Frozen Section': OrganIcons.IconSnowflake,
  'FNAC (Fine Needle Aspiration Cytology)': OrganIcons.IconScalpel,
  'Pap Smear': OrganIcons.IconCytologyCell,
  'ER / PR / HER2 Neu Panel': OrganIcons.IconAntibodyY,
  'EGFR Mutation Analysis': OrganIcons.IconDNAStrand,

  // --- Hematology ---
  'Complete Blood Count (CBC)': BloodIcons.IconCBC,
  'Peripheral Blood Smear (PBS)': BloodIcons.IconPBS,
  'Hemoglobin (Hb)': (props) => React.createElement(TextDrop, { text: 'Hb', ...props }),
  'PCV / Hematocrit (HCT)': (props) => React.createElement(TextTube, { text: 'PCV', ...props }),
  'ESR': (props) => React.createElement(TextTube, { text: 'ESR', ...props }),
  'RBC Count': BloodIcons.IconRBC,
  'WBC Count': BloodIcons.IconWBC,
  'Platelet Count': BloodIcons.IconPlatelets,
  'Blood Group & RH Typing': BloodIcons.IconBloodGroup,
  'Bleeding Time (BT) / Clotting Time (CT)': BloodIcons.IconBleedingTime,

  // --- Biochemistry ---
  'Liver Function Test (LFT)': BloodIcons.IconLiver,
  'Kidney Function Test (KFT)': BloodIcons.IconKidney,
  'Lipid Profile': BloodIcons.IconLipidProfile,
  'Blood Sugar (Fasting & PP)': BloodIcons.IconGlucoseMeter,
  'HbA1c': (props) => React.createElement(TextCircle, { text: 'HbA1c', ...props }),
  'Electrolytes': BloodIcons.IconElectrolytes,
  'Uric Acid': BloodIcons.IconUricAcid,
  'Calcium': (props) => React.createElement(TextCircle, { text: 'Ca', ...props }),
  'Phosphorus': (props) => React.createElement(TextCircle, { text: 'P', ...props }),
  'Total Protein': (props) => React.createElement(TextCircle, { text: 'TP', ...props }),
  'Albumin': (props) => React.createElement(TextDrop, { text: 'ALB', ...props }),
  'Globulin': BloodIcons.IconGlobulin,

  // --- Hormone & Endocrine ---
  'Thyroid Profile (T3, T4, TSH)': BloodIcons.IconThyroid,
  'T3 (Triiodothyronine)': (props) => React.createElement(TextCircle, { text: 'T3', ...props }),
  'T4 (Thyroxine)': (props) => React.createElement(TextCircle, { text: 'T4', ...props }),
  'TSH (Thyroid Stimulating Hormone)': BloodIcons.IconPituitary,
  'Free T3': (props) => React.createElement(TextCircle, { text: 'FT3', ...props }),
  'Free T4': (props) => React.createElement(TextCircle, { text: 'FT4', ...props }),
  'Cortisol (AM/PM)': BloodIcons.IconCortisol,
  'Prolactin': (props) => React.createElement(TextDrop, { text: '+', ...props }),
  'LH (Luteinizing Hormone)': (props) => React.createElement(TextCircle, { text: 'LH', ...props }),
  'FSH (Follicle Stimulating Hormone)': (props) => React.createElement(TextCircle, { text: 'FSH', ...props }),
  'Estradiol (E2)': BloodIcons.IconFemaleSymbol,
  'Testosterone': BloodIcons.IconMaleSymbol,

  // --- Infectious Disease ---
  'Typhoid (Widal Test)': (props) => React.createElement(TextTube, { text: 'Widal', ...props }),
  'Malaria Parasite (MP) Test': BloodIcons.IconMosquito,
  'Dengue NS1 Antigen': BloodIcons.IconVirusCell,
  'Dengue IgG & IgM Antibody': BloodIcons.IconAntibodyY,
  'Chikungunya IgM': BloodIcons.IconMosquito,
  'Leptospira IgM': BloodIcons.IconBacteriaSpiral,
  'HIV 1 & 2 (ELISA)': BloodIcons.IconRibbon,
  'HBsAg': BloodIcons.IconVirusCell,
  'Anti HCV': BloodIcons.IconVirusCell,
  'VDRL / RPR': BloodIcons.IconBacteriaSpiral,
  'TB (AFB) Test': BloodIcons.IconLungs,
  'CRP (C-Reactive Protein)': (props) => React.createElement(TextCircle, { text: 'CRP', ...props }),

  // --- Liver Function (LFT) ---
  'SGOT (AST)': (props) => React.createElement(TextCircle, { text: 'SGOT', ...props }),
  'SGPT (ALT)': (props) => React.createElement(TextCircle, { text: 'SGPT', ...props }),
  'Alkaline Phosphatase (ALP)': (props) => React.createElement(TextCircle, { text: 'ALP', ...props }),
  'GGT (Gamma GT)': (props) => React.createElement(TextCircle, { text: 'GGT', ...props }),
  'Total Bilirubin': (props) => React.createElement(TextDrop, { text: 'TB', ...props }),
  'Direct Bilirubin': (props) => React.createElement(TextDrop, { text: 'DB', ...props }),
  'Indirect Bilirubin': (props) => React.createElement(TextDrop, { text: 'IB', ...props }),
  'A/G Ratio': (props) => React.createElement(TextCircle, { text: 'A/G', ...props }),
  'LDH (Lactate Dehydrogenase)': (props) => React.createElement(TextCircle, { text: 'LDH', ...props }),

  // --- Kidney Function (KFT) ---
  'Serum Creatinine': BloodIcons.IconKidney,
  'Blood Urea': (props) => React.createElement(TextCircle, { text: 'UREA', ...props }),
  'BUN': (props) => React.createElement(TextCircle, { text: 'BUN', ...props }),
  'eGFR': BloodIcons.IconDial,
  'Sodium (Na+)': (props) => React.createElement(TextCircle, { text: 'Na+', ...props }),
  'Potassium (K+)': (props) => React.createElement(TextCircle, { text: 'K+', ...props }),
  'Chloride (Cl-)': (props) => React.createElement(TextCircle, { text: 'Cl-', ...props }),
  'Magnesium': (props) => React.createElement(TextCircle, { text: 'Mg', ...props }),
  'Bicarbonate (HCO3-)': (props) => React.createElement(TextCircle, { text: 'HCO3', ...props }),

  // --- Cardiac Markers ---
  'Troponin I': (props) => React.createElement(TextDrop, { text: 'TnI', ...props }),
  'Troponin T': (props) => React.createElement(TextDrop, { text: 'TnT', ...props }),
  'CK-MB': BloodIcons.IconHeartVeins,
  'BNP': (props) => React.createElement(TextHeart, { text: 'BNP', ...props }),
  'NT-proBNP': (props) => React.createElement(TextHeart, { text: 'proBNP', ...props }),
  'Myoglobin': BloodIcons.IconBicep,
  'LDH': (props) => React.createElement(TextDrop, { text: 'LDH', ...props }),
  'hs-CRP': (props) => React.createElement(TextDrop, { text: 'hsCRP', ...props }),
  'D-Dimer': BloodIcons.IconDropSwirl,
  'Homocysteine': BloodIcons.IconHeartArrow,

  // --- Diabetes / Glucose ---
  'Fasting Blood Sugar (FBS)': BloodIcons.IconDropSugar,
  'Postprandial Blood Sugar (PPBS)': BloodIcons.IconForkKnife,
  'Random Blood Sugar (RBS)': BloodIcons.IconDropClock,
  'Oral Glucose Tolerance Test (OGTT)': BloodIcons.IconBottle75g,
  'Fasting Insulin': BloodIcons.IconSyringe,
  'C-Peptide': (props) => React.createElement(TextDrop, { text: 'C', ...props }),
  'Fructosamine': (props) => React.createElement(TextCircle, { text: 'FRUC', ...props }),
  'GAD Antibody': (props) => React.createElement(TextCircle, { text: 'GAD', ...props }),

  // --- Iron Studies ---
  'Serum Iron': (props) => React.createElement(TextCircle, { text: 'Fe', ...props }),
  'Serum Ferritin': (props) => React.createElement(TextDrop, { text: 'FERR', ...props }),
  'Total Iron Binding Capacity (TIBC)': (props) => React.createElement(TextCircle, { text: 'TIBC', ...props }),
  'Unsaturated Iron Binding Capacity (UIBC)': (props) => React.createElement(TextCircle, { text: 'UIBC', ...props }),
  'Transferrin': BloodIcons.IconTransferrin,
  'Transferrin Saturation': (props) => React.createElement(TextCircle, { text: '%Sat', ...props }),
  'Soluble Transferrin Receptor (sTfR)': BloodIcons.IconAntibodyY,
  'Reticulocyte Hemoglobin Content (Ret-He)': (props) => React.createElement(TextCircle, { text: 'Ret-He', ...props }),

  // --- Vitamins & Minerals ---
  'Vitamin D (25-OH)': (props) => React.createElement(TextCircle, { text: 'Vit D', ...props }),
  'Vitamin B12': (props) => React.createElement(TextCircle, { text: 'B12', ...props }),
  'Folate (Vitamin B9)': (props) => React.createElement(TextCircle, { text: 'B9', ...props }),
  'Vitamin A': (props) => React.createElement(TextDrop, { text: 'Vit A', ...props }),
  'Vitamin E': (props) => React.createElement(TextCircle, { text: 'Vit E', ...props }),
  'Vitamin K': (props) => React.createElement(TextCircle, { text: 'Vit K', ...props }),
  'Vitamin C': (props) => React.createElement(TextCircle, { text: 'Vit C', ...props }),
  'Zinc': (props) => React.createElement(TextHexagon, { text: 'Zn', ...props }),
  'Copper': (props) => React.createElement(TextHexagon, { text: 'Cu', ...props }),
  'Selenium': (props) => React.createElement(TextHexagon, { text: 'Se', ...props }),

  // --- Others ---
  'ANA (ANA Screen)': BloodIcons.IconAntibodyY,
  'ANCA': BloodIcons.IconAntibodyY,
  'Anti-dsDNA': BloodIcons.IconAntibodyY,
  'Rheumatoid Factor (RF)': (props) => React.createElement(TextCircle, { text: 'RF', ...props }),
  'Anti-CCP': (props) => React.createElement(TextCircle, { text: 'aCCP', ...props }),
  'Procalcitonin (PCT)': (props) => React.createElement(TextCircle, { text: 'PCT', ...props }),
  'Interleukin-6 (IL-6)': (props) => React.createElement(TextCircle, { text: 'IL-6', ...props }),
  'Beta-hCG': (props) => React.createElement(TextDrop, { text: 'hCG', ...props }),
  'PSA': (props) => React.createElement(TextCircle, { text: 'PSA', ...props }),
  'CA-125': (props) => React.createElement(TextCircle, { text: 'CA125', ...props }),
  'CA 19-9': (props) => React.createElement(TextCircle, { text: 'CA19', ...props }),
  'CEA': (props) => React.createElement(TextCircle, { text: 'CEA', ...props }),
  'AFP': (props) => React.createElement(TextCircle, { text: 'AFP', ...props }),
  'Ferritin': (props) => React.createElement(TextDrop, { text: 'FERR', ...props }),

  // --- Non-Blood Main Category generic icon mappings ---
  'Urine Test': CatIcons.IconUrineDipstick,
  'Stool Test': CatIcons.IconStoolJar,
  'Pathology / Biopsy': CatIcons.IconBiopsySlide,
  'X-Ray': CatIcons.IconChestXRay,
  'Ultrasound (USG)': CatIcons.IconUltrasoundProbe,
  'MRI': CatIcons.IconMRIScanner,
  'CT Scan': CatIcons.IconCTScanGantry,
  'ECG / Echo': CatIcons.IconECGWave,
  'Endoscopy': CatIcons.IconEndoscope,
  'Genetic Test': CatIcons.IconDNAStrand,
  'Health Checkup Report': CatIcons.IconCheckupReport,
};

// Helper function to resolve an icon by test title or fallback to text badge
export function getTestIcon(title: string): React.FC<any> | null {
  if (TEST_ICON_MAP[title]) {
    return TEST_ICON_MAP[title];
  }
  // Loose fuzzy match for titles containing key keywords
  for (const [key, icon] of Object.entries(TEST_ICON_MAP)) {
    if (title.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(title.toLowerCase())) {
      return icon;
    }
  }
  return null;
}
