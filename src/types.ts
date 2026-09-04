export type UserRole = 'inspector' | 'admin' | 'reviewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badgeId: string;
  department: string;
  region: string;
}

export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_REVIEW';

export type ProductCategory =
  | 'Packaged Food & Groceries'
  | 'Personal Care & Cosmetics'
  | 'Household & Cleaning'
  | 'Beverages & Liquids'
  | 'Electronics & Appliances'
  | 'Pharmaceuticals & Health'
  | 'General Commodity';

export interface BoundingBox {
  ymin: number; // 0 to 1000 or %
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DeclarationExtraction {
  key: string;
  label: string;
  value: string | null;
  present: boolean;
  formatValid: boolean;
  confidence: number; // 0 - 100
  imageIndex: number;
  boundingBox?: BoundingBox;
  notes?: string;
  humanVerified?: boolean;
  humanEditedValue?: string;
}

export interface Violation {
  id: string;
  ruleId: string;
  ruleReference: string;
  issue: string;
  category: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  confidence: number;
  evidenceImageIndex: number;
  boundingBox?: BoundingBox;
  status: 'FLAGGED' | 'VERIFIED' | 'DISMISSED';
  recommendation: string;
}

export interface ComplianceScores {
  overall: number;
  declarations: number;
  format: number;
  readability: number;
  completeness: number;
}

export interface InspectionImage {
  id: string;
  tag: 'Front' | 'Back' | 'Side' | 'Top/Bottom' | 'Detail';
  dataUrl: string;
  fileName?: string;
  ocrText?: string;
  qualityScore?: number;
}

export interface LegalRule {
  id: string;
  ruleReference: string;
  declaration: string;
  applicableCategory: string[];
  required: boolean;
  validationType: 'presence' | 'format' | 'readability' | 'placement' | 'completeness';
  validationLogic: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  effectiveDate: string;
  source: string;
  description: string;
  isActive: boolean;
}

export interface Inspection {
  id: string;
  productId?: string;
  productName: string;
  brandName: string;
  category: ProductCategory;
  batchNumber?: string;
  inspectorName: string;
  inspectorId: string;
  date: string;
  timestamp: number;
  status: ComplianceStatus;
  score: ComplianceScores;
  images: InspectionImage[];
  declarations: Record<string, DeclarationExtraction>;
  violations: Violation[];
  rawOcrText: string;
  inspectorNotes?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  location: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  totalScans: number;
  compliantCount: number;
  violationCount: number;
  needsReviewCount: number;
  lastInspectedDate: string;
  lastStatus: ComplianceStatus;
}
