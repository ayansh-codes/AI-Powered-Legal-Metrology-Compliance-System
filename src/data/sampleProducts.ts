import { Inspection, ProductCategory } from '../types';

// Helper to generate realistic package label SVG data URL
export function createPackageSvgDataUrl(params: {
  productTitle: string;
  brand: string;
  netQty: string;
  mrpText: string;
  mfgText: string;
  consumerCareText?: string;
  packedDateText: string;
  originText?: string;
  side: 'Front' | 'Back';
  accentColor: string;
  faint?: boolean;
}): string {
  const {
    productTitle,
    brand,
    netQty,
    mrpText,
    mfgText,
    consumerCareText,
    packedDateText,
    originText = 'Country of Origin: India',
    side,
    accentColor,
    faint = false,
  } = params;

  const bgStyle = faint
    ? 'fill="#f0f2f0" stroke="#bbb"'
    : 'fill="#fafaf8" stroke="#334155"';
  const textOpacity = faint ? '0.42' : '0.92';

  let content = '';

  if (side === 'Front') {
    content = `
      <rect x="20" y="20" width="440" height="70" rx="8" fill="${accentColor}" />
      <text x="240" y="55" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">${brand.toUpperCase()}</text>
      <text x="240" y="75" font-family="system-ui, sans-serif" font-size="12" fill="#ffffff" opacity="0.9" text-anchor="middle">PREMIUM GRADE PACKAGED COMMODITY</text>
      
      <!-- Center product display -->
      <circle cx="240" cy="210" r="85" fill="#f1f5f9" stroke="${accentColor}" stroke-width="3" stroke-dasharray="4 2" />
      <text x="240" y="195" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#0f172a" text-anchor="middle">${productTitle}</text>
      <text x="240" y="225" font-family="system-ui, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">100% Pure & Hygienically Packed</text>

      <!-- Front net quantity badge -->
      <rect x="140" y="320" width="200" height="48" rx="24" fill="#0f172a" />
      <text x="240" y="350" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#38bdf8" text-anchor="middle">NET QTY: ${netQty}</text>

      <text x="240" y="440" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">PRINCIPAL DISPLAY PANEL • AGMARK CERTIFIED</text>
    `;
  } else {
    // Back Panel with legal declarations
    content = `
      <!-- Header bar -->
      <rect x="20" y="20" width="440" height="40" fill="#334155" rx="4" />
      <text x="240" y="45" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">STATUTORY DECLARATIONS (PKG RULES, 2011)</text>

      <!-- Grid for declarations -->
      <g opacity="${textOpacity}" font-family="monospace, sans-serif">
        <!-- MRP Box -->
        <rect x="30" y="80" width="420" height="65" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="4" />
        <text x="45" y="102" font-size="11" font-weight="bold" fill="#475569">MAXIMUM RETAIL PRICE (M.R.P.):</text>
        <text x="45" y="128" font-size="16" font-weight="bold" fill="#0f172a">${mrpText}</text>

        <!-- Net Quantity & Date Box -->
        <rect x="30" y="155" width="205" height="60" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="4" />
        <text x="45" y="175" font-size="10" font-weight="bold" fill="#475569">NET QUANTITY:</text>
        <text x="45" y="200" font-size="15" font-weight="bold" fill="#0f172a">${netQty}</text>

        <rect x="245" y="155" width="205" height="60" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="4" />
        <text x="260" y="175" font-size="10" font-weight="bold" fill="#475569">DATE OF PACKING / MFG:</text>
        <text x="260" y="200" font-size="14" font-weight="bold" fill="#0f172a">${packedDateText}</text>

        <!-- Manufacturer Address -->
        <rect x="30" y="225" width="420" height="80" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="4" />
        <text x="45" y="245" font-size="10" font-weight="bold" fill="#475569">MANUFACTURED & PACKED BY:</text>
        <text x="45" y="268" font-size="12" fill="#0f172a">${mfgText.slice(0, 48)}</text>
        <text x="45" y="288" font-size="11" fill="#334155">${mfgText.slice(48)}</text>

        <!-- Consumer Care Box -->
        <rect x="30" y="315" width="420" height="75" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="4" />
        <text x="45" y="335" font-size="10" font-weight="bold" fill="#475569">CONSUMER CARE / GRIEVANCE REDRESSAL:</text>
        ${
          consumerCareText
            ? `<text x="45" y="360" font-size="12" font-weight="bold" fill="#0284c7">${consumerCareText}</text>
               <text x="45" y="378" font-size="10" fill="#64748b">Executive Cell, Customer Care Division</text>`
            : `<text x="45" y="365" font-size="12" font-style="italic" fill="#ef4444">[DECLARATION NOT DETECTED ON PANEL]</text>`
        }

        <!-- Origin & Standards footer -->
        <rect x="30" y="400" width="420" height="40" fill="#f8fafc" stroke="#e2e8f0" rx="4" />
        <text x="45" y="424" font-size="11" font-weight="bold" fill="#334155">${originText}</text>
        <text x="350" y="424" font-size="10" fill="#64748b">ISO 9001:2015</text>
      </g>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="480" height="480">
      <rect width="480" height="480" ${bgStyle} stroke-width="3" rx="16" />
      ${content}
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const SAMPLE_PRODUCTS: {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  expectedStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_REVIEW';
  frontDataUrl: string;
  backDataUrl: string;
  sideDataUrl?: string;
  rawOcrMock: string;
  declarationsMock: any;
  violationsMock: any;
  scoreMock: any;
}[] = [
  {
    id: 'sample-01',
    name: 'Moong Dal (Yellow Split)',
    brand: 'ABC Foods Pvt Ltd',
    category: 'Packaged Food & Groceries',
    description: 'Packaged pulse commodity missing mandatory Consumer Care declaration (Rule 6(1)(f)).',
    expectedStatus: 'NON_COMPLIANT',
    frontDataUrl: createPackageSvgDataUrl({
      productTitle: 'MOONG DAL',
      brand: 'ABC Foods',
      netQty: '500 g',
      mrpText: 'MRP ₹ 120.00 (Incl. of all taxes)',
      mfgText: 'ABC Foods Pvt Ltd, Plot 14, Industrial Area, Sector 4, New Delhi - 110020',
      consumerCareText: '', // MISSING!
      packedDateText: '06/2026',
      side: 'Front',
      accentColor: '#d97706',
    }),
    backDataUrl: createPackageSvgDataUrl({
      productTitle: 'MOONG DAL',
      brand: 'ABC Foods',
      netQty: '500 g',
      mrpText: '₹ 120.00 (Inclusive of all taxes)',
      mfgText: 'ABC Foods Pvt Ltd, Plot 14, Industrial Area, Sector 4, New Delhi - 110020',
      consumerCareText: '', // intentionally empty
      packedDateText: '06/2026',
      side: 'Back',
      accentColor: '#d97706',
    }),
    rawOcrMock: `ABC FOODS PVT LTD\nMOONG DAL\nNet Quantity: 500 g\nMRP ₹120.00\n(Inclusive of all taxes)\nPacked: 06/2026\nPlot 14, Industrial Area, Sector 4, New Delhi 110020\nCountry of Origin: India`,
    declarationsMock: {
      product_name: {
        key: 'product_name',
        label: 'Common / Generic Name',
        value: 'Moong Dal (Yellow Split)',
        present: true,
        formatValid: true,
        confidence: 98,
        imageIndex: 0,
        boundingBox: { ymin: 350, xmin: 200, ymax: 480, xmax: 800 },
      },
      net_quantity: {
        key: 'net_quantity',
        label: 'Net Quantity',
        value: '500 g',
        present: true,
        formatValid: true,
        confidence: 96,
        imageIndex: 1,
        boundingBox: { ymin: 320, xmin: 60, ymax: 450, xmax: 480 },
      },
      mrp: {
        key: 'mrp',
        label: 'Maximum Retail Price',
        value: '₹ 120.00 (Inclusive of all taxes)',
        present: true,
        formatValid: true,
        confidence: 97,
        imageIndex: 1,
        boundingBox: { ymin: 160, xmin: 60, ymax: 300, xmax: 920 },
      },
      manufacturer: {
        key: 'manufacturer',
        label: 'Manufacturer / Packer',
        value: 'ABC Foods Pvt Ltd, Plot 14, Industrial Area, Sector 4, New Delhi - 110020',
        present: true,
        formatValid: true,
        confidence: 94,
        imageIndex: 1,
        boundingBox: { ymin: 460, xmin: 60, ymax: 630, xmax: 920 },
      },
      consumer_care: {
        key: 'consumer_care',
        label: 'Consumer Care Information',
        value: null,
        present: false,
        formatValid: false,
        confidence: 95,
        imageIndex: 1,
        notes: 'Declaration completely absent on all package faces.',
      },
      packing_date: {
        key: 'packing_date',
        label: 'Packing / Mfg Date',
        value: '06/2026',
        present: true,
        formatValid: true,
        confidence: 93,
        imageIndex: 1,
        boundingBox: { ymin: 320, xmin: 510, ymax: 450, xmax: 920 },
      },
      country_of_origin: {
        key: 'country_of_origin',
        label: 'Country of Origin',
        value: 'India',
        present: true,
        formatValid: true,
        confidence: 95,
        imageIndex: 1,
        boundingBox: { ymin: 830, xmin: 60, ymax: 910, xmax: 600 },
      },
    },
    violationsMock: [
      {
        id: 'viol-01',
        ruleId: 'LM-CARE-005',
        ruleReference: 'Rule 6(1)(f), Legal Metrology (Packaged Commodities) Rules',
        issue: 'Consumer-care declaration not detected on package label.',
        category: 'Mandatory Declaration',
        severity: 'CRITICAL',
        confidence: 95,
        evidenceImageIndex: 1,
        boundingBox: { ymin: 650, xmin: 60, ymax: 800, xmax: 920 },
        status: 'FLAGGED',
        recommendation: 'Issue Section 36 notice under Legal Metrology Act, 2009 for absence of consumer grievance redressal contact.',
      },
    ],
    scoreMock: {
      overall: 78,
      declarations: 71,
      format: 95,
      readability: 90,
      completeness: 82,
    },
  },
  {
    id: 'sample-02',
    name: 'Herbal Nourish Shampoo',
    brand: 'Lotus Herbals Labs',
    category: 'Personal Care & Cosmetics',
    description: 'Fully compliant cosmetic package with proper USP, taxes, phone and email redressal.',
    expectedStatus: 'COMPLIANT',
    frontDataUrl: createPackageSvgDataUrl({
      productTitle: 'HERBAL SHAMPOO',
      brand: 'Lotus Herbals',
      netQty: '200 ml',
      mrpText: 'MRP ₹ 185.00 (Incl. of all taxes)',
      mfgText: 'Lotus Herbals Labs, Phase III, Baddi, Solan, H.P. - 173205',
      consumerCareText: 'Toll-Free: 1800-220-4321 • care@lotusherbals.com',
      packedDateText: '08/2026',
      side: 'Front',
      accentColor: '#059669',
    }),
    backDataUrl: createPackageSvgDataUrl({
      productTitle: 'HERBAL SHAMPOO',
      brand: 'Lotus Herbals',
      netQty: '200 ml (USP: ₹ 0.92 / ml)',
      mrpText: 'MRP ₹ 185.00 (Inclusive of all taxes)',
      mfgText: 'Lotus Herbals Labs, Phase III, Baddi, Solan, H.P. - 173205',
      consumerCareText: 'Toll-Free: 1800-220-4321 • Email: care@lotusherbals.com',
      packedDateText: '08/2026',
      side: 'Back',
      accentColor: '#059669',
    }),
    rawOcrMock: `LOTUS HERBALS LABS\nHERBAL NOURISH SHAMPOO\nNet Quantity: 200 ml\nUnit Sale Price: ₹ 0.92 / ml\nMRP ₹ 185.00 (Inclusive of all taxes)\nPacked: 08/2026\nConsumer Care: 1800-220-4321, care@lotusherbals.com\nPhase III, Baddi, Solan, H.P. - 173205\nCountry of Origin: India`,
    declarationsMock: {
      product_name: {
        key: 'product_name',
        label: 'Common / Generic Name',
        value: 'Herbal Nourish Shampoo',
        present: true,
        formatValid: true,
        confidence: 99,
        imageIndex: 0,
        boundingBox: { ymin: 350, xmin: 150, ymax: 480, xmax: 850 },
      },
      net_quantity: {
        key: 'net_quantity',
        label: 'Net Quantity',
        value: '200 ml',
        present: true,
        formatValid: true,
        confidence: 97,
        imageIndex: 1,
        boundingBox: { ymin: 320, xmin: 60, ymax: 450, xmax: 480 },
      },
      mrp: {
        key: 'mrp',
        label: 'Maximum Retail Price',
        value: 'MRP ₹ 185.00 (Inclusive of all taxes)',
        present: true,
        formatValid: true,
        confidence: 98,
        imageIndex: 1,
        boundingBox: { ymin: 160, xmin: 60, ymax: 300, xmax: 920 },
      },
      manufacturer: {
        key: 'manufacturer',
        label: 'Manufacturer / Packer',
        value: 'Lotus Herbals Labs, Phase III, Baddi, Solan, H.P. - 173205',
        present: true,
        formatValid: true,
        confidence: 96,
        imageIndex: 1,
        boundingBox: { ymin: 460, xmin: 60, ymax: 630, xmax: 920 },
      },
      consumer_care: {
        key: 'consumer_care',
        label: 'Consumer Care Information',
        value: 'Toll-Free: 1800-220-4321 • Email: care@lotusherbals.com',
        present: true,
        formatValid: true,
        confidence: 98,
        imageIndex: 1,
        boundingBox: { ymin: 650, xmin: 60, ymax: 800, xmax: 920 },
      },
      packing_date: {
        key: 'packing_date',
        label: 'Packing / Mfg Date',
        value: '08/2026',
        present: true,
        formatValid: true,
        confidence: 95,
        imageIndex: 1,
        boundingBox: { ymin: 320, xmin: 510, ymax: 450, xmax: 920 },
      },
      unit_sale_price: {
        key: 'unit_sale_price',
        label: 'Unit Sale Price (USP)',
        value: '₹ 0.92 / ml',
        present: true,
        formatValid: true,
        confidence: 94,
        imageIndex: 1,
        boundingBox: { ymin: 380, xmin: 60, ymax: 450, xmax: 480 },
      },
      country_of_origin: {
        key: 'country_of_origin',
        label: 'Country of Origin',
        value: 'India',
        present: true,
        formatValid: true,
        confidence: 98,
        imageIndex: 1,
        boundingBox: { ymin: 830, xmin: 60, ymax: 910, xmax: 600 },
      },
    },
    violationsMock: [],
    scoreMock: {
      overall: 98,
      declarations: 100,
      format: 98,
      readability: 96,
      completeness: 98,
    },
  },
  {
    id: 'sample-03',
    name: 'Supreme Traditional Basmati Rice',
    brand: 'Himalaya Agri Mills',
    category: 'Packaged Food & Groceries',
    description: 'Defective date format (Month omitted, Rule 6(1)(d)) and tax inclusion phrase missing on MRP.',
    expectedStatus: 'NON_COMPLIANT',
    frontDataUrl: createPackageSvgDataUrl({
      productTitle: 'BASMATI RICE',
      brand: 'Himalaya Mills',
      netQty: '5 kg',
      mrpText: 'MRP ₹ 650',
      mfgText: 'Himalaya Agri Mills, GT Road, Karnal, Haryana - 132001',
      consumerCareText: 'care@himalayarice.in',
      packedDateText: '2026', // MONTH MISSING!
      side: 'Front',
      accentColor: '#b45309',
    }),
    backDataUrl: createPackageSvgDataUrl({
      productTitle: 'BASMATI RICE',
      brand: 'Himalaya Mills',
      netQty: '5 kg',
      mrpText: 'MRP ₹ 650.00', // Missing "(Inclusive of all taxes)"!
      mfgText: 'Himalaya Agri Mills, GT Road, Karnal, Haryana - 132001',
      consumerCareText: 'care@himalayarice.in',
      packedDateText: '2026', // Missing month
      side: 'Back',
      accentColor: '#b45309',
    }),
    rawOcrMock: `HIMALAYA AGRI MILLS\nSUPREME BASMATI RICE\nNet Qty: 5 kg\nMRP ₹650.00\nDate of Packing: 2026\nConsumer Care: care@himalayarice.in\nGT Road, Karnal, Haryana 132001`,
    declarationsMock: {
      product_name: {
        key: 'product_name',
        label: 'Common / Generic Name',
        value: 'Supreme Traditional Basmati Rice',
        present: true,
        formatValid: true,
        confidence: 96,
        imageIndex: 0,
        boundingBox: { ymin: 350, xmin: 150, ymax: 480, xmax: 850 },
      },
      net_quantity: {
        key: 'net_quantity',
        label: 'Net Quantity',
        value: '5 kg',
        present: true,
        formatValid: true,
        confidence: 95,
        imageIndex: 1,
        boundingBox: { ymin: 320, xmin: 60, ymax: 450, xmax: 480 },
      },
      mrp: {
        key: 'mrp',
        label: 'Maximum Retail Price',
        value: 'MRP ₹ 650.00',
        present: true,
        formatValid: false,
        confidence: 92,
        imageIndex: 1,
        boundingBox: { ymin: 160, xmin: 60, ymax: 300, xmax: 920 },
        notes: 'Failed Rule 6(1)(e): Omission of "(Inclusive of all taxes)" statement.',
      },
      manufacturer: {
        key: 'manufacturer',
        label: 'Manufacturer / Packer',
        value: 'Himalaya Agri Mills, GT Road, Karnal, Haryana - 132001',
        present: true,
        formatValid: true,
        confidence: 93,
        imageIndex: 1,
        boundingBox: { ymin: 460, xmin: 60, ymax: 630, xmax: 920 },
      },
      consumer_care: {
        key: 'consumer_care',
        label: 'Consumer Care Information',
        value: 'care@himalayarice.in',
        present: true,
        formatValid: false,
        confidence: 89,
        imageIndex: 1,
        boundingBox: { ymin: 650, xmin: 60, ymax: 800, xmax: 920 },
        notes: 'Only email provided; lacks physical redressal contact or phone number.',
      },
      packing_date: {
        key: 'packing_date',
        label: 'Packing / Mfg Date',
        value: '2026',
        present: true,
        formatValid: false,
        confidence: 88,
        imageIndex: 1,
        boundingBox: { ymin: 320, xmin: 510, ymax: 450, xmax: 920 },
        notes: 'Failed Rule 6(1)(d): Month of packing is omitted; year alone declared.',
      },
    },
    violationsMock: [
      {
        id: 'viol-02',
        ruleId: 'LM-DATE-006',
        ruleReference: 'Rule 6(1)(d), Legal Metrology (Packaged Commodities) Rules',
        issue: 'Month of pre-packing omitted; only calendar year "2026" declared.',
        category: 'Format & Date Validation',
        severity: 'MAJOR',
        confidence: 93,
        evidenceImageIndex: 1,
        boundingBox: { ymin: 320, xmin: 510, ymax: 450, xmax: 920 },
        status: 'FLAGGED',
        recommendation: 'Mandate pre-packer to declare both month and year (e.g. 06/2026).',
      },
      {
        id: 'viol-03',
        ruleId: 'LM-MRP-003',
        ruleReference: 'Rule 6(1)(e), Legal Metrology (Packaged Commodities) Rules',
        issue: 'MRP declaration fails to mention "(Inclusive of all taxes)".',
        category: 'Price & Tax Inclusivity',
        severity: 'CRITICAL',
        confidence: 94,
        evidenceImageIndex: 1,
        boundingBox: { ymin: 160, xmin: 60, ymax: 300, xmax: 920 },
        status: 'FLAGGED',
        recommendation: 'Charge under Rule 6(1)(e) read with Section 36(1).',
      },
    ],
    scoreMock: {
      overall: 64,
      declarations: 85,
      format: 52,
      readability: 88,
      completeness: 60,
    },
  },
  {
    id: 'sample-04',
    name: 'Mountain Mist Organic Green Tea',
    brand: 'Nirvana Organics',
    category: 'Beverages & Liquids',
    description: 'Faded inkjet print with low OCR confidence (57%) - system automatically flags for Human Review rather than making an unverified accusation.',
    expectedStatus: 'NEEDS_REVIEW',
    frontDataUrl: createPackageSvgDataUrl({
      productTitle: 'GREEN TEA',
      brand: 'Nirvana Organics',
      netQty: '100 g',
      mrpText: 'MRP ₹ 240.00 (Incl. all taxes)',
      mfgText: 'Nirvana Estate, Darjeeling, West Bengal - 734101',
      consumerCareText: 'Tel: 0354-225411',
      packedDateText: '05/2026 (faint)',
      side: 'Front',
      accentColor: '#15803d',
      faint: true,
    }),
    backDataUrl: createPackageSvgDataUrl({
      productTitle: 'GREEN TEA',
      brand: 'Nirvana Organics',
      netQty: '100 g',
      mrpText: 'MRP ₹ 240.00 (Incl. all taxes)',
      mfgText: 'Nirvana Estate, Darjeeling, West Bengal - 734101',
      consumerCareText: 'Tel: 0354-225411',
      packedDateText: '05/2026',
      side: 'Back',
      accentColor: '#15803d',
      faint: true,
    }),
    rawOcrMock: `NIRVANA ORGANICS\nGREEN TEA\nNet Qty: 100 g ?\nMRP ₹240 [faded ink]\nPacked: 05/?2026\nTel: 0354-225411`,
    declarationsMock: {
      product_name: {
        key: 'product_name',
        label: 'Common / Generic Name',
        value: 'Mountain Mist Organic Green Tea',
        present: true,
        formatValid: true,
        confidence: 82,
        imageIndex: 0,
        boundingBox: { ymin: 350, xmin: 150, ymax: 480, xmax: 850 },
      },
      net_quantity: {
        key: 'net_quantity',
        label: 'Net Quantity',
        value: '100 g',
        present: true,
        formatValid: true,
        confidence: 68,
        imageIndex: 1,
        boundingBox: { ymin: 320, xmin: 60, ymax: 450, xmax: 480 },
      },
      mrp: {
        key: 'mrp',
        label: 'Maximum Retail Price',
        value: 'MRP ₹ 240.00 (Incl. all taxes)',
        present: true,
        formatValid: true,
        confidence: 61,
        imageIndex: 1,
        boundingBox: { ymin: 160, xmin: 60, ymax: 300, xmax: 920 },
      },
      manufacturer: {
        key: 'manufacturer',
        label: 'Manufacturer / Packer',
        value: 'Nirvana Estate, Darjeeling, West Bengal - 734101',
        present: true,
        formatValid: true,
        confidence: 57,
        imageIndex: 1,
        boundingBox: { ymin: 460, xmin: 60, ymax: 630, xmax: 920 },
      },
      consumer_care: {
        key: 'consumer_care',
        label: 'Consumer Care Information',
        value: 'Tel: 0354-225411',
        present: true,
        formatValid: true,
        confidence: 54,
        imageIndex: 1,
        boundingBox: { ymin: 650, xmin: 60, ymax: 800, xmax: 920 },
      },
      packing_date: {
        key: 'packing_date',
        label: 'Packing / Mfg Date',
        value: '05/2026 (Uncertain characters)',
        present: true,
        formatValid: true,
        confidence: 52,
        imageIndex: 1,
        boundingBox: { ymin: 320, xmin: 510, ymax: 450, xmax: 920 },
      },
    },
    violationsMock: [
      {
        id: 'viol-04',
        ruleId: 'LM-READ-009',
        ruleReference: 'Rule 9, Legal Metrology (Packaged Commodities) Rules',
        issue: 'Low contrast & faded thermal inkjet printing below readability threshold (OCR confidence 54%).',
        category: 'Readability & Conspicuousness',
        severity: 'MAJOR',
        confidence: 65,
        evidenceImageIndex: 1,
        boundingBox: { ymin: 320, xmin: 510, ymax: 450, xmax: 920 },
        status: 'FLAGGED',
        recommendation: 'Human-in-the-Loop review required by field inspector before penalty notice is drafted.',
      },
    ],
    scoreMock: {
      overall: 71,
      declarations: 82,
      format: 80,
      readability: 54,
      completeness: 75,
    },
  },
];
