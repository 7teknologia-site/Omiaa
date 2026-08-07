export type LegalDocumentId =
  | 'privacy-policy'
  | 'cookie-policy'
  | 'terms-of-use'
  | 'shipping-policy'
  | 'returns-policy'
  | 'refund-policy';

export type DocumentStatus = 'published' | 'draft';

export interface DocumentVersionHistory {
  id: string;
  version: string;
  title: string;
  summary: string;
  content: string;
  updatedAt: string;
  updatedBy: string;
  changeNotes: string;
}

export interface LegalDocument {
  id: LegalDocumentId;
  type: LegalDocumentId;
  title: string;
  summary: string;
  content: string;
  version: string;
  publishedAt: string;
  updatedAt: string;
  status: DocumentStatus;
  author: string;
  history: DocumentVersionHistory[];
}

export interface UserConsentRecord {
  id: string;
  userIdentifier: string; // Email, Name or Visitor Token
  userName?: string;
  acceptedAt: string;
  ipAddress: string;
  userAgent: string;
  documentVersionsAccepted: {
    privacyPolicy: string;
    termsOfUse: string;
    cookiePolicy: string;
  };
  consents: {
    privacyPolicy: boolean;
    termsOfUse: boolean;
    cookiesNecessary: boolean;
    cookiesFunctional: boolean;
    cookiesAnalytics: boolean;
    cookiesMarketing: boolean;
    newsletterMarketing: boolean;
  };
  revoked: boolean;
  revokedAt?: string;
  revocationNotes?: string;
}

export type SubjectRequestType =
  | 'access'
  | 'rectification'
  | 'erasure'
  | 'anonymization'
  | 'portability'
  | 'revocation';

export type SubjectRequestStatus =
  | 'pending'
  | 'in_analysis'
  | 'in_progress'
  | 'completed'
  | 'rejected';

export interface RequestInteraction {
  id: string;
  date: string;
  author: string;
  message: string;
  statusChange?: SubjectRequestStatus;
}

export interface DataSubjectRequest {
  id: string;
  protocolNumber: string; // e.g., PROTOCOL-LGPD-2026-0042
  requesterName: string;
  requesterEmail: string;
  requesterCpf?: string;
  requestType: SubjectRequestType;
  description: string;
  status: SubjectRequestStatus;
  assignedTo: string;
  createdAt: string;
  deadlineDate: string; // Legal deadline (15 days)
  completedAt?: string;
  notes?: string;
  interactions: RequestInteraction[];
}

export type AuditLogCategory =
  | 'login'
  | 'logout'
  | 'settings'
  | 'product'
  | 'order'
  | 'customer'
  | 'price'
  | 'inventory'
  | 'permission'
  | 'coupon'
  | 'campaign'
  | 'compliance';

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  category: AuditLogCategory;
  action: string;
  details?: string;
  ipAddress: string;
  device: string;
  result: 'success' | 'failure' | 'warning';
}

export interface SecurityAlert {
  id: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  date: string;
  resolved: boolean;
}

export interface SecurityStatus {
  httpsActive: boolean;
  sslCertificate: {
    issuer: string;
    validUntil: string;
    keyType: string;
    status: 'valid' | 'warning' | 'expired';
  };
  securityHeaders: {
    hsts: boolean;
    csp: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
    referrerPolicy: boolean;
  };
  apiStatus: {
    googleGenAI: 'operational' | 'degraded' | 'offline';
    mailServer: 'operational' | 'degraded' | 'offline';
    paymentGateway: 'operational' | 'degraded' | 'offline';
    database: 'operational' | 'degraded' | 'offline';
  };
  envIntegrity: boolean;
  lastBackupTimestamp: string;
  lastAuditTimestamp: string;
  lastSystemUpdate: string;
  alerts: SecurityAlert[];
}

export interface BackupRecord {
  id: string;
  filename: string;
  timestamp: string;
  sizeBytes: number;
  status: 'completed' | 'in_progress' | 'verified' | 'failed';
  type: 'manual' | 'scheduled';
  checksum: string;
  contentsSummary: string;
}
