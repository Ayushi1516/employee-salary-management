# Employee Salary Management System – Architecture & Design

## 🏗️ Microservice Architecture

**Services:**
- **Employee Service** → CRUD for employee records, profile management.
- **Salary Service** → CRUD for salaries, reporting endpoints (avg, highest, distribution).
- **Department Service** → CRUD for departments, aggregates.
- **Audit Service** → Logs all changes (salary updates, employee edits).
- **API Gateway** → Routes requests, authentication, authorization.
- **Config/Discovery Service** → Service registry (Eureka).
- **Communication** → REST for synchronous calls, Kafka for salary update events.
- **Resilience** → Resilience4j for retries/circuit breaking.

---

## 🗂️ ER Diagram (Entities & Relationships)

**Entities:**
- **Employee** (`employee_id`, `first_name`, `last_name`, `department_id`, `country`, `hire_date`, `email`)
- **Department** (`department_id`, `name`, `country`)
- **Salary** (`salary_id`, `employee_id`, `amount`, `currency`, `effective_date`)
- **Audit_Log** (`log_id`, `entity`, `change_type`, `old_value`, `new_value`, `changed_by`, `changed_at`)

**Relationships:**
- One Department → Many Employees
- One Employee → Many Salaries
- Audit_Log tracks changes for Employee/Salary

**Diagram (textual):**
Department (1) ---- (M) Employee (1) ---- (M) Salary
|
|---- (M) Audit_Log

---

