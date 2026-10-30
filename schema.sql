-- Employee Leave Management System - PostgreSQL schema
-- This mirrors the SQLAlchemy models. The application also creates these
-- objects automatically at startup via Base.metadata.create_all().

CREATE TYPE leave_type AS ENUM ('ANNUAL', 'CASUAL', 'MEDICAL');
CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE employees (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR NOT NULL,
    email       VARCHAR NOT NULL UNIQUE,
    department  VARCHAR NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_employees_id ON employees (id);
CREATE UNIQUE INDEX ix_employees_email ON employees (email);

CREATE TABLE leave_requests (
    id                SERIAL PRIMARY KEY,
    employee_id       INTEGER NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
    leave_type        leave_type NOT NULL,
    start_date        DATE NOT NULL,
    end_date          DATE NOT NULL,
    reason            TEXT NOT NULL,
    status            leave_status NOT NULL DEFAULT 'PENDING',
    rejection_reason  TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_leave_date_range CHECK (end_date >= start_date)
);

CREATE INDEX ix_leave_requests_id ON leave_requests (id);
