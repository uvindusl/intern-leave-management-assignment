# Employee Leave Management System

A full-stack Employee Leave Management System built for the Omibits (Pvt) Ltd. Software Engineering Intern assignment. Employees can be registered and leave requests can be submitted, reviewed, approved, or rejected by an admin.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | [FastAPI](https://fastapi.dev/) (Python), [SQLAlchemy](https://www.sqlalchemy.org/), [Pydantic](https://docs.pydantic.dev/) |
| Frontend | [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/) |
| Database | [PostgreSQL](https://www.postgresql.org/) (can also be adapted via SQLAlchemy) |
| Tooling | [uv](https://docs.astral.sh/uv/), [npm](https://www.npmjs.com/) |

## Features

### Employee Management
- Create an employee with name, email, and department
- List all employees
- Basic validation for required fields and email format
- Duplicate email prevention

### Leave Requests
- Submit a leave request (select employee, leave type, start/end dates, reason)
- Leave types: `ANNUAL`, `CASUAL`, `MEDICAL`
- Display all leave requests in a table with employee details
- Server-side validation prevents end date before start date
- Database-level check constraint as a safety net

### Administrator Functions
- View all leave requests
- Approve or reject pending requests
- Add a rejection reason when rejecting
- Status displayed as `PENDING`, `APPROVED`, or `REJECTED`

> **Note:** Authentication is not implemented for this assignment. The `/admin/leaves` view is for demonstration purposes only. No admin role/authorization has been added.

## Project Structure

```text
intern-leave-management-assignmet/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── database.py
│   ├── errors.py           # Global exception handlers
│   ├── exceptions.py       # Domain exceptions
│   ├── main.py             # FastAPI app setup
│   ├── models.py           # SQLAlchemy models + enums
│   ├── schema.py           # Pydantic request/response schemas
│   ├── repositories/       # Data access layer
│   ├── services/           # Business logic layer
│   └── routers/            # API route handlers
├── frontend/               # React + Vite frontend
├── tests/                  # Pytest tests for business rules
├── schema.sql              # PostgreSQL schema (documentation)
├── .env.example            # Backend environment template
└── pyproject.toml          # Python dependencies
```

The backend follows a layered architecture: `routers/` (controllers) → `services/` (business logic) → `repositories/` (database access), with `exceptions.py` and `errors.py` handling errors consistently.

## Database Schema

- **employees**: `id`, `name`, `email` (unique), `department`, `created_at`
- **leave_requests**: `id`, `employee_id` (FK -> employees.id, ON DELETE CASCADE), `leave_type` (enum), `start_date`, `end_date`, `reason`, `status` (enum, default PENDING), `rejection_reason` (nullable), `created_at`, `updated_at`
- Relationship: One employee has many leave requests
- Constraints: Unique email, check constraint `end_date >= start_date`, foreign key, non-null constraints
- Enums: `leave_type` (`ANNUAL`, `CASUAL`, `MEDICAL`), `leave_status` (`PENDING`, `APPROVED`, `REJECTED`)

See [`schema.sql`](./schema.sql) for the full PostgreSQL DDL.

## API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint | Purpose | Notes |
|---|---|---|---|
| `POST` | `/api/employees` | Create employee | Validates required fields and email format. Returns 409 on duplicate email. |
| `GET` | `/api/employees` | List employees | Returns all employees. |
| `POST` | `/api/leaves` | Submit leave request | Validates employee existence, leave type, and date range. Returns 400 if end date < start date. |
| `GET` | `/api/leaves` | List leave requests | Returns all requests with nested employee details. |
| `PATCH` | `/api/leaves/{id}/approve` | Approve request | Only allowed if status is PENDING. Sets to APPROVED and clears rejection reason. Returns 409 otherwise. |
| `PATCH` | `/api/leaves/{id}/reject` | Reject request | Requires `rejection_reason` (non-empty). Only allowed if status is PENDING. Sets to REJECTED with reason. Returns 409 otherwise. |

### Example Requests

```bash
# Create employee
curl -X POST http://localhost:8000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "department": "HR"}'

# List employees
curl http://localhost:8000/api/employees

# Submit leave request
curl -X POST http://localhost:8000/api/leaves \
  -H "Content-Type: application/json" \
  -d '{"employee_id": 1, "leave_type": "ANNUAL", "start_date": "2026-11-01", "end_date": "2026-11-03", "reason": "Vacation"}'

# List leave requests
curl http://localhost:8000/api/leaves

# Approve
curl -X PATCH http://localhost:8000/api/leaves/1/approve

# Reject
curl -X PATCH http://localhost:8000/api/leaves/2/reject \
  -H "Content-Type: application/json" \
  -d '{"rejection_reason": "Insufficient notice"}'
```

Interactive API documentation is available at `http://localhost:8000/docs` when the backend is running.

## Setup and Installation

### Prerequisites
- [Python](https://www.python.org/) 3.14+
- [uv](https://docs.astral.sh/uv/) package manager
- [Node.js](https://nodejs.org/) 18+ and npm
- [PostgreSQL](https://www.postgresql.org/) (or Docker with PostgreSQL running)

### 1) Database Setup (PostgreSQL)

If using Docker (as in this environment):
```bash
docker run -d --name postgres18 -p 5432:5432 -e POSTGRES_HOST_AUTH_METHOD=trust postgres:18
```

Create the database:
```bash
docker exec postgres18 psql -U postgres -c "CREATE DATABASE intern_leave_db;"
```

### 2) Backend Setup

```bash
# From repository root
cd /path/to/intern-leave-management-assignme

# Copy environment file and update credentials if needed
cp .env.example .env

# Install dependencies
uv sync

# Run the backend (dev mode)
uv run fastapi dev app/main.py
```

The API will be available at `http://localhost:8000`. Tables are created automatically on startup via SQLAlchemy.

### 3) Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure API URL
cp .env.example .env

# Run the frontend (dev mode)
npm run dev
```

The app will be available at `http://localhost:5173`.

## Running Tests

From the repository root:
```bash
uv run pytest -q
```

Tests cover employee creation/validation/duplicates, leave submission/date validation/employee checks, approval/rejection flows and invalid transitions, list responses with employee details, and a database-level check constraint.

## Design Decisions

- **Layered architecture**: Split into routers (HTTP), services (business rules like date validation and status transitions), and repositories (database operations) to keep concerns separated as required.
- **PostgreSQL + SQLAlchemy**: Chosen for relational integrity (FKs, enums, checks) and straightforward mapping. SQLAlchemy models define the schema; `create_all` is used for quick setup.
- **Pydantic validation**: Used for request validation (email format, required fields, enums). Business rules that cross entities (e.g., "employee must exist", "end >= start", "only PENDING can be changed") live in the service layer.
- **Domain exceptions + global handlers**: Services raise `NotFoundError`/`ValidationError`/`ConflictError`, and `app/errors.py` maps them to appropriate HTTP status codes with consistent JSON error responses.
- **CORS enabled**: Open for local development to allow the Vite frontend to call the API.
- **Frontend structure**: Follows a clean component/page/service split with React Router for navigation (Employees, Submit Leave, Admin Panel).

## Challenges Faced

- **SQLite vs PostgreSQL differences**: Needed to use `func.now()` instead of `now()` for cross-database compatibility and adjusted enum/timestamp handling.
- **Type imports with Vite**: With `verbatimModuleSyntax` enabled, TypeScript interfaces had to be imported with `import type` to avoid runtime module errors.
- **API path consistency**: Normalized routes to match the expected endpoint structure and aligned frontend API calls.
- **Business rule placement**: Balancing validation between Pydantic schemas and the service layer to return meaningful, predictable errors.

## Security Notes

- No authentication/authorization is implemented. The admin actions (approve/reject) are accessible without protection. This matches the assignment note: **do not claim administrator actions are secure unless proper authorization is implemented**.
- Do not commit secrets. Use `.env` files locally (see `.env.example`).
- In production, CORS origins should be restricted, and all admin endpoints should be protected with role-based access control.

## Screenshots

Screenshots of the working application are stored in [`screenshots/`](./screenshots/).

- `employees.png` - Employee creation and employee list
- `submit-leave.png` - Leave request submission form
- `admin-leaves.png` - Admin panel with approve/reject and rejection reason

## Incomplete Requirements / Notes

- No authentication/authorization implemented (optional per assignment).
- Using `Base.metadata.create_all()` instead of migrations (a `schema.sql` is provided for reference/documentation).
- Tests are included under `tests/` for important business rules.

## Submission Checklist

- [x] Complete source code (backend + frontend)
- [x] Database schema documented (`schema.sql`)
- [x] README with installation and execution instructions
- [x] API documentation/examples
- [x] Screenshots folder included
- [x] Design decisions and challenges documented
- [x] Tests for important business rules
- [x] Meaningful git history
- [x] No secrets committed
