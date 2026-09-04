import {
  ComplianceScores,
  ComplianceStatus,
  DeclarationExtraction,
  LegalRule,
  ProductCategory,
  Violation,
} from '../types';

export interface RuleEvaluationResult {
  status: ComplianceStatus;
  score: ComplianceScores;
  declarations: Record<string, DeclarationExtraction>;
  violations: Violation[];
  summaryNote: string;
}

export function evaluateLegalMetrologyCompliance(
  declarations: Record<string, DeclarationExtraction>,
  category: ProductCategory,
  rules: LegalRule[]
): RuleEvaluationResult {
  const activeRules = rules.filter((r) => r.isActive);
  const violations: Violation[] = [];
  let lowConfidenceCount = 0;

  // 1. Check Common / Generic Name (LM-NAME-001)
  const nameDecl = declarations['product_name'];
  if (!nameDecl || !nameDecl.present || !nameDecl.value || nameDecl.value.trim() === '') {
    violations.push({
      id: `viol-${Date.now()}-1`,
      ruleId: 'LM-NAME-001',
      ruleReference: 'Rule 6(1)(b), Legal Metrology (Packaged Commodities) Rules',
      issue: 'Common or generic name of commodity not declared on principal display panel.',
      category: 'Mandatory Declaration',
      severity: 'CRITICAL',
      confidence: nameDecl?.confidence || 95,
      evidenceImageIndex: 0,
      status: 'FLAGGED',
      recommendation: 'Mandatory declaration of commodity identity under Rule 6(1)(b).',
    });
  }

  // 2. Check Net Quantity & Metric Units (LM-NET-002)
  const netQtyDecl = declarations['net_quantity'];
  if (!netQtyDecl || !netQtyDecl.present || !netQtyDecl.value) {
    violations.push({
      id: `viol-${Date.now()}-2`,
      ruleId: 'LM-NET-002',
      ruleReference: 'Rule 6(1)(c) & Rule 12, Legal Metrology (Packaged Commodities) Rules',
      issue: 'Net quantity not declared on package.',
      category: 'Mandatory Declaration',
      severity: 'CRITICAL',
      confidence: netQtyDecl?.confidence || 95,
      evidenceImageIndex: netQtyDecl?.imageIndex ?? 1,
      status: 'FLAGGED',
      recommendation: 'Net quantity must be declared with clear numerical value and SI metric symbol.',
    });
  } else {
    // Check metric symbol legality (Rule 12 forbids "gms", "kilos", "ltrs", "gm.")
    const val = netQtyDecl.value.toLowerCase();
    const hasIllegalSymbol = /\b(gms|gm\.|kilos|ltrs|litres)\b/i.test(val);
    const validUnitRegex = /\b(\d+(\.\d+)?)\s*(g|kg|ml|l|m|cm|mm|n|u)\b/i;

    if (hasIllegalSymbol || !validUnitRegex.test(val)) {
      netQtyDecl.formatValid = false;
      violations.push({
        id: `viol-${Date.now()}-2b`,
        ruleId: 'LM-NET-002',
        ruleReference: 'Rule 12, Legal Metrology (Packaged Commodities) Rules',
        issue: `Non-standard unit abbreviation or format detected in net quantity: "${netQtyDecl.value}". Standard SI symbols (g, kg, ml, l) must be used.`,
        category: 'Unit Format Violation',
        severity: 'MAJOR',
        confidence: netQtyDecl.confidence || 92,
        evidenceImageIndex: netQtyDecl.imageIndex,
        boundingBox: netQtyDecl.boundingBox,
        status: 'FLAGGED',
        recommendation: 'Replace non-standard abbreviation with official SI metric symbol without periods.',
      });
    }
    if (netQtyDecl.confidence < 70) {
      lowConfidenceCount++;
    }
  }

  // 3. Check Maximum Retail Price & Tax Inclusivity (LM-MRP-003)
  const mrpDecl = declarations['mrp'];
  if (!mrpDecl || !mrpDecl.present || !mrpDecl.value) {
    violations.push({
      id: `viol-${Date.now()}-3`,
      ruleId: 'LM-MRP-003',
      ruleReference: 'Rule 6(1)(e), Legal Metrology (Packaged Commodities) Rules',
      issue: 'Maximum Retail Price (MRP) declaration completely missing.',
      category: 'Mandatory Declaration',
      severity: 'CRITICAL',
      confidence: mrpDecl?.confidence || 96,
      evidenceImageIndex: mrpDecl?.imageIndex ?? 1,
      status: 'FLAGGED',
      recommendation: 'Retail price is mandatory for all packaged goods meant for consumer retail sale.',
    });
  } else {
    const val = mrpDecl.value.toLowerCase();
    const hasTaxPhrase =
      val.includes('inclusive of all taxes') ||
      val.includes('incl. of all taxes') ||
      val.includes('incl. all taxes') ||
      val.includes('incl taxes');

    if (!hasTaxPhrase) {
      mrpDecl.formatValid = false;
      violations.push({
        id: `viol-${Date.now()}-3b`,
        ruleId: 'LM-MRP-003',
        ruleReference: 'Rule 6(1)(e), Legal Metrology (Packaged Commodities) Rules',
        issue: 'MRP declaration fails to include mandatory statutory phrase "(Inclusive of all taxes)".',
        category: 'Price & Tax Inclusivity',
        severity: 'CRITICAL',
        confidence: mrpDecl.confidence || 93,
        evidenceImageIndex: mrpDecl.imageIndex,
        boundingBox: mrpDecl.boundingBox,
        status: 'FLAGGED',
        recommendation: 'Mandatory inclusion of phrase "(Inclusive of all taxes)" alongside MRP.',
      });
    }
    if (mrpDecl.confidence < 70) {
      lowConfidenceCount++;
    }
  }

  // 4. Check Manufacturer / Packer Details & Address Completeness (LM-MFG-004)
  const mfgDecl = declarations['manufacturer'];
  if (!mfgDecl || !mfgDecl.present || !mfgDecl.value) {
    violations.push({
      id: `viol-${Date.now()}-4`,
      ruleId: 'LM-MFG-004',
      ruleReference: 'Rule 6(1)(a), Legal Metrology (Packaged Commodities) Rules',
      issue: 'Name and address of manufacturer / packer / importer not declared.',
      category: 'Mandatory Declaration',
      severity: 'CRITICAL',
      confidence: mfgDecl?.confidence || 95,
      evidenceImageIndex: mfgDecl?.imageIndex ?? 1,
      status: 'FLAGGED',
      recommendation: 'Declare full registered entity name and postal address.',
    });
  } else {
    // Check completeness (address should not just be 1 word)
    const words = mfgDecl.value.split(/\s+/).filter(Boolean);
    if (words.length < 5) {
      mfgDecl.formatValid = false;
      violations.push({
        id: `viol-${Date.now()}-4b`,
        ruleId: 'LM-MFG-004',
        ruleReference: 'Rule 6(1)(a), Legal Metrology (Packaged Commodities) Rules',
        issue: 'Manufacturer address appears incomplete or lacks specific postal landmarks/state/pin code.',
        category: 'Completeness Violation',
        severity: 'MAJOR',
        confidence: mfgDecl.confidence || 88,
        evidenceImageIndex: mfgDecl.imageIndex,
        boundingBox: mfgDecl.boundingBox,
        status: 'FLAGGED',
        recommendation: 'Full street/industrial plot, town/city, state and postal PIN code are required.',
      });
    }
    if (mfgDecl.confidence < 70) {
      lowConfidenceCount++;
    }
  }

  // 5. Check Consumer Care Information (LM-CARE-005)
  const careDecl = declarations['consumer_care'];
  if (!careDecl || !careDecl.present || !careDecl.value || careDecl.value.trim() === '') {
    violations.push({
      id: `viol-${Date.now()}-5`,
      ruleId: 'LM-CARE-005',
      ruleReference: 'Rule 6(1)(f), Legal Metrology (Packaged Commodities) Rules',
      issue: 'Consumer-care / customer grievance redressal contact not detected on package.',
      category: 'Mandatory Declaration',
      severity: 'CRITICAL',
      confidence: careDecl?.confidence || 94,
      evidenceImageIndex: careDecl?.imageIndex ?? 1,
      status: 'FLAGGED',
      recommendation: 'Every package must carry a telephone number or email address or postal contact for consumer queries.',
    });
  } else {
    // Check if contains phone or email
    const val = careDecl.value.toLowerCase();
    const hasPhone = /\d{4,}/.test(val) || val.includes('tel') || val.includes('toll');
    const hasEmail = /@/.test(val) || val.includes('care') || val.includes('email');
    if (!hasPhone && !hasEmail) {
      careDecl.formatValid = false;
      violations.push({
        id: `viol-${Date.now()}-5b`,
        ruleId: 'LM-CARE-005',
        ruleReference: 'Rule 6(1)(f), Legal Metrology (Packaged Commodities) Rules',
        issue: 'Consumer care declaration lacks specific contact coordinates (valid telephone number or email ID missing).',
        category: 'Contact Format Violation',
        severity: 'MAJOR',
        confidence: careDecl.confidence || 90,
        evidenceImageIndex: careDecl.imageIndex,
        boundingBox: careDecl.boundingBox,
        status: 'FLAGGED',
        recommendation: 'Provide explicit toll-free phone number and/or customer care email ID.',
      });
    }
    if (careDecl.confidence < 70) {
      lowConfidenceCount++;
    }
  }

  // 6. Check Date Information (LM-DATE-006)
  const dateDecl = declarations['packing_date'];
  if (!dateDecl || !dateDecl.present || !dateDecl.value) {
    violations.push({
      id: `viol-${Date.now()}-6`,
      ruleId: 'LM-DATE-006',
      ruleReference: 'Rule 6(1)(d), Legal Metrology (Packaged Commodities) Rules',
      issue: 'Month and year of manufacture or pre-packing not declared.',
      category: 'Mandatory Declaration',
      severity: 'MAJOR',
      confidence: dateDecl?.confidence || 94,
      evidenceImageIndex: dateDecl?.imageIndex ?? 1,
      status: 'FLAGGED',
      recommendation: 'Declare month and year of pre-packing in MM/YYYY or Month YYYY format.',
    });
  } else {
    const val = dateDecl.value.trim();
    // Rejects bare 4-digit year like "2026" without month
    const isBareYearOnly = /^\d{4}$/.test(val);
    const hasMonthAndYear =
      /\b(0?[1-9]|1[0-2])[\/\-\.]\d{2,4}\b/.test(val) ||
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*[\'\-]?\s*\d{2,4}\b/i.test(val);

    if (isBareYearOnly || !hasMonthAndYear) {
      dateDecl.formatValid = false;
      violations.push({
        id: `viol-${Date.now()}-6b`,
        ruleId: 'LM-DATE-006',
        ruleReference: 'Rule 6(1)(d), Legal Metrology (Packaged Commodities) Rules',
        issue: `Defective date format: "${val}". Declaration must specify both Month and Year. Declaring year alone is a violation.`,
        category: 'Date Format Violation',
        severity: 'MAJOR',
        confidence: dateDecl.confidence || 92,
        evidenceImageIndex: dateDecl.imageIndex,
        boundingBox: dateDecl.boundingBox,
        status: 'FLAGGED',
        recommendation: 'Amend packaging printing to include two-digit month and year (e.g. 06/2026).',
      });
    }
    if (dateDecl.confidence < 70) {
      lowConfidenceCount++;
    }
  }

  // Check general readability
  let totalConfidence = 0;
  let totalCount = 0;
  Object.values(declarations).forEach((d) => {
    if (d.present) {
      totalConfidence += d.confidence;
      totalCount++;
    }
  });
  const avgConfidence = totalCount > 0 ? Math.round(totalConfidence / totalCount) : 80;

  // Calculate Scores (Declarations, Format, Readability, Completeness, Overall)
  const mandatoryKeys = ['product_name', 'net_quantity', 'mrp', 'manufacturer', 'consumer_care', 'packing_date'];
  const presentCount = mandatoryKeys.filter((k) => declarations[k]?.present).length;
  const declScore = Math.round((presentCount / mandatoryKeys.length) * 100);

  const formatValidCount = mandatoryKeys.filter((k) => declarations[k]?.present && declarations[k]?.formatValid).length;
  const formatScore = presentCount > 0 ? Math.round((formatValidCount / presentCount) * 100) : 0;

  const readabilityScore = Math.max(30, Math.min(99, avgConfidence));

  const completenessPenalty = violations.filter((v) => v.category.includes('Completeness') || v.severity === 'CRITICAL').length * 15;
  const completenessScore = Math.max(20, Math.min(100, 100 - completenessPenalty));

  const overallScore = Math.round(declScore * 0.35 + formatScore * 0.25 + readabilityScore * 0.2 + completenessScore * 0.2);

  // Determine Final State: 🟢 COMPLIANT, 🔴 NON-COMPLIANT, 🟠 NEEDS REVIEW
  let finalStatus: ComplianceStatus = 'COMPLIANT';
  let summaryNote = 'All statutory legal metrology declarations verified and compliant.';

  if (lowConfidenceCount >= 1 || avgConfidence < 65) {
    // If OCR or extraction was uncertain, do NOT falsely accuse the product! Send for human review!
    finalStatus = 'NEEDS_REVIEW';
    summaryNote = 'Uncertain OCR readings or low print contrast detected. Forwarded for human officer verification.';
  } else if (violations.length > 0) {
    finalStatus = 'NON_COMPLIANT';
    summaryNote = `${violations.length} statutory violation(s) identified under Legal Metrology (Packaged Commodities) Rules.`;
  }

  return {
    status: finalStatus,
    score: {
      overall: overallScore,
      declarations: declScore,
      format: formatScore,
      readability: readabilityScore,
      completeness: completenessScore,
    },
    declarations,
    violations,
    summaryNote,
  };
}
