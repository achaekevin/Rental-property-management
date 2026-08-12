# Rental Property Management System (MySQL 8.4 + Sequelize)

## System Overview

The Rental Property Management System is a production-grade full-stack web application for property administration, tenant operations, financial accounting, and maintenance workflows. It is backed by a normalized **MySQL 8.4** relational database with **Sequelize ORM**, strict schema definitions, migrations, seeders, Role-Based Access Control (RBAC), Granular Permission Architecture, multi-tenancy, and financial transaction integrity.

---

## Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Component Library:** Material-UI (MUI v5)
- **Routing:** React Router 7
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express 4
- **Database:** MySQL 8.4
- **ORM:** Sequelize 6
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Validation:** express-validator
- **Security:** Helmet, express-rate-limit, CORS, parameterized queries, Role & Resource Authorization
- **Testing:** Node.js test runner (`node:test`) & Supertest

---

## Project Structure

```
Rental-property-management/
├── backend/
│   ├── config/             # Database connection & Sequelize configuration
│   ├── controllers/        # Express route request handlers
│   ├── middleware/         # Auth verification, RBAC & permission guards
│   ├── migrations/         # Database migration scripts (MySQL 8.4)
│   ├── models/             # Sequelize model definitions & associations
│   ├── routes/             # REST API route endpoints
│   ├── seeders/            # Initial system data & role seed scripts
│   ├── services/           # Business logic & analytics services
│   ├── tests/              # Backend test suite (node:test)
│   ├── validators/         # Input request validators
│   ├── .sequelizerc        # Sequelize CLI configuration
│   └── server.js           # Express application entry point
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # App icons & graphic assets
│   │   ├── components/     # UI components & role dashboards
│   │   ├── context/        # React authentication & dark mode context
│   │   ├── services/       # Axios API client services
│   │   ├── App.jsx         # Main application component & routes
│   │   └── main.jsx        # React DOM entry point
│   ├── index.html          # HTML entry template
│   └── vite.config.js      # Vite build configuration
└── README.md
```
