import { EmployeeStatus } from '../models/employee.model';

export interface Country { code: string; name: string; currency: string; }

/** Keep in sync with db/seed/generate_seed.py and the Salary Service FX rates. */
export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'BR', name: 'Brazil', currency: 'BRL' },
];

export const CURRENCIES: string[] = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'JPY', 'BRL'];

export interface StatusOption { value: EmployeeStatus; label: string; badgeClass: string; }

export const EMPLOYEE_STATUSES: StatusOption[] = [
  { value: 'ACTIVE', label: 'Active', badgeClass: 'badge-success' },
  { value: 'ON_LEAVE', label: 'On leave', badgeClass: 'badge-warning' },
  { value: 'TERMINATED', label: 'Terminated', badgeClass: 'badge-muted' },
];

export function currencyForCountry(code: string | null | undefined): string {
  return COUNTRIES.find((c) => c.code === code)?.currency ?? 'USD';
}
