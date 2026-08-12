# Rental Property Management System (MySQL 8.4 + Sequelize)

## System Overview

The Rental Property Management System (Renta) is a production-grade full-stack web application for property administration, tenant operations, financial accounting, and maintenance workflows. It is backed by a normalized **MySQL 8.4** relational database with **Sequelize ORM**, strict schema definitions, migrations, seeders, Role-Based Access Control (RBAC), Granular Permission Architecture, multi-tenancy, and financial transaction integrity.

---

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express 4
- **Database:** MySQL 8.4
- **ORM:** Sequelize 6
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Validation:** express-validator
- **Security:** Helmet, express-rate-limit, CORS, parameterized queries, Role & Resource Authorization
- **Testing:** Node.js test runner (`node:test`) & Supertest

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Component Library:** Material-UI (MUI v5)
- **Routing:** React Router 7
- **HTTP Client:** Axios

---

## System Roles & Granular Permission Architecture

Renta enforces a strict **Role-Level + Resource-Level Authorization System** with explicit permission guards across all REST API endpoints:

### 1. Super Administrator (`SUPER_ADMINISTRATOR`)
- **Scope:** Platform-level control across all organizations.
- **Capabilities:** User management across all roles, organization administration, global audit logs, system configurations, and system health status.
- **Permissions:** `user.*`, `role.*`, `system.settings.*`, `audit.view`, `property.*`, `unit.*`, `tenant.*`, `lease.*`, `invoice.*`, `payment.*`, `expense.*`, `maintenance.*`, `report.*`.

### 2. Property Manager (`PROPERTY_MANAGER`)
- **Scope:** Operational management for properties within their assigned organization.
- **Capabilities:** Property administration, tenant onboarding, lease agreements, invoice generation, expense tracking, maintenance assignment, and operational reports.
- **Permissions:** `property.*`, `unit.*`, `tenant.*`, `lease.*`, `invoice.*`, `payment.*`, `expense.*`, `maintenance.*`, `report.*`, `user.view`, `user.create`, `user.update`.

### 3. Landlord / Property Owner (`LANDLORD`)
- **Scope:** Investment performance monitoring for owned properties.
- **Capabilities:** Read-only monitoring of owned properties, occupancy rates, collected rent, expenses, net income, and lease expiration alerts.
- **Permissions:** `property.view`, `unit.view`, `tenant.view`, `lease.view`, `maintenance.view`, `expense.view`, `payment.view`, `report.view`, `report.financial`, `report.occupancy`. *(Restricted from create, update, or delete actions).*

### 4. Tenant (`TENANT`)
- **Scope:** Self-service portal scoped strictly to active lease and unit.
- **Capabilities:** Profile management, lease document viewing, rent invoices, interactive **M-Pesa STK Push rent payments**, and maintenance request submission/tracking.
- **Permissions:** `tenant.view`, `tenant.update`, `lease.view`, `invoice.view`, `payment.view`, `payment.create`, `maintenance.view`, `maintenance.create`, `maintenance.update`.

---

## Database Architecture & Key Modules

1. **Authentication & RBAC:** `users`, `roles`, `permissions`, `role_permissions`, `user_organizations`, `user_sessions`, `password_reset_tokens`
2. **Multi-Tenancy:** `organizations`
3. **Landlords & Tenants:** `landlords`, `tenants`, `tenant_emergency_contacts`
4. **Properties & Units:** `properties`, `property_types`, `buildings`, `floors`, `units`, `unit_types`, `rooms`
5. **Leasing:** `leases`, `lease_tenants`, `lease_charges`, `lease_renewals`, `tenant_unit_history`
6. **Financials:** `invoices`, `invoice_items`, `payments`, `payment_allocations`, `payment_methods`, `mpesa_transactions`, `bank_transactions`
7. **Expenses & Vendors:** `expense_categories`, `expenses`, `vendors`
8. **Maintenance:** `maintenance_categories`, `maintenance_requests`, `maintenance_comments`, `maintenance_work_orders`
9. **Utilities:** `utility_types`, `meters`, `meter_readings`, `utility_bills`
10. **Inspections:** `inspections`, `inspection_items`
11. **Documents:** `documents`
12. **Notifications:** `notifications`, `notification_preferences`, `announcements`, `announcement_recipients`
13. **Auditing:** `audit_logs`
