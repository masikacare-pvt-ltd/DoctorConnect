import { useState } from 'react';
import {
  ArrowLeft, Search, Check, ChevronRight,
  Droplet, TestTube, Activity, Microscope,
  Radio, HeartPulse, Stethoscope, Dna, FileText, MoreHorizontal,
  Flame, Shield, Zap, CircleDot, Layers, Heart, Sun, Crosshair
} from 'lucide-react';

export interface ReportSelection {
  mainCategory: string;
  subCategory: string;
  testItem: string;
  tags: string[];
}

// Main categories matching Step 1 in UI reference
const MAIN_CATEGORIES = [
  { id: 'blood', name: 'Blood Test', icon: Droplet, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200' },
  { id: 'urine', name: 'Urine Test', icon: TestTube, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
  { id: 'stool', name: 'Stool Test', icon: TestTube, color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
  { id: 'pathology', name: 'Pathology / Biopsy', icon: Microscope, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200' },
  { id: 'xray', name: 'X-Ray', icon: Radio, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200' },
  { id: 'usg', name: 'Ultrasound (USG)', icon: Activity, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' },
  { id: 'mri', name: 'MRI', icon: Activity, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200' },
  { id: 'ct', name: 'CT Scan', icon: Radio, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40 border-violet-200' },
  { id: 'ecg', name: 'ECG / Echo', icon: HeartPulse, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/40 border-pink-200' },
  { id: 'endoscopy', name: 'Endoscopy', icon: Stethoscope, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-200' },
  { id: 'genetic', name: 'Genetic Test', icon: Dna, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' },
  { id: 'checkup', name: 'Health Checkup Report', icon: FileText, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200' },
  { id: 'others', name: 'Others', icon: MoreHorizontal, color: 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200' },
];

export interface SubCategoryItem {
  name: string;
  desc: string;
  iconBg: string;
  iconColor: string;
  badgeIcon: any;
  tests: { title: string; desc: string; badgeText?: string; tags: string[] }[];
}

// Complete Blood Test data matching all 11 reference UI screenshots exactly
const BLOOD_TEST_SUBCATEGORIES: SubCategoryItem[] = [
  {
    name: 'Hematology',
    desc: 'Complete blood cell analysis and related tests',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
    iconColor: 'text-rose-500 dark:text-rose-400',
    badgeIcon: Droplet,
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

// Fallback generator for non-blood categories
function getCategorySubData(catId: string, catName: string): SubCategoryItem[] {
  if (catId === 'blood') return BLOOD_TEST_SUBCATEGORIES;
  return [
    {
      name: `General ${catName}`,
      desc: `Standard diagnostic reporting for ${catName}`,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      badgeIcon: Activity,
      tests: [
        { title: `${catName} - Standard Report`, desc: `Comprehensive summary and findings for ${catName}`, badgeText: 'STD', tags: [catName, 'Diagnostic'] },
        { title: `${catName} - Follow-up / Serial`, desc: `Comparative serial assessment for ${catName}`, badgeText: 'SER', tags: [catName, 'Follow-up'] },
        { title: `${catName} - Urgent / Emergency`, desc: `Priority emergency imaging or test findings`, badgeText: 'EMG', tags: [catName, 'Emergency'] },
      ]
    },
    {
      name: `Specialized ${catName}`,
      desc: `Advanced contrast, targeted or sub-specialty ${catName} protocols`,
      iconBg: 'bg-purple-50 dark:bg-purple-950/50',
      iconColor: 'text-purple-600 dark:text-purple-400',
      badgeIcon: Microscope,
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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar matching "Add Report" reference UI */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#0B132B] dark:text-white font-sans">
                Add Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Select the type of report you want to upload
              </p>
            </div>
          </div>

          {/* Search box on right */}
          <div className="relative hidden md:block w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subcategory..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* STEP 1: Choose Main Category Horizontal Row matching UI reference */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <h3 className="text-xs font-bold text-[#0B132B] dark:text-slate-100 tracking-wide uppercase">
                Choose Main Category
              </h3>
            </div>

            {/* Main Category Cards Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
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
                    className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl min-w-[100px] border transition-all shrink-0 select-none ${
                      isActive
                        ? 'bg-[#0B132B] text-white border-[#0B132B] shadow-md scale-102'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                      isActive ? 'bg-white/10 text-white' : cat.color
                    }`}>
                      <IconComponent className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className={`text-[11px] font-bold text-center leading-tight ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                      {cat.name}
                    </span>

                    {/* Pointer triangle pointing down for active item matching screenshot */}
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#0B132B]" />
                    )}
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
                  Choose Subcategory – <span className="text-blue-600 dark:text-blue-400">{currentMainCatObj.name}</span>
                </h3>
              </div>

              {/* Search box on mobile */}
              <div className="relative md:hidden w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subcategory..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Split layout: Subcategory Menu (Left) + Subcategory Test Cards (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
              
              {/* Left Subcategory Vertical List */}
              <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2 space-y-1 shadow-2xs">
                {subCategoriesList.map((sub, idx) => {
                  const isActive = selectedSubCatIndex === idx;
                  return (
                    <button
                      key={sub.name}
                      onClick={() => {
                        setSelectedSubCatIndex(idx);
                        if (sub.tests.length > 0) setSelectedTestTitle(sub.tests[0].title);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#EEF2FF] text-[#4F46E5] dark:bg-indigo-950/50 dark:text-indigo-400 font-bold shadow-2xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="truncate flex items-center gap-2">
                        {sub.name}
                      </span>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#4F46E5] translate-x-0.5' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Cards Area */}
              <div className="md:col-span-9 space-y-4">
                
                {/* Active Subcategory Banner Card matching reference screenshot */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4.5 shadow-2xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0B132B] dark:bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <HeaderIcon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0B132B] dark:text-white font-sans">
                      {activeSubCat.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {activeSubCat.desc}
                    </p>
                  </div>
                </div>

                {/* Test Cards Grid matching reference UI */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredTests.map((test) => {
                    const isSelected = selectedTestTitle === test.title;
                    return (
                      <div
                        key={test.title}
                        onClick={() => setSelectedTestTitle(test.title)}
                        className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group hover:shadow-md ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/30'
                            : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        {/* Circle Badge with Test Icon / Text Badge matching reference UI */}
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-[11px] border mx-auto ${
                          activeSubCat.iconBg || 'bg-purple-50 dark:bg-purple-950/40'
                        } ${activeSubCat.iconColor || 'text-purple-600 dark:text-purple-400'} border-slate-200/60 dark:border-slate-800`}>
                          {test.badgeText || test.title.split(' ')[0].slice(0, 4)}
                        </div>

                        <div className="text-center space-y-1">
                          <h5 className="text-xs font-bold text-[#0B132B] dark:text-white leading-snug">
                            {test.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 font-normal leading-tight">
                            {test.desc}
                          </p>
                        </div>

                        {/* Quick Select Checkmark or Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTestTitle(test.title);
                            handleConfirmSelect(test);
                          }}
                          className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-[#0B132B] dark:bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Selected
                            </>
                          ) : (
                            'Select Test'
                          )}
                        </button>
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
