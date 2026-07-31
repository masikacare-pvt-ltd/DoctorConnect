import React, { useState } from 'react';
import {
  Droplet,
  TestTube,
  Activity,
  Zap,
  Flame,
  Shield,
  Heart,
  CircleDot,
  Layers,
  Sun,
  Crosshair,
  Microscope,
  ArrowLeft,
  Search,
  ChevronRight
} from 'lucide-react';
import { getTestIcon } from './icons/IconRegistry';
import * as CatIcons from './icons/CategoryIcons';
import * as MedicalIcons from './icons/MedicalOrganIcons';

export interface ReportSelection {
  mainCategory: string;
  subCategory: string;
  testItem: string;
  tags: string[];
}

interface SubCategoryItem {
  name: string;
  desc: string;
  iconBg: string;
  iconColor: string;
  badgeIcon: React.ComponentType<any>;
  menuIcon: React.ComponentType<any>;
  tests: Array<{ title: string; desc: string; badgeText: string; tags: string[] }>;
}

const MAIN_CATEGORIES = [
  { id: 'blood', name: 'Blood Test', icon: Droplet, color: 'bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400', iconBg: 'bg-rose-50 dark:bg-rose-950/50', iconColor: 'text-rose-500 dark:text-rose-400', textColor: 'text-rose-600 dark:text-rose-400' },
  { id: 'urine', name: 'Urine Test', icon: CatIcons.IconUrineDipstick, color: 'bg-amber-50 text-amber-500 dark:bg-amber-950/50 dark:text-amber-400', iconBg: 'bg-amber-50 dark:bg-amber-950/50', iconColor: 'text-amber-500 dark:text-amber-400', textColor: 'text-amber-600 dark:text-amber-400' },
  { id: 'stool', name: 'Stool Test', icon: CatIcons.IconStoolJar, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400', iconBg: 'bg-yellow-50 dark:bg-yellow-950/50', iconColor: 'text-yellow-600 dark:text-yellow-400', textColor: 'text-yellow-600 dark:text-yellow-400' },
  { id: 'pathology', name: 'Pathology / Biopsy', icon: CatIcons.IconBiopsySlide, color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400', iconBg: 'bg-purple-50 dark:bg-purple-950/50', iconColor: 'text-purple-600 dark:text-purple-400', textColor: 'text-purple-600 dark:text-purple-400' },
  { id: 'xray', name: 'X-Ray', icon: CatIcons.IconChestXRay, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400', iconBg: 'bg-blue-50 dark:bg-blue-950/50', iconColor: 'text-blue-600 dark:text-blue-400', textColor: 'text-blue-600 dark:text-blue-400' },
  { id: 'usg', name: 'Ultrasound (USG)', icon: CatIcons.IconUltrasoundProbe, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400', iconBg: 'bg-cyan-50 dark:bg-cyan-950/50', iconColor: 'text-cyan-600 dark:text-cyan-400', textColor: 'text-cyan-600 dark:text-cyan-400' },
  { id: 'mri', name: 'MRI', icon: CatIcons.IconMRIScanner, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400', iconBg: 'bg-indigo-50 dark:bg-indigo-950/50', iconColor: 'text-indigo-600 dark:text-indigo-400', textColor: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'ct', name: 'CT Scan', icon: CatIcons.IconCTScanGantry, color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400', iconBg: 'bg-teal-50 dark:bg-teal-950/50', iconColor: 'text-teal-600 dark:text-teal-400', textColor: 'text-teal-600 dark:text-teal-400' },
  { id: 'ecg', name: 'ECG / Echo', icon: CatIcons.IconECGWave, color: 'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400', iconBg: 'bg-pink-50 dark:bg-pink-950/50', iconColor: 'text-pink-600 dark:text-pink-400', textColor: 'text-pink-600 dark:text-pink-400' },
  { id: 'endoscopy', name: 'Endoscopy', icon: CatIcons.IconEndoscope, color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400', iconBg: 'bg-orange-50 dark:bg-orange-950/50', iconColor: 'text-orange-600 dark:text-orange-400', textColor: 'text-orange-600 dark:text-orange-400' },
  { id: 'genetic', name: 'Genetic Test', icon: CatIcons.IconDNAStrand, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400', iconBg: 'bg-violet-50 dark:bg-violet-950/50', iconColor: 'text-violet-600 dark:text-violet-400', textColor: 'text-violet-600 dark:text-violet-400' },
  { id: 'checkup', name: 'Health Checkup Report', icon: CatIcons.IconCheckupReport, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400', iconBg: 'bg-emerald-50 dark:bg-emerald-950/50', iconColor: 'text-emerald-600 dark:text-emerald-400', textColor: 'text-emerald-600 dark:text-emerald-400' },
];

// Custom SVG Test Badge renderer using IconRegistry for pixel-perfect medical icons
function TestBadgeIcon({ title, badgeText, iconBg, iconColor }: { title: string; badgeText?: string; iconBg: string; iconColor: string }) {
  const IconComponent = getTestIcon(title);

  if (IconComponent) {
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor} border border-slate-200/80 dark:border-slate-800 mx-auto shadow-2xs shrink-0`}>
        <IconComponent className="w-5 h-5 stroke-[1.8] stroke-current fill-none" />
      </div>
    );
  }

  // Fallback text badge for unmapped or custom user tests
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor} border border-slate-200/80 dark:border-slate-800 mx-auto shadow-2xs font-extrabold text-[11px] font-sans tracking-tight shrink-0`}>
      {badgeText || title.split(' ')[0]}
    </div>
  );
}

// Complete Blood Test data matching all 11 reference UI screenshots exactly
const BLOOD_TEST_SUBCATEGORIES: SubCategoryItem[] = [
  {
    name: 'Hematology',
    desc: 'Complete blood cell analysis and related tests',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-500 dark:text-rose-400',
    badgeIcon: Droplet,
    menuIcon: Droplet,
    tests: [
      { title: 'Complete Blood Count (CBC)', desc: 'Overall health summary including RBC, WBC, Platelets, Hb, etc.', badgeText: 'CBC', tags: ['CBC', 'Hemoglobin', 'Platelets', 'RBC', 'WBC'] },
      { title: 'Peripheral Blood Smear (PBS)', desc: 'Examination of blood cells under microscope', badgeText: 'PBS', tags: ['Blood Smear', 'Morphology'] },
      { title: 'Hemoglobin (Hb)', desc: 'Measures the amount of hemoglobin in blood', badgeText: 'Hb', tags: ['Hemoglobin', 'Anemia'] },
      { title: 'PCV / Hematocrit (HCT)', desc: 'Proportion of red blood cells in blood', badgeText: 'PCV', tags: ['PCV', 'Hematocrit'] },
      { title: 'ESR', desc: 'Erythrocyte Sedimentation Rate', badgeText: 'ESR', tags: ['ESR', 'Inflammation'] },
      { title: 'RBC Count', desc: 'Measures the number of red blood cells', badgeText: 'RBC', tags: ['RBC', 'Red Cells'] },
      { title: 'WBC Count', desc: 'Measures the number of white blood cells', badgeText: 'WBC', tags: ['WBC', 'Leukocytes'] },
      { title: 'Platelet Count', desc: 'Measures the number of platelets in blood', badgeText: 'PLT', tags: ['Platelets', 'Thrombocytes'] },
      { title: 'Blood Group & RH Typing', desc: 'Determine blood group and Rh factor', badgeText: 'ABO', tags: ['Blood Group', 'Rh Factor'] },
      { title: 'Bleeding Time (BT) / Clotting Time (CT)', desc: 'Assess blood clotting function', badgeText: 'BT/CT', tags: ['Bleeding Time', 'Clotting'] }
    ]
  },
  {
    name: 'Biochemistry',
    desc: 'Chemical analysis of blood to assess organ function and overall health',
    iconBg: 'bg-pink-50 dark:bg-pink-950/50',
    iconColor: 'text-pink-500 dark:text-pink-400',
    badgeIcon: TestTube,
    menuIcon: TestTube,
    tests: [
      { title: 'Liver Function Test (LFT)', desc: 'Assess liver health and its functioning', badgeText: 'LFT', tags: ['LFT', 'Liver'] },
      { title: 'Kidney Function Test (KFT)', desc: 'Evaluate kidney function and filtration', badgeText: 'KFT', tags: ['KFT', 'Kidney'] },
      { title: 'Lipid Profile', desc: 'Cholesterol, Triglycerides, HDL, LDL, VLDL, Total Cholesterol', badgeText: 'LIPID', tags: ['Lipid', 'Cholesterol', 'Triglycerides'] },
      { title: 'Blood Sugar (Fasting & PP)', desc: 'Fasting and Postprandial blood glucose levels', badgeText: 'GLU', tags: ['Glucose', 'Fasting Sugar', 'PPBS'] },
      { title: 'HbA1c', desc: 'Average blood sugar level over past 2–3 months', badgeText: 'A1C', tags: ['HbA1c', 'Glycated Hemoglobin'] },
      { title: 'Electrolytes', desc: 'Sodium, Potassium, Chloride, Bicarbonate, Calcium', badgeText: 'ELEC', tags: ['Electrolytes', 'Sodium', 'Potassium'] },
      { title: 'Uric Acid', desc: 'Detects uric acid levels in blood', badgeText: 'UA', tags: ['Uric Acid', 'Gout'] },
      { title: 'Calcium', desc: 'Total calcium level in blood', badgeText: 'Ca', tags: ['Calcium', 'Bone Health'] },
      { title: 'Phosphorus', desc: 'Phosphate levels in blood', badgeText: 'P', tags: ['Phosphorus', 'Phosphate'] },
      { title: 'Total Protein', desc: 'Total protein level in blood', badgeText: 'TP', tags: ['Total Protein', 'Albumin'] },
      { title: 'Albumin', desc: 'Albumin level in blood (Protein made by liver)', badgeText: 'ALB', tags: ['Albumin', 'Liver Protein'] },
      { title: 'Globulin', desc: 'Globulin level in blood (Immune proteins)', badgeText: 'GLOB', tags: ['Globulin', 'Immune Protein'] }
    ]
  },
  {
    name: 'Hormone & Endocrine',
    desc: 'Hormonal assays to evaluate endocrine gland function and balance',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeIcon: Activity,
    menuIcon: Activity,
    tests: [
      { title: 'Thyroid Profile (T3, T4, TSH)', desc: 'Evaluate thyroid gland function', badgeText: 'TFT', tags: ['Thyroid', 'T3', 'T4', 'TSH'] },
      { title: 'T3 (Triiodothyronine)', desc: 'Measures triiodothyronine level in blood', badgeText: 'T3', tags: ['T3', 'Thyroid'] },
      { title: 'T4 (Thyroxine)', desc: 'Measures thyroxine level in blood', badgeText: 'T4', tags: ['T4', 'Thyroxine'] },
      { title: 'TSH (Thyroid Stimulating Hormone)', desc: 'Assesses thyroid stimulating hormone level', badgeText: 'TSH', tags: ['TSH', 'Thyroid'] },
      { title: 'Free T3', desc: 'Free triiodothyronine level in blood', badgeText: 'FT3', tags: ['Free T3', 'Thyroid'] },
      { title: 'Free T4', desc: 'Free thyroxine level in blood', badgeText: 'FT4', tags: ['Free T4', 'Thyroid'] },
      { title: 'Cortisol (AM/PM)', desc: 'Stress hormone level evaluation', badgeText: 'CORT', tags: ['Cortisol', 'Adrenal'] },
      { title: 'Prolactin', desc: 'Assess prolactin hormone level', badgeText: 'PRL', tags: ['Prolactin', 'Pituitary'] },
      { title: 'LH (Luteinizing Hormone)', desc: 'Evaluation of reproductive hormone (LH)', badgeText: 'LH', tags: ['LH', 'Reproductive'] },
      { title: 'FSH (Follicle Stimulating Hormone)', desc: 'Evaluation of reproductive hormone (FSH)', badgeText: 'FSH', tags: ['FSH', 'Reproductive'] },
      { title: 'Estradiol (E2)', desc: 'Estrogen hormone level in blood', badgeText: 'E2', tags: ['Estradiol', 'Estrogen'] },
      { title: 'Testosterone', desc: 'Male hormone level evaluation', badgeText: 'TEST', tags: ['Testosterone', 'Androgen'] }
    ]
  },
  {
    name: 'Infectious Disease',
    desc: 'Tests to detect infections caused by bacteria, viruses, parasites and other pathogens',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    badgeIcon: Zap,
    menuIcon: Zap,
    tests: [
      { title: 'Typhoid (Widal Test)', desc: 'Detects Salmonella typhi infection', badgeText: 'WIDAL', tags: ['Typhoid', 'Widal', 'Salmonella'] },
      { title: 'Malaria Parasite (MP) Test', desc: 'Detects malaria parasite in blood', badgeText: 'MP', tags: ['Malaria', 'MP Test', 'Parasite'] },
      { title: 'Dengue NS1 Antigen', desc: 'Early detection of dengue infection', badgeText: 'NS1', tags: ['Dengue', 'NS1', 'Fever'] },
      { title: 'Dengue IgG & IgM Antibody', desc: 'Detects past and recent dengue infection', badgeText: 'DEN', tags: ['Dengue Antibody', 'IgG', 'IgM'] },
      { title: 'Chikungunya IgM', desc: 'Detects Chikungunya virus infection', badgeText: 'CHIK', tags: ['Chikungunya', 'Viral'] },
      { title: 'Leptospira IgM', desc: 'Detects Leptospira infection', badgeText: 'LEPTO', tags: ['Leptospira', 'Bacterial'] },
      { title: 'HIV 1 & 2 (ELISA)', desc: 'Screening test for HIV infection', badgeText: 'HIV', tags: ['HIV', 'ELISA', 'Serology'] },
      { title: 'HBsAg', desc: 'Hepatitis B surface antigen test', badgeText: 'HBsAg', tags: ['Hepatitis B', 'HBsAg'] },
      { title: 'Anti HCV', desc: 'Hepatitis C virus antibody test', badgeText: 'HCV', tags: ['Hepatitis C', 'Anti-HCV'] },
      { title: 'VDRL / RPR', desc: 'Screening test for syphilis infection', badgeText: 'VDRL', tags: ['VDRL', 'Syphilis', 'RPR'] },
      { title: 'TB (AFB) Test', desc: 'Detects Mycobacterium tuberculosis', badgeText: 'AFB', tags: ['Tuberculosis', 'TB', 'AFB'] },
      { title: 'CRP (C-Reactive Protein)', desc: 'Detects inflammation due to infections', badgeText: 'CRP', tags: ['CRP', 'Inflammation'] }
    ]
  },
  {
    name: 'Liver Function (LFT)',
    desc: 'Tests to assess liver health and its ability to function properly',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-500 dark:text-amber-400',
    badgeIcon: Flame,
    menuIcon: Flame,
    tests: [
      { title: 'SGOT (AST)', desc: 'Aspartate Aminotransferase enzyme level', badgeText: 'SGOT', tags: ['SGOT', 'AST', 'Liver Enzyme'] },
      { title: 'SGPT (ALT)', desc: 'Alanine Aminotransferase enzyme level', badgeText: 'SGPT', tags: ['SGPT', 'ALT', 'Liver Enzyme'] },
      { title: 'Alkaline Phosphatase (ALP)', desc: 'Alkaline Phosphatase enzyme level', badgeText: 'ALP', tags: ['ALP', 'Alkaline Phosphatase'] },
      { title: 'GGT (Gamma GT)', desc: 'Gamma Glutamyl Transferase enzyme level', badgeText: 'GGT', tags: ['GGT', 'Gamma GT'] },
      { title: 'Total Bilirubin', desc: 'Measures total bilirubin in blood', badgeText: 'TBIL', tags: ['Total Bilirubin', 'Jaundice'] },
      { title: 'Direct Bilirubin', desc: 'Measures direct (conjugated) bilirubin in blood', badgeText: 'DBIL', tags: ['Direct Bilirubin', 'Conjugated'] },
      { title: 'Indirect Bilirubin', desc: 'Measures indirect (unconjugated) bilirubin', badgeText: 'IBIL', tags: ['Indirect Bilirubin', 'Jaundice'] },
      { title: 'Total Protein', desc: 'Measures total protein in blood', badgeText: 'TPROT', tags: ['Total Protein', 'Liver'] },
      { title: 'Albumin', desc: 'Measures albumin level in blood', badgeText: 'ALB', tags: ['Albumin', 'Serum Protein'] },
      { title: 'Globulin', desc: 'Measures globulin level in blood', badgeText: 'GLOB', tags: ['Globulin', 'Serum Protein'] },
      { title: 'A/G Ratio', desc: 'Albumin to Globulin ratio', badgeText: 'A/G', tags: ['A/G Ratio', 'Albumin Globulin'] },
      { title: 'LDH (Lactate Dehydrogenase)', desc: 'Lactate Dehydrogenase enzyme level', badgeText: 'LDH', tags: ['LDH', 'Enzyme'] }
    ]
  },
  {
    name: 'Kidney Function (KFT)',
    desc: 'Tests to evaluate kidney health and filtration function',
    iconBg: 'bg-[#EEF2FF] dark:bg-indigo-950/50',
    iconColor: 'text-[#4F46E5] dark:text-indigo-400',
    badgeIcon: Shield,
    menuIcon: Shield,
    tests: [
      { title: 'Serum Creatinine', desc: 'Measures creatinine level in blood', badgeText: 'CREAT', tags: ['Creatinine', 'Renal', 'KFT'] },
      { title: 'Blood Urea', desc: 'Measures urea level in blood', badgeText: 'UREA', tags: ['Urea', 'Renal Function'] },
      { title: 'BUN', desc: 'Blood Urea Nitrogen level', badgeText: 'BUN', tags: ['BUN', 'Blood Urea Nitrogen'] },
      { title: 'Uric Acid', desc: 'Measures uric acid level in blood', badgeText: 'UA', tags: ['Uric Acid', 'Gout'] },
      { title: 'eGFR', desc: 'Estimated Glomerular Filtration Rate', badgeText: 'eGFR', tags: ['eGFR', 'Glomerular Filtration'] },
      { title: 'Sodium (Na+)', desc: 'Measures sodium level in blood', badgeText: 'Na+', tags: ['Sodium', 'Electrolytes'] },
      { title: 'Potassium (K+)', desc: 'Measures potassium level in blood', badgeText: 'K+', tags: ['Potassium', 'Electrolytes'] },
      { title: 'Chloride (Cl-)', desc: 'Measures chloride level in blood', badgeText: 'Cl-', tags: ['Chloride', 'Electrolytes'] },
      { title: 'Calcium', desc: 'Measures calcium level in blood', badgeText: 'Ca', tags: ['Calcium', 'KFT'] },
      { title: 'Phosphorus', desc: 'Measures phosphorus level in blood', badgeText: 'P', tags: ['Phosphorus', 'Phosphate'] },
      { title: 'Magnesium', desc: 'Measures magnesium level in blood', badgeText: 'Mg', tags: ['Magnesium', 'KFT'] },
      { title: 'Bicarbonate (HCO3-)', desc: 'Measures bicarbonate level in blood', badgeText: 'HCO3', tags: ['Bicarbonate', 'Acid-Base'] }
    ]
  },
  {
    name: 'Cardiac Markers',
    desc: 'Tests to assess heart health and detect cardiac injury or stress',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeIcon: Heart,
    menuIcon: Heart,
    tests: [
      { title: 'Troponin I', desc: 'Highly specific marker for heart muscle injury', badgeText: 'TnI', tags: ['Troponin I', 'Cardiac Injury', 'MI'] },
      { title: 'Troponin T', desc: 'Specific marker for cardiac injury', badgeText: 'TnT', tags: ['Troponin T', 'Cardiac Injury'] },
      { title: 'CK-MB', desc: 'Creatine Kinase – MB isoenzyme', badgeText: 'CK-MB', tags: ['CK-MB', 'Myocardial Injury'] },
      { title: 'BNP', desc: 'B-type Natriuretic Peptide', badgeText: 'BNP', tags: ['BNP', 'Heart Failure'] },
      { title: 'NT-proBNP', desc: 'N-terminal pro B-type Natriuretic Peptide', badgeText: 'NT-pro', tags: ['NT-proBNP', 'Heart Failure'] },
      { title: 'Myoglobin', desc: 'Early marker for muscle injury', badgeText: 'MYO', tags: ['Myoglobin', 'Muscle Injury'] },
      { title: 'LDH', desc: 'Lactate Dehydrogenase – indicator of tissue damage', badgeText: 'LDH', tags: ['LDH', 'Tissue Damage'] },
      { title: 'hs-CRP', desc: 'High sensitivity C-Reactive Protein (inflammation marker)', badgeText: 'hs-CRP', tags: ['hs-CRP', 'Cardiac Risk'] },
      { title: 'D-Dimer', desc: 'Marker for clot formation and breakdown', badgeText: 'DD', tags: ['D-Dimer', 'Thrombosis', 'Clotting'] },
      { title: 'Homocysteine', desc: 'Amino acid associated with cardiovascular risk', badgeText: 'HCY', tags: ['Homocysteine', 'Cardiovascular Risk'] }
    ]
  },
  {
    name: 'Diabetes / Glucose',
    desc: 'Tests to evaluate blood sugar levels and diabetes control',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeIcon: CircleDot,
    menuIcon: CircleDot,
    tests: [
      { title: 'Fasting Blood Sugar (FBS)', desc: 'Measures blood glucose after an overnight fast', badgeText: 'FBS', tags: ['FBS', 'Fasting Glucose', 'Diabetes'] },
      { title: 'Postprandial Blood Sugar (PPBS)', desc: 'Measures blood glucose 2 hours after meal', badgeText: 'PPBS', tags: ['PPBS', 'Postprandial', 'Glucose'] },
      { title: 'Random Blood Sugar (RBS)', desc: 'Measures blood glucose at any random time', badgeText: 'RBS', tags: ['RBS', 'Random Glucose'] },
      { title: 'HbA1c', desc: 'Average blood glucose control over 2–3 months', badgeText: 'HbA1c', tags: ['HbA1c', 'Glycated Hemoglobin'] },
      { title: 'Oral Glucose Tolerance Test (OGTT)', desc: "Assesses body's response to glucose load", badgeText: 'OGTT', tags: ['OGTT', 'Glucose Tolerance'] },
      { title: 'Fasting Insulin', desc: 'Measures baseline insulin level', badgeText: 'INS', tags: ['Insulin', 'Fasting Insulin'] },
      { title: 'C-Peptide', desc: 'Reflects endogenous insulin production', badgeText: 'C-Pep', tags: ['C-Peptide', 'Insulin Secretion'] },
      { title: 'Fructosamine', desc: 'Average blood glucose control over 2–3 weeks', badgeText: 'FRUC', tags: ['Fructosamine', 'Glycemic Control'] },
      { title: 'GAD Antibody', desc: 'Helps in diagnosis of Type 1 Diabetes', badgeText: 'GAD', tags: ['GAD Antibody', 'Type 1 Diabetes'] }
    ]
  },
  {
    name: 'Iron Studies',
    desc: 'Tests to evaluate iron status and detect iron deficiency or overload',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeIcon: Layers,
    menuIcon: Layers,
    tests: [
      { title: 'Serum Iron', desc: 'Measures the level of iron in the blood', badgeText: 'Fe', tags: ['Serum Iron', 'Iron Deficiency'] },
      { title: 'Serum Ferritin', desc: 'Reflects body iron stores and deficiency', badgeText: 'FERR', tags: ['Ferritin', 'Iron Stores'] },
      { title: 'Total Iron Binding Capacity (TIBC)', desc: "Measures the blood's capacity to bind iron", badgeText: 'TIBC', tags: ['TIBC', 'Iron Binding'] },
      { title: 'Unsaturated Iron Binding Capacity (UIBC)', desc: 'Indicates iron binding capacity not bound to iron', badgeText: 'UIBC', tags: ['UIBC', 'Unsaturated Iron'] },
      { title: 'Transferrin', desc: 'Main protein that binds and transports iron', badgeText: 'TRSF', tags: ['Transferrin', 'Iron Transport'] },
      { title: 'Transferrin Saturation', desc: 'Percentage of transferrin saturated with iron', badgeText: '%Sat', tags: ['Transferrin Saturation', 'Iron'] },
      { title: 'Soluble Transferrin Receptor (sTfR)', desc: 'Helps detect iron deficiency even in chronic disease', badgeText: 'sTfR', tags: ['sTfR', 'Iron Deficiency'] },
      { title: 'Reticulocyte Hemoglobin Content (Ret-He)', desc: 'Indicates available iron for red blood cell production', badgeText: 'Ret-He', tags: ['Ret-He', 'Erythropoiesis'] }
    ]
  },
  {
    name: 'Vitamins & Minerals',
    desc: 'Tests to assess vitamin and mineral levels for better health & immunity',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeIcon: Sun,
    menuIcon: Sun,
    tests: [
      { title: 'Vitamin D (25-OH)', desc: 'Measures vitamin D level for bone & immunity', badgeText: 'Vit D', tags: ['Vitamin D', '25-OH', 'Bone Health'] },
      { title: 'Vitamin B12', desc: 'Essential for nerve function and red blood cell formation', badgeText: 'B12', tags: ['Vitamin B12', 'Cyanocobalamin'] },
      { title: 'Folate (Vitamin B9)', desc: 'Important for cell growth and DNA synthesis', badgeText: 'B9', tags: ['Folate', 'Vitamin B9', 'Folic Acid'] },
      { title: 'Vitamin A', desc: 'Supports vision, immunity and skin health', badgeText: 'Vit A', tags: ['Vitamin A', 'Retinol'] },
      { title: 'Vitamin E', desc: 'Powerful antioxidant for cell protection', badgeText: 'Vit E', tags: ['Vitamin E', 'Tocopherol'] },
      { title: 'Vitamin K', desc: 'Essential for blood clotting and bone health', badgeText: 'Vit K', tags: ['Vitamin K', 'Coagulation'] },
      { title: 'Vitamin C', desc: 'Supports immunity and wound healing', badgeText: 'Vit C', tags: ['Vitamin C', 'Ascorbic Acid'] },
      { title: 'Zinc', desc: 'Supports immunity, growth and cell repair', badgeText: 'Zn', tags: ['Zinc', 'Trace Mineral'] },
      { title: 'Copper', desc: 'Essential for iron metabolism and enzyme function', badgeText: 'Cu', tags: ['Copper', 'Ceruloplasmin'] },
      { title: 'Selenium', desc: 'Antioxidant mineral for cell protection', badgeText: 'Se', tags: ['Selenium', 'Antioxidant'] },
      { title: 'Magnesium', desc: 'Supports muscles, nerves and energy production', badgeText: 'Mg', tags: ['Magnesium', 'Electrolyte'] },
      { title: 'Calcium', desc: 'Essential for bones, teeth and muscle function', badgeText: 'Ca', tags: ['Calcium', 'Bone Health'] }
    ]
  },
  {
    name: 'Others',
    desc: 'Specialized and advanced blood investigations',
    iconBg: 'bg-[#EEF2FF] dark:bg-indigo-950/50',
    iconColor: 'text-[#4F46E5] dark:text-indigo-400',
    badgeIcon: Crosshair,
    menuIcon: Crosshair,
    tests: [
      { title: 'ANA (ANA Screen)', desc: 'Antinuclear Antibody Screening', badgeText: 'ANA', tags: ['ANA', 'Antinuclear Antibody', 'Autoimmune'] },
      { title: 'ANCA', desc: 'Anti Neutrophil Cytoplasmic Antibody', badgeText: 'ANCA', tags: ['ANCA', 'Vasculitis'] },
      { title: 'Anti-dsDNA', desc: 'Anti Double Stranded DNA Antibody', badgeText: 'dsDNA', tags: ['Anti-dsDNA', 'Lupus', 'SLE'] },
      { title: 'Rheumatoid Factor (RF)', desc: 'Helps in diagnosing rheumatoid arthritis', badgeText: 'RF', tags: ['Rheumatoid Factor', 'RF', 'Arthritis'] },
      { title: 'Anti-CCP', desc: 'Anti Cyclic Citrullinated Peptide Antibody', badgeText: 'aCCP', tags: ['Anti-CCP', 'Rheumatoid'] },
      { title: 'Procalcitonin (PCT)', desc: 'Marker for bacterial infection & sepsis', badgeText: 'PCT', tags: ['Procalcitonin', 'Sepsis', 'Infection'] },
      { title: 'Interleukin-6 (IL-6)', desc: 'Inflammation and immune response marker', badgeText: 'IL-6', tags: ['Interleukin-6', 'IL-6', 'Cytokine'] },
      { title: 'D-Dimer', desc: 'Helps in detecting blood clots (thrombosis)', badgeText: 'DD', tags: ['D-Dimer', 'Thrombosis', 'Clotting'] },
      { title: 'Beta-hCG', desc: 'Pregnancy hormone quantitative test', badgeText: 'hCG', tags: ['Beta-hCG', 'Pregnancy'] },
      { title: 'PSA', desc: 'Prostate Specific Antigen (For prostate health)', badgeText: 'PSA', tags: ['PSA', 'Prostate'] },
      { title: 'CA-125', desc: 'Tumor marker for ovarian cancer monitoring', badgeText: 'CA125', tags: ['CA-125', 'Ovarian Tumor Marker'] },
      { title: 'CA 19-9', desc: 'Tumor marker for pancreatic & GI cancers', badgeText: 'CA199', tags: ['CA 19-9', 'Pancreatic Marker'] },
      { title: 'CEA', desc: 'Carcinoembryonic Antigen (Tumor marker)', badgeText: 'CEA', tags: ['CEA', 'Carcinoembryonic'] },
      { title: 'AFP', desc: 'Alpha Fetoprotein (Liver tumor marker)', badgeText: 'AFP', tags: ['AFP', 'Alpha Fetoprotein'] },
      { title: 'Ferritin', desc: 'Iron storage protein (Tumor & inflammation marker)', badgeText: 'FERR', tags: ['Ferritin', 'Inflammation Marker'] }
    ]
  }
];

// Pathology / Biopsy Subcategories matching reference UI
const PATHOLOGY_SUBCATEGORIES: SubCategoryItem[] = [
  {
    name: 'Cytology',
    desc: 'Microscopic examination of individual cells and fluid aspirates',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeIcon: MedicalIcons.IconCytologyCell,
    menuIcon: MedicalIcons.IconCytologyCell,
    tests: [
      { title: 'FNAC (Fine Needle Aspiration Cytology)', desc: 'Diagnostic procedure using thin needle to sample cells', badgeText: 'FNAC', tags: ['FNAC', 'Aspiration', 'Cytology'] },
      { title: 'Pap Smear', desc: 'Screening test for cervical cell abnormalities', badgeText: 'PAP', tags: ['Pap Smear', 'Cervical', 'Screening'] },
      { title: 'Fluid Cytology (Pleural / Ascitic)', desc: 'Microscopic cell analysis of body cavity fluids', badgeText: 'FLUID', tags: ['Fluid', 'Pleural', 'Ascitic'] },
      { title: 'Sputum Cytology', desc: 'Examination of sputum cells for respiratory conditions', badgeText: 'SPUT', tags: ['Sputum', 'Respiratory'] },
      { title: 'Urine Cytology', desc: 'Detection of atypical or cancerous cells in urine', badgeText: 'URINE', tags: ['Urine Cytology', 'Urothelial'] }
    ]
  },
  {
    name: 'Histopathology (Biopsy)',
    desc: 'Microscopic analysis of tissue biopsy samples for disease diagnosis',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeIcon: MedicalIcons.IconBiopsySlide,
    menuIcon: MedicalIcons.IconBiopsySlide,
    tests: [
      { title: 'Small Tissue Biopsy (Punch / Core)', desc: 'Histopathological evaluation of small tissue specimen', badgeText: 'BIOPSY', tags: ['Biopsy', 'Core', 'Punch'] },
      { title: 'Large Resection Specimen', desc: 'Comprehensive examination of surgically excised organ/tissue', badgeText: 'RESECT', tags: ['Resection', 'Surgical Specimen'] },
      { title: 'Endoscopic Biopsy', desc: 'Biopsy sample collected during endoscopic procedure', badgeText: 'ENDO', tags: ['Endoscopic', 'GI Biopsy'] },
      { title: 'Skin Biopsy', desc: 'Histopathology of skin lesion or rash sample', badgeText: 'SKIN', tags: ['Skin', 'Dermatopathology'] }
    ]
  },
  {
    name: 'Hematopathology',
    desc: 'Pathology of blood, bone marrow, and lymph tissue disorders',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeIcon: Droplet,
    menuIcon: Droplet,
    tests: [
      { title: 'Bone Marrow Aspiration & Biopsy', desc: 'Comprehensive evaluation of bone marrow cells and structure', badgeText: 'BMA', tags: ['Bone Marrow', 'Biopsy', 'Leukemia'] },
      { title: 'Lymph Node Biopsy', desc: 'Histopathological examination for lymphoma or metastasis', badgeText: 'LN', tags: ['Lymph Node', 'Lymphoma'] }
    ]
  },
  {
    name: 'Immunohistochemistry (IHC)',
    desc: 'Specialized antibody staining to classify tumors and biomarker expression',
    iconBg: 'bg-pink-50 dark:bg-pink-950/50',
    iconColor: 'text-pink-600 dark:text-pink-400',
    badgeIcon: MedicalIcons.IconAntibodyY,
    menuIcon: MedicalIcons.IconAntibodyY,
    tests: [
      { title: 'ER / PR / HER2 Neu Panel', desc: 'Breast cancer biomarker receptor panel', badgeText: 'IHC3', tags: ['ER', 'PR', 'HER2', 'Breast Panel'] },
      { title: 'Ki-67 Proliferation Index', desc: 'Measures cellular proliferation rate in tumors', badgeText: 'Ki67', tags: ['Ki-67', 'Proliferation'] },
      { title: 'PD-L1 Expression', desc: 'Immunotherapy biomarker response predictor', badgeText: 'PD-L1', tags: ['PD-L1', 'Immunotherapy'] },
      { title: 'Single Marker IHC Staining', desc: 'Targeted single antibody marker evaluation', badgeText: 'IHC1', tags: ['IHC', 'Antibody'] }
    ]
  },
  {
    name: 'Molecular Pathology',
    desc: 'DNA & RNA molecular diagnostics for genetic mutations and targeted therapy',
    iconBg: 'bg-violet-50 dark:bg-violet-950/50',
    iconColor: 'text-violet-600 dark:text-violet-400',
    badgeIcon: MedicalIcons.IconDNAStrand,
    menuIcon: MedicalIcons.IconDNAStrand,
    tests: [
      { title: 'EGFR Mutation Analysis', desc: 'Targeted mutation analysis for lung adenocarcinoma', badgeText: 'EGFR', tags: ['EGFR', 'Lung Cancer'] },
      { title: 'KRAS / NRAS / BRAF Panel', desc: 'Colorectal and melanoma mutation profiling', badgeText: 'RAS', tags: ['KRAS', 'BRAF', 'Mutation'] },
      { title: 'BRCA 1 & 2 Gene Testing', desc: 'Hereditary breast and ovarian cancer risk analysis', badgeText: 'BRCA', tags: ['BRCA1', 'BRCA2', 'Hereditary'] },
      { title: 'FISH (Fluorescence In Situ Hybridization)', desc: 'Chromosomal translocation and gene amplification', badgeText: 'FISH', tags: ['FISH', 'Chromosomal'] }
    ]
  },
  {
    name: 'Flow Cytometry',
    desc: 'Laser-based biophysical analysis of cellular markers for leukemia and lymphoma',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/50',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badgeIcon: Zap,
    menuIcon: Zap,
    tests: [
      { title: 'Leukemia / Lymphoma Immunophenotyping', desc: 'Multi-color flow cytometry marker panel', badgeText: 'FLOW', tags: ['Flow Cytometry', 'Leukemia', 'Lymphoma'] },
      { title: 'CD4 / CD8 Count', desc: 'T-cell subset enumeration for immune status', badgeText: 'CD4', tags: ['CD4', 'CD8', 'T-Cell'] }
    ]
  },
  {
    name: 'Special Stains',
    desc: 'Specialized chemical staining for tissue elements and microorganisms',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeIcon: MedicalIcons.IconScalpel,
    menuIcon: MedicalIcons.IconScalpel,
    tests: [
      { title: 'PAS (Periodic Acid-Schiff) Stain', desc: 'Detects glycogen, mucins and fungal organisms', badgeText: 'PAS', tags: ['PAS', 'Special Stain', 'Fungal'] },
      { title: 'Ziehl-Neelsen (AFB) Stain', desc: 'Specialized acid-fast stain for mycobacteria', badgeText: 'ZN', tags: ['AFB', 'Ziehl-Neelsen', 'TB'] },
      { title: 'Grocott Silver (GMS) Stain', desc: 'Fungal visualization stain in histology', badgeText: 'GMS', tags: ['GMS', 'Fungi', 'Histology'] }
    ]
  },
  {
    name: 'Frozen Section',
    desc: 'Intraoperative rapid diagnosis using frozen tissue sections to guide surgical decisions',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeIcon: MedicalIcons.IconSnowflake,
    menuIcon: MedicalIcons.IconSnowflake,
    tests: [
      { title: 'General Frozen Section', desc: 'Rapid diagnosis for intraoperative decision making', badgeText: 'FROZEN', tags: ['Frozen Section', 'Intraoperative'] },
      { title: 'Brain Tumor Frozen Section', desc: 'Assessment of brain lesions and tumor margins', badgeText: 'BRAIN', tags: ['Brain', 'Neuro', 'Frozen'] },
      { title: 'Breast Lump Frozen Section', desc: 'Determine nature of lesion (benign vs malignant)', badgeText: 'BREAST', tags: ['Breast', 'Frozen'] },
      { title: 'Thyroid Nodule Frozen Section', desc: 'Evaluation of thyroid nodules during surgery', badgeText: 'THYROID', tags: ['Thyroid', 'Frozen'] },
      { title: 'Renal (Kidney) Frozen Section', desc: 'Assessment of renal masses and margins', badgeText: 'RENAL', tags: ['Renal', 'Kidney', 'Frozen'] },
      { title: 'Liver Lesion Frozen Section', desc: 'Intraoperative evaluation of liver lesions', badgeText: 'LIVER', tags: ['Liver', 'Frozen'] },
      { title: 'Lung Nodule Frozen Section', desc: 'Rapid diagnosis of pulmonary nodules and masses', badgeText: 'LUNG', tags: ['Lung', 'Pulmonary', 'Frozen'] },
      { title: 'Ovarian Mass Frozen Section', desc: 'Differentiation of benign and malignant masses', badgeText: 'OVARIAN', tags: ['Ovarian', 'Frozen'] },
      { title: 'Lymph Node Frozen Section', desc: 'Assessment of lymph node involvement', badgeText: 'LYMPH', tags: ['Lymph Node', 'Metastasis'] },
      { title: 'Margin Assessment Frozen Section', desc: 'Check surgical margins for tumor clearance', badgeText: 'MARGIN', tags: ['Margin', 'Surgical Clearance'] }
    ]
  }
];

// Fallback generator for non-blood categories
function getCategorySubData(catId: string, catName: string): SubCategoryItem[] {
  if (catId === 'blood') return BLOOD_TEST_SUBCATEGORIES;
  if (catId === 'pathology') return PATHOLOGY_SUBCATEGORIES;

  const catObj = MAIN_CATEGORIES.find((c) => c.id === catId) || MAIN_CATEGORIES[0];

  return [
    {
      name: `General ${catName}`,
      desc: `Standard diagnostic reporting for ${catName}`,
      iconBg: catObj.iconBg,
      iconColor: catObj.iconColor,
      badgeIcon: catObj.icon,
      menuIcon: catObj.icon,
      tests: [
        { title: `${catName} - Standard Report`, desc: `Comprehensive summary and findings for ${catName}`, badgeText: 'STD', tags: [catName, 'Diagnostic'] },
        { title: `${catName} - Follow-up / Serial`, desc: `Comparative serial assessment for ${catName}`, badgeText: 'SER', tags: [catName, 'Follow-up'] },
        { title: `${catName} - Urgent / Emergency`, desc: `Priority emergency imaging or test findings`, badgeText: 'EMG', tags: [catName, 'Emergency'] },
      ]
    },
    {
      name: `Specialized ${catName}`,
      desc: `Advanced contrast, targeted or sub-specialty ${catName} protocols`,
      iconBg: catObj.iconBg,
      iconColor: catObj.iconColor,
      badgeIcon: Microscope,
      menuIcon: Microscope,
      tests: [
        { title: `${catName} - Advanced Protocol`, desc: `High resolution / contrast-enhanced study`, badgeText: 'ADV', tags: [catName, 'Specialized'] },
        { title: `${catName} - Guided Procedure / Biopsy`, desc: `Interventional guided study procedure`, badgeText: 'PROC', tags: [catName, 'Procedure'] },
      ]
    }
  ];
}

interface SelectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selection: ReportSelection) => void;
}

export default function SelectReportModal({ isOpen, onClose, onSelect }: SelectReportModalProps) {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('blood');
  const [selectedSubCatIndex, setSelectedSubCatIndex] = useState<number>(0);
  const [selectedTestTitle, setSelectedTestTitle] = useState<string>('Complete Blood Count (CBC)');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const currentMainCatObj = MAIN_CATEGORIES.find((c) => c.id === selectedMainCat) || MAIN_CATEGORIES[0];
  const subCategoriesList = getCategorySubData(selectedMainCat, currentMainCatObj.name);
  const activeSubCat = subCategoriesList[selectedSubCatIndex] || subCategoriesList[0];

  const filteredTests = activeSubCat.tests.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleConfirmSelect = (testItem: { title: string; tags: string[] }) => {
    onSelect({
      mainCategory: currentMainCatObj.name,
      subCategory: `${activeSubCat.name} - ${testItem.title}`,
      testItem: testItem.title,
      tags: testItem.tags,
    });
    onClose();
  };

  const HeaderIcon = activeSubCat.badgeIcon || Activity;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-2 sm:p-5 overflow-y-auto">
      <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl max-w-[96vw] xl:max-w-[1440px] w-full h-[92vh] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar matching "Add Report" reference UI */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#0B132B] dark:text-white font-sans">
                Add Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Select the type of report you want to upload
              </p>
            </div>
          </div>

          {/* Search box on right */}
          <div className="relative hidden md:flex items-center w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subcategory..."
              className="w-full pl-9 pr-4 h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-sans leading-none"
            />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          
          {/* STEP 1: Choose Main Category Horizontal Row matching UI reference */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100 tracking-wide uppercase">
                Choose Main Category
              </h3>
            </div>

            {/* Main Category Cards Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {MAIN_CATEGORIES.map((cat) => {
                const isActive = selectedMainCat === cat.id;
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedMainCat(cat.id);
                      setSelectedSubCatIndex(0);
                    }}
                    className={`relative flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border transition-all duration-200 select-none ${
                      isActive
                        ? `${cat.iconBg} ${cat.textColor} border-current ring-2 ring-current/20 shadow-xs font-bold scale-[1.02]`
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/80 font-medium'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-colors ${
                      isActive ? 'bg-white dark:bg-slate-800 shadow-2xs ' + cat.iconColor : cat.color
                    }`}>
                      <IconComponent className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight truncate w-full">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Choose Subcategory & Grid matching UI reference */}
          <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100 tracking-wide uppercase">
                  Choose Subcategory – <span className={currentMainCatObj.textColor}>{currentMainCatObj.name}</span>
                </h3>
              </div>

              {/* Search box on mobile */}
              <div className="relative md:hidden flex items-center w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none stroke-[2]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subcategory..."
                  className="w-full pl-9 pr-4 h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-sans leading-none"
                />
              </div>
            </div>

            {/* Split layout: Subcategory Menu (Left) + Subcategory Test Cards (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
              
              {/* Left Subcategory Vertical List with individual colorful icons */}
              <div className="md:col-span-3 lg:col-span-3 xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-1.5 space-y-0.5 shadow-2xs">
                {subCategoriesList.map((sub, idx) => {
                  const isActive = selectedSubCatIndex === idx;
                  const MenuIcon = sub.menuIcon || Activity;
                  return (
                    <button
                      key={sub.name}
                      onClick={() => {
                        setSelectedSubCatIndex(idx);
                        if (sub.tests.length > 0) setSelectedTestTitle(sub.tests[0].title);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center justify-between transition-all ${
                        isActive
                          ? `${sub.iconBg} ${sub.iconColor} font-bold shadow-2xs border border-current/20`
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="truncate flex items-center gap-2">
                        <MenuIcon className={`w-3.5 h-3.5 shrink-0 ${sub.iconColor}`} />
                        {sub.name}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? `${sub.iconColor} translate-x-0.5` : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Cards Area */}
              <div className="md:col-span-9 lg:col-span-9 xl:col-span-10 space-y-3">
                
                {/* Active Subcategory Banner Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-2xs flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${activeSubCat.iconBg} ${activeSubCat.iconColor} border border-slate-200/80 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-2xs`}>
                    <HeaderIcon className="w-5 h-5 stroke-[2] stroke-current fill-none" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B132B] dark:text-white font-sans">
                      {activeSubCat.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {activeSubCat.desc}
                    </p>
                  </div>
                </div>

                {/* Test Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filteredTests.map((test) => {
                    const isSelected = selectedTestTitle === test.title;
                    return (
                      <div
                        key={test.title}
                        onClick={() => setSelectedTestTitle(test.title)}
                        className={`bg-white dark:bg-slate-900 border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2 min-h-[140px] relative group hover:shadow-md ${
                          isSelected
                            ? `border-current ring-2 ring-current/20 ${activeSubCat.iconBg} ${activeSubCat.iconColor}`
                            : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        {/* Custom SVG Test Badge graphic matching reference UI */}
                        <TestBadgeIcon
                          title={test.title}
                          badgeText={test.badgeText}
                          iconBg={activeSubCat.iconBg}
                          iconColor={activeSubCat.iconColor}
                        />

                        <div className="text-center space-y-0.5 w-full">
                          <h5 className="text-[11px] font-bold text-[#0B132B] dark:text-white leading-snug">
                            {test.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2 font-medium leading-tight">
                            {test.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer Bar with Next button matching reference */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium truncate max-w-md">
            Selected: <span className="font-bold text-[#0B132B] dark:text-white">{currentMainCatObj.name} → {activeSubCat.name} ({selectedTestTitle})</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const currentTest = activeSubCat.tests.find((t) => t.title === selectedTestTitle) || activeSubCat.tests[0];
                handleConfirmSelect(currentTest);
              }}
              className="px-6 py-2.5 bg-[#0B132B] hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              Next
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
