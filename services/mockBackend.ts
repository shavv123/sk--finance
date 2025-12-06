import { 
  User, 
  UserRole, 
  LoanApplication, 
  ApplicationStatus, 
  LoanProductType, 
  EMIScheduleItem 
} from '../types';
import { LOAN_PRODUCTS } from '../constants';

// --- Local Storage Helpers to Simulate DB ---
const DB_KEYS = {
  USERS: 'sk_users',
  APPLICATIONS: 'sk_applications',
  SESSION: 'sk_session',
};

const getStore = <T>(key: string, defaultVal: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

const setStore = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Business Logic: EMI Calculator ---
export const calculateEMI = (principal: number, ratePerAnnum: number, tenureMonths: number) => {
  const monthlyRate = ratePerAnnum / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
};

export const generateAmortizationSchedule = (
  principal: number, 
  ratePerAnnum: number, 
  tenureMonths: number
): EMIScheduleItem[] => {
  const schedule: EMIScheduleItem[] = [];
  let balance = principal;
  const monthlyRate = ratePerAnnum / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  for (let i = 1; i <= tenureMonths; i++) {
    const interest = balance * monthlyRate;
    const principalComponent = emi - interest;
    balance -= principalComponent;
    
    // Handle floating point precision for last installment
    if (i === tenureMonths && Math.abs(balance) < 10) balance = 0;

    schedule.push({
      installmentNo: i,
      principalComponent: Math.round(principalComponent),
      interestComponent: Math.round(interest),
      totalPayment: Math.round(emi),
      outstandingBalance: Math.max(0, Math.round(balance)),
    });
  }
  return schedule;
};

// --- Auth Service ---

export const AuthService = {
  login: async (email: string): Promise<User> => {
    // Simulating API latency
    await new Promise(r => setTimeout(r, 500));
    
    if (email === 'admin@skfinance.com') {
      const admin: User = { id: 'admin-1', fullName: 'System Administrator', email, role: UserRole.ADMIN, isVerified: true };
      setStore(DB_KEYS.SESSION, admin);
      return admin;
    }
    
    const users = getStore<User[]>(DB_KEYS.USERS, []);
    let user = users.find(u => u.email === email);
    
    // Auto-register demo user if not found for easy testing
    if (!user) {
      user = { 
        id: `user-${Date.now()}`, 
        fullName: 'Demo User', 
        email, 
        role: UserRole.USER, 
        isVerified: true 
      };
      users.push(user);
      setStore(DB_KEYS.USERS, users);
    }
    
    setStore(DB_KEYS.SESSION, user);
    return user;
  },

  logout: () => {
    localStorage.removeItem(DB_KEYS.SESSION);
  },

  getCurrentUser: (): User | null => {
    return getStore<User | null>(DB_KEYS.SESSION, null);
  }
};

// --- Loan Application Service ---

export const LoanService = {
  createApplication: async (application: Partial<LoanApplication>): Promise<LoanApplication> => {
    await new Promise(r => setTimeout(r, 800));
    const apps = getStore<LoanApplication[]>(DB_KEYS.APPLICATIONS, []);
    
    const product = LOAN_PRODUCTS.find(p => p.type === application.productType);
    
    const newApp: LoanApplication = {
      id: `loan-${Date.now()}`,
      userId: application.userId!,
      userName: application.userName || 'Unknown',
      productType: application.productType || LoanProductType.GOLD,
      amountRequested: application.amountRequested || 0,
      tenureMonths: application.tenureMonths || 12,
      interestRateApplied: product ? product.interestRateBase : 10,
      status: ApplicationStatus.SUBMITTED,
      documents: application.documents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    apps.push(newApp);
    setStore(DB_KEYS.APPLICATIONS, apps);
    return newApp;
  },

  getApplications: async (isAdmin: boolean, userId?: string): Promise<LoanApplication[]> => {
    await new Promise(r => setTimeout(r, 400));
    const apps = getStore<LoanApplication[]>(DB_KEYS.APPLICATIONS, []);
    if (isAdmin) return apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return apps.filter(a => a.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  updateStatus: async (id: string, status: ApplicationStatus, comments?: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 600));
    const apps = getStore<LoanApplication[]>(DB_KEYS.APPLICATIONS, []);
    const idx = apps.findIndex(a => a.id === id);
    if (idx >= 0) {
      apps[idx].status = status;
      apps[idx].updatedAt = new Date().toISOString();
      if(comments) apps[idx].comments = comments;
      setStore(DB_KEYS.APPLICATIONS, apps);
    }
  },

  getStats: async () => {
    const apps = getStore<LoanApplication[]>(DB_KEYS.APPLICATIONS, []);
    const activeLoans = apps.filter(a => [ApplicationStatus.APPROVED, ApplicationStatus.DISBURSED].includes(a.status));
    const disbursed = apps
      .filter(a => a.status === ApplicationStatus.DISBURSED)
      .reduce((acc, curr) => acc + curr.amountRequested, 0);
    
    return {
      activeLoans: activeLoans.length,
      totalDisbursed: disbursed,
      overduePercentage: 2.4, // Mocked
      newApplications: apps.filter(a => a.status === ApplicationStatus.SUBMITTED).length
    };
  }
};