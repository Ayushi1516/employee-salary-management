/** headcount and avgSalaryUsd are null when the employee service was unreachable. */
export interface Department {
  id: number;
  code: string;
  name: string;
  payrollTotalUsd: number;
  headcount: number | null;
  avgSalaryUsd: number | null;
}
