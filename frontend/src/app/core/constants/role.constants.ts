export const ROLES = {
  ADMIN: 'HR_ADMIN',
  VIEWER: 'HR_VIEWER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  HR_ADMIN: 'HR admin (can edit)',
  HR_VIEWER: 'HR viewer (read-only)',
};
