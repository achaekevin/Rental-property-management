# Rental Property Management System

## System Overview

The Rental Property Management System is a full-stack web application designed to streamline property administration and tenant operations. It provides a centralized platform for managing properties, unit availability, lease agreements, financial transactions, maintenance requests, and analytics.

## Key Features

- Multi-role authentication supporting Administrators, Property Owners, Managers, Tenants, and Staff
- Property and unit management with real-time occupancy and availability tracking
- Lease management including start/end dates, deposit tracking, and automated unit status updates
- Rent payment processing with M-Pesa STK push integration, payment recording, and receipts
- Expense management categorized by operational costs, repairs, and property maintenance
- Maintenance ticket lifecycle tracking from submission through assignment, progress, and resolution
- In-app notification delivery for payment alerts, maintenance updates, and lease notices
- Analytics dashboard presenting aggregated revenue, expense totals, net income, and occupancy metrics

## Technology Stack

### Frontend
- Framework: React 18
- Build Tool: Vite
- Component Library: Material-UI (MUI)
- Routing: React Router 7
- State Management: React Context API
- HTTP Client: Axios
- Charts: Recharts

### Backend
- Runtime: Node.js
- Framework: Express 4
- Database: MongoDB via Mongoose ODM
- Authentication: JSON Web Tokens (JWT) and bcryptjs
- Payments: Safaricom M-Pesa Express API

## Project Structure

Rental-property-management/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
└── backend/
    ├── functions/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── supabase/
    ├── tests/
    └── server.js
