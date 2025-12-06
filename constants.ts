import { LoanProduct, LoanProductType } from './types';

export const LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: 'prod_gold',
    type: LoanProductType.GOLD,
    interestRateBase: 9.5,
    minTenureMonths: 3,
    maxTenureMonths: 24,
    processingFeePct: 0.5,
    maxLTV: 75,
  },
  {
    id: 'prod_bajaj',
    type: LoanProductType.BAJAJ,
    interestRateBase: 14.5,
    minTenureMonths: 6,
    maxTenureMonths: 36,
    processingFeePct: 1.5,
  },
  {
    id: 'prod_car',
    type: LoanProductType.CAR,
    interestRateBase: 8.75,
    minTenureMonths: 12,
    maxTenureMonths: 84,
    processingFeePct: 1.0,
  },
  {
    id: 'prod_home',
    type: LoanProductType.HOME,
    interestRateBase: 8.35,
    minTenureMonths: 60,
    maxTenureMonths: 360,
    processingFeePct: 0.25,
    maxLTV: 80,
  },
];

export const MOCK_ADMIN_USER = {
  email: 'admin@skfinance.com',
  password: 'admin',
};

export const MOCK_DEMO_USER = {
  email: 'user@demo.com',
  password: 'user',
};