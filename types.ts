export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum LoanProductType {
  GOLD = 'Gold Loan',
  BAJAJ = 'Bajaj Finance (2-Wheeler)',
  CAR = 'Car Finance',
  HOME = 'Home Loan',
}

export enum ApplicationStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  DISBURSED = 'Disbursed',
  CLOSED = 'Closed',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  isVerified: boolean;
}

export interface LoanProduct {
  id: string;
  type: LoanProductType;
  interestRateBase: number; // Annual percentage
  minTenureMonths: number;
  maxTenureMonths: number;
  processingFeePct: number;
  maxLTV?: number; // Loan to Value ratio for secured loans
}

export interface EMIScheduleItem {
  installmentNo: number;
  principalComponent: number;
  interestComponent: number;
  totalPayment: number;
  outstandingBalance: number;
}

export interface LoanApplication {
  id: string;
  userId: string;
  userName: string;
  productType: LoanProductType;
  amountRequested: number;
  tenureMonths: number;
  interestRateApplied: number;
  status: ApplicationStatus;
  documents: Array<{ name: string; type: string; url: string }>;
  createdAt: string;
  updatedAt: string;
  comments?: string;
}

export interface KPIStats {
  activeLoans: number;
  totalDisbursed: number;
  overduePercentage: number;
  newApplications: number;
}