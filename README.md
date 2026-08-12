# Rental Property Management System (MySQL 8.4 + Sequelize)

## System Overview

The Rental Property Management System is a production-grade full-stack web application for property administration, tenant operations, financial accounting, and maintenance workflows. It is backed by a normalized **MySQL 8.4** relational database with **Sequelize ORM**, strict schema definitions, migrations, seeders, Role-Based Access Control (RBAC), multi-tenancy, and financial transaction integrity.

---

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express 4
- **Database:** MySQL 8.4
- **ORM:** Sequelize 6
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Validation:** express-validator
- **Security:** Helmet, express-rate-limit, CORS, parameterized queries
- **Testing:** Node.js test runner (`node:test`) & Supertest

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Component Library:** Material-UI (MUI v5)
- **Routing:** React Router 7
- **HTTP Client:** Axios

---

## Key Modules & Database Architecture

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

---

## Getting Started & Installation

### 1. Environment Setup

Copy `.env.example` in the `backend` directory to `.env` and fill in your MySQL credentials:

```bash
cp backend/.env.example backend/.env
```

### 2. Database Migrations & Seeders

Run Sequelize CLI commands inside the `backend` folder:

```bash
# Run database migrations
npx sequelize-cli db:migrate

# Seed initial system roles, permissions, organization, and admin user
npx sequelize-cli db:seed:all
```

### 3. Running Backend Services

```bash
cd backend
npm run dev
```

### 4. Running Integration Tests

```bash
cd backend
npm test
```

---

## Final Verification Summary

- [x] **Database Schema:** 40+ relational tables mapped with foreign key constraints, indexes, and precision financial DECIMAL data types.
- [x] **Sequelize ORM:** Models and associations cleanly separated from business logic.
- [x] **Migrations & Seeders:** Deterministic migration (`001-initial-schema.js`) and seeder (`001-initial-seed.js`).
- [x] **Layered Architecture:** Routes → Validators → Controllers → Services → Models.
- [x] **RBAC & Security:** Role authorization middleware, Helmet headers, rate limiting, and password hashing.
- [x] **Testing:** Passed 100% of unit and architecture verification tests.
