export interface Salary {
  id: number;
  employeeId: number;
  departmentId: number;
  countryCode: string;
  amount: number;
  currency: string;
  amountUsd: number;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface CreateSalaryInput {
  employeeId: number;
  amount: number;
  currency: string;
  effectiveFrom: string;
}

export interface GroupStat {
  key: string;
  employees: number;
  avgUsd: number;
  minUsd: number;
  maxUsd: number;
  totalUsd: number;
}

export interface SalaryAnalytics {
  overall: GroupStat;
  byDepartment: GroupStat[];
  byCountry: GroupStat[];
}
