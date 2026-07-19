# RentEase

RentEase is a full-stack rental marketplace for everyday equipment — electronics, tools, furniture, appliances, and outdoor gear. **Clients** list items for rent, **Users** browse and request to rent them, and a **Super Admin** approves new accounts and oversees activity through an audit log.

## Features

- **JWT authentication** with role-based access control (`SUPER_ADMIN`, `CLIENT`, `USER`)
- **Admin-gated onboarding** — new Client and User signups sit in a `PENDING` state until a Super Admin approves or rejects them
- **Product listings** — Clients create, edit, deactivate, and delete their inventory; Users browse, search, and filter by category
- **Rental request flow** — Users request to rent an item for a given quantity and number of days; the owning Client approves or declines the request; stock is adjusted automatically on approval
- **Role-based dashboards** — Super Admin sees platform-wide stats, Clients see their listings/earnings, Users see their spend and order status
- **Audit log** — every approval, rejection, and order decision is recorded and viewable by the Super Admin
- **Profile management** — update contact details and change password

## Tech stack

| Layer     | Technology |
|-----------|------------|
| Backend   | Java 17, Spring Boot, Spring Security, Spring Data JPA, JWT (jjwt), Lombok |
| Database  | MySQL |
| Frontend  | React, React Router, Axios |

## Project structure

```
RentEase/
├── rentease-backend/     # Spring Boot REST API
│   └── src/main/java/com/rentease/
│       ├── controller/   # REST endpoints
│       ├── service/      # Business logic
│       ├── repository/   # Spring Data JPA repositories
│       ├── entity/       # JPA entities
│       ├── dto/          # Request/response DTOs
│       ├── security/     # JWT filter, security config
│       ├── exception/    # Global exception handling
│       └── config/       # CORS and other app config
└── rentease-frontend/    # React SPA
    └── src/
        ├── api/          # Axios API clients
        ├── context/      # Auth context
        ├── components/   # Shared UI (layout, badges, modal)
        └── pages/        # Route-level pages
```

## Prerequisites

- JDK 17+
- Maven (or use the bundled `mvnw` wrapper — no separate install needed)
- MySQL 8+
- Node.js 18+ and npm

## Getting started

### 1. Create the database

The backend expects a MySQL instance and a database called `rentease_db`. By default it looks on port `3305` — check `rentease-backend/src/main/resources/application.properties` and adjust `spring.datasource.url`, `username`, and `password` to match your local setup.

```sql
CREATE DATABASE IF NOT EXISTS rentease_db;
```

Tables are created automatically on first run (`spring.jpa.hibernate.ddl-auto=update`).

### 2. Run the backend

```bash
cd rentease-backend
./mvnw spring-boot:run       # Windows: mvnw.cmd spring-boot:run
```

The API starts on `http://localhost:8080`.

### 3. Seed a Super Admin

There's no seeded admin account. Register a normal user first (through the app at `/register`, or via `POST /api/auth/register/user`), then promote it directly in MySQL:

```sql
UPDATE users
SET role = 'SUPER_ADMIN', status = 'APPROVED', active = 1
WHERE email = 'your-admin-email@example.com';
```

Log in with that account to approve future Client/User signups from the **Approvals** page.

### 4. Run the frontend

```bash
cd rentease-frontend
npm install
npm start
```

The app opens at `http://localhost:3000`.

> The backend's CORS config only allows requests from `http://localhost:3000`. If you change the frontend's port, update `CorsConfig.java` to match.

## Core API endpoints

| Method | Endpoint                     | Access          | Description                       |
|--------|-------------------------------|-----------------|------------------------------------|
| POST   | `/api/auth/register/user`    | Public          | Register as a renter               |
| POST   | `/api/auth/register/client`  | Public          | Register as a lister                |
| POST   | `/api/auth/login`            | Public          | Log in, receive JWT                |
| GET    | `/api/products`              | Authenticated   | Browse available products          |
| POST   | `/api/products`              | CLIENT          | Create a listing                   |
| GET    | `/api/products/my`           | CLIENT          | View your own listings             |
| POST   | `/api/orders`                | USER            | Request to rent a product          |
| GET    | `/api/orders/my`             | USER            | View your rental requests          |
| GET    | `/api/orders/incoming`       | CLIENT          | View incoming requests             |
| POST   | `/api/orders/{id}/approve`   | CLIENT          | Approve a rental request           |
| GET    | `/api/dashboard`             | Authenticated   | Role-specific summary stats        |
| GET    | `/api/admin/pending`         | SUPER_ADMIN     | View pending account approvals     |
| GET    | `/api/reports/audit-logs`    | SUPER_ADMIN     | View the full audit trail          |

## License

Add a license of your choice (e.g. MIT) before making this repository public.
