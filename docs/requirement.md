# Employee Salary Management System – Requirements Document

## Goal
Provide ACME’s HR team with a web‑based salary management system to replace Excel spreadsheets, enabling efficient management of 10,000 employees’ salary data across multiple countries and generating insights into how the organization pays people.

---

## Scope & Features

### In Scope
- **Authentication & Role Management**
  - Secure login for HR managers (single persona).

- **Employee Management**
  - CRUD operations for employee records.
  - Department assignment and country tracking.
  - Full profile view with edit capability.
  - File upload support (PDF/Excel for bulk updates).

- **Salary Management**
  - CRUD operations for salaries.
  - Bulk upload/update via CSV/Excel import.
  - Department‑wise and country‑wise salary breakdown.
  - Currency display.
  - Audit trail for salary changes.

- **Reporting & Insights**
  - Dashboard with charts:
    - Average salary by department/country.
    - Highest salary.
    - Total employees.
  - Export reports to CSV/PDF.

- **Seeding**
  - Script to generate 10,000 employees with realistic salary ranges.

---

## Deliberately Left Out
- **Employee Self‑Service Portal** → Only HR persona is required; employees don’t log in.
- **Payroll Processing** → Actual salary disbursement and banking integration are complex and compliance‑heavy.
- **Taxation/Benefits Management** → Country‑specific rules add unnecessary scope.
- **Mobile App** → Web‑based UI is sufficient for HR manager persona.
- **Advanced AI Analytics** → Keep reporting simple and deterministic for clarity.

**Reasoning:** These exclusions keep the solution focused on the HR manager’s needs and avoid unnecessary complexity. The persona is explicitly HR Manager, so employee login/self‑service is deliberately excluded. It can be mentioned as a possible enhancement to show product thinking.

---

## Technical Constraints
- **Backend:** Java 21 + Spring Boot (microservice architecture).
- **Database:** MySQL (relational).
- **Frontend:** Angular 21 + Tailwind CSS.
- **Deployment:** Dockerized, cloud‑ready.
- **Testing:** JUnit (backend), Jest/Cypress (frontend).

---

