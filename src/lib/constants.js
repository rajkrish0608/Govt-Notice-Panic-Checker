export const NOTICE_TYPES = {
  INCOME_TAX: 'INCOME_TAX',
  GST: 'GST',
  TRAFFIC: 'TRAFFIC',
  BANK: 'BANK',
  COURT: 'COURT',
  POLICE: 'POLICE',
  MUNICIPAL: 'MUNICIPAL',
  OTHER: 'OTHER' // Fallback
};

export const SERIOUSNESS_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

export const CONFIDENCE_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

export const KEYWORDS = {
  [NOTICE_TYPES.INCOME_TAX]: [
    'income tax', '143(1)', 'section 148', 'assessment year', 'itd', 'pan', 'defective return', 'refund', 'demand notice', 'intimation', 'cpct'
  ],
  [NOTICE_TYPES.GST]: [
    'gstin', 'gstr', 'input tax credit', 'reverse charge', 'goods and services tax', 'show cause', 'form gst', 'late fee', 'mismatch'
  ],
  [NOTICE_TYPES.TRAFFIC]: [
    'challan', 'traffic police', 'vehicle no', 'mva', 'motor vehicle', 'speeding', 'camera', 'echallan', 'fine', 'violation'
  ],
  [NOTICE_TYPES.BANK]: [
    'overdue', 'emi', 'loan account', 'credit card', 'cibil', 'defaulter', 'sarfaesi', 'npa', 'recovery', 'bounce'
  ],
  [NOTICE_TYPES.COURT]: [
    'summons', 'warrant', 'magistrate', 'high court', 'district court', 'plaintiff', 'defendant', 'hearing', 'civil suit', 'criminal'
  ],
  [NOTICE_TYPES.POLICE]: [
    'fir', 'station', 'investigation', 'inspector', 'cyber crime', 'complaint', 'appear', 'statement'
  ]
};

export const URGENCY_KEYWORDS = {
  HIGH: ['immediate', 'arrest', 'warrant', 'seizure', 'attach', 'within 24 hours', 'prosecution', 'non-bailable', 'contempt'],
  MEDIUM: ['penalty', 'interest', 'fine', 'reply within', 'show cause', 'clarification', 'compliance', 'discrepancy'],
  LOW: ['intimation', 'processed', 'record', 'informational', 'update', 'kyc', 'feedback', 'refund']
};

export const SCAM_TRIGGERS = [
  'lottery', 'won', 'click here', 'bit.ly', 'paytm', 'upi://', 'claim reward', 'winner', 'lucky draw', 'urgent refund', 'password', 'pin'
];

export const AMBIGUITY_TRIGGERS = [
  'dear customer', 'sir/madam', 'your account', 'your file', 'last warning' // Generic terms often used in vishing/phishing or vague notices
];
