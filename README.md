# ARIS — Accident Reporting & Investigation System

ARIS is a web application for managing vehicle-accident reporting, investigation, evidence, approvals, and statutory loss-reporting workflows for the Southern Provincial health sector.

It provides a complete case lifecycle: report an accident, collect evidence, prepare the required F.R. forms, route each document through the appropriate approval chain, retain an audit trail, and generate multilingual PDF records.

## Contents

- [Key capabilities](#key-capabilities)
- [Architecture](#architecture)
- [Workflow](#workflow)
- [Technology stack](#technology-stack)
- [Repository layout](#repository-layout)
- [Local setup](#local-setup)
- [Configuration](#configuration)
- [Development commands](#development-commands)
- [API overview](#api-overview)
- [PDF generation](#pdf-generation)
- [Testing and quality checks](#testing-and-quality-checks)
- [Security notes](#security-notes)

## Key capabilities

- Role- and institution-aware accident reporting and case management.
- Vehicle, institution, user, driver, and evidence management.
- Revisioned F.R. 104(3), F.R. 104(4), and F.R. 109 forms.
- Configurable, multi-step approval workflows with recommendations, approvals, change requests, signatures, comments, and full history.
- Digital signatures for applicable approval roles.
- Attachment upload, preview, and download for FR1044 supporting documents.
- Multilingual Sinhala, Tamil, and English PDF generation using the official-style form layouts.
- Dashboard and analytics views for loss, recovery, trends, hotspots, and risk analysis.
- In-app notifications, web push subscriptions, and Laravel Reverb real-time notification support.
- Case history and audit logging for workflow actions and document changes.

## Architecture

ARIS is a split frontend/backend application:

```text
React + TypeScript + Vite
        │
        │ HTTPS / JSON API / Sanctum cookies
        ▼
Laravel API
        │
        ├── MySQL or SQLite database
        ├── Queue, cache, and session storage
        ├── File storage for evidence and signatures
        ├── mPDF for F.R. form PDFs
        └── Laravel Reverb for real-time events
```

The frontend uses the shared Axios client and TanStack Query for API state. Backend business rules are concentrated in Laravel services, including workflow resolution, approval progression, document persistence, notifications, and PDF generation.

## Workflow

Each accident belongs to an `AccidentCase` with a current stage and status.

1. An accident is reported and a case is created.
2. The case progresses through FR1043.
3. Final FR1043 approval moves the case to FR1044.
4. Final FR1044 approval moves the case to FR109 with status `IN_PROGRESS`.
5. FR109 is prepared and routed through its approval workflow.
6. Only final FR109 approval changes the case status to `COMPLETED`.

Forms are revisioned. A rejected revision is preserved, while the creator submits a new revision using the same reference number. Approval records, signatures, comments, and case-history events remain associated with their document revision.

FR109 routing can extend into Ministry approval steps when the loss exceeds configured thresholds. The resolver calculates the relevant loss value from the form data and selects approvers according to the case institution and workflow settings.

## Technology stack

| Area | Technology |
| --- | --- |
| Backend | Laravel 13, PHP 8.3 |
| Frontend | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS 4 |
| API state | TanStack Query, Axios |
| Authentication | Laravel Sanctum |
| Authorization | Spatie Laravel Permission |
| Database | SQLite for simple local setup; MySQL supported |
| Real time | Laravel Reverb, Laravel Echo, Pusher protocol |
| PDF generation | mPDF 8.2 with Sinhala and Tamil font support |
| Notifications | Database notifications, web push, Reverb |
| Maps and analytics | Leaflet, Google Map React, Recharts |

## Repository layout

```text
aris/
├── aris-backend/                 Laravel API
│   ├── app/                      Controllers, services, models, policies
│   ├── database/                 Migrations, factories, seeders
│   ├── resources/views/pdf/      FR1043, FR1044, and FR109 PDF templates
│   ├── resources/fonts/          Sinhala and Tamil PDF fonts
│   ├── routes/api.php            API routes
│   └── config/mpdf.php           PDF rendering configuration
├── aris-frontend/                React application
│   ├── src/components/           Pages and reusable UI components
│   ├── src/services/             Shared Axios API clients
│   ├── src/hooks/                TanStack Query hooks
│   ├── src/types/                TypeScript contracts
│   └── src/i18n/                 English and Sinhala translations
└── README.md
```

## Local setup

### Prerequisites

- PHP 8.3 or newer with the extensions required by Laravel and mPDF.
- Composer 2.
- Node.js 20+ and npm.
- A supported database. SQLite is the default example configuration; MySQL can be used for shared/local environments.

### 1. Clone and install dependencies

```bash
git clone <repository-url> aris
cd aris

cd aris-backend
composer install
npm install

cd ../aris-frontend
npm install
```

On Windows PowerShell, use `npm.cmd` when PowerShell execution policy blocks `npm.ps1`.

### 2. Configure the backend

```bash
cd aris-backend
copy .env.example .env
php artisan key:generate
```

Update `.env` with your database and local application settings. For SQLite, create the database file if it does not already exist:

```bash
New-Item -ItemType File -Force database/database.sqlite
```

Then run migrations and, where appropriate for your environment, seed the required roles and reference data:

```bash
php artisan migrate
# php artisan db:seed
```

Create the storage symlink when serving uploaded evidence or signature files locally:

```bash
php artisan storage:link
```

### 3. Configure the frontend

Create `aris-frontend/.env.local` if the API is not available at the default URL:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api
VITE_REVERB_APP_KEY=
VITE_REVERB_HOST=127.0.0.1
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
VITE_WEB_PUSH_PUBLIC_KEY=
```

The frontend defaults to `http://localhost:8000/api` when `VITE_API_BASE_URL` is not set.

### 4. Start the application

Use separate terminals:

```bash
# Terminal 1 — Laravel API
cd aris-backend
php artisan serve

# Terminal 2 — React frontend
cd aris-frontend
npm run dev
```

For a local backend development stack that includes the queue listener, logs, Reverb, and Laravel Vite process:

```bash
cd aris-backend
composer run dev
```

The React application is normally available at `http://localhost:5173` and the API at `http://localhost:8000`.

## Configuration

Important backend environment variables include:

| Variable | Purpose |
| --- | --- |
| `APP_URL` | Laravel application URL. |
| `DB_*` | Database connection configuration. |
| `FRONTEND_URLS` | Comma-separated frontend origins allowed by CORS. |
| `SANCTUM_STATEFUL_DOMAINS` | Frontend domains trusted by Sanctum. |
| `FILESYSTEM_DISK` | Evidence and signature storage disk. |
| `QUEUE_CONNECTION` | Queue backend for asynchronous work. |
| `CACHE_STORE` | Cache backend. |
| `REVERB_*` | Laravel Reverb server and client connection settings. |
| `WEB_PUSH_VAPID_*` | Server-side web-push credentials. |

Do not commit `.env`, private VAPID keys, Reverb secrets, database passwords, or other credentials.

## Development commands

Run commands from the indicated application directory.

| Area | Command | Purpose |
| --- | --- | --- |
| Backend | `composer run dev` | Start Laravel, queue worker, logs, Reverb, and backend Vite. |
| Backend | `composer test` | Clear config and run Laravel tests. |
| Backend | `./vendor/bin/pint` | Format PHP using Laravel Pint. |
| Backend | `php artisan route:list` | Inspect registered API routes. |
| Frontend | `npm run dev` | Start the Vite development server. |
| Frontend | `npm run build` | Type-check and build the frontend. |
| Frontend | `npm run types:check` | Run TypeScript checks. |
| Frontend | `npm run lint:check` | Run ESLint without writing changes. |

## API overview

All protected endpoints are under `/api` and require Sanctum authentication, an active role session, and an assigned institution.

| Area | Example endpoints |
| --- | --- |
| Authentication | `POST /api/login`, `POST /api/logout`, `GET /api/profile` |
| Core records | `/api/users`, `/api/institutions`, `/api/vehicles`, `/api/accidents` |
| Cases | `GET /api/cases`, `GET /api/cases/{case}`, `GET /api/cases/{case}/history` |
| Evidence | `POST /api/accidents/{accident}/evidence`, `GET /api/accidents/{accident}/evidence/{evidence}` |
| Approvals | `GET /api/approvals/pending`, `POST /api/approvals/{approval}/approve`, `POST /api/approvals/{approval}/reject` |
| FR1043 | `GET /api/cases/{case}/fr1043`, `POST /api/fr1043/{form}/submit`, `GET /api/fr1043/{form}/pdf` |
| FR1044 | `GET /api/cases/{case}/fr1044`, `POST /api/fr1044/{form}/submit`, attachment and PDF endpoints |
| FR109 | `GET /api/cases/{case}/fr109`, `POST /api/cases/{case}/fr109/submit`, `GET /api/fr109/{form}/pdf` |
| Operations | `GET /api/dashboard/statistics`, `GET /api/analytics`, `/api/notifications`, `/api/audit-logs` |

See [aris-backend/routes/api.php](aris-backend/routes/api.php) for the full route definition.

## PDF generation

FR1043, FR1044, and FR109 documents are rendered by mPDF from Blade templates in `aris-backend/resources/views/pdf/`.

- The PDF service uses A4 output and the `config/mpdf.php` settings.
- Iskoola Pota is used for Sinhala content; Noto Sans Tamil supports Tamil shaping.
- PDF preview and download requests are authenticated and returned as blobs to the frontend.
- Official-form layouts rely on table-based geometry and should be visually reviewed after layout changes.

## Testing and quality checks

Before opening a pull request or deploying a change, run the relevant checks:

```bash
# Backend
cd aris-backend
php artisan test
./vendor/bin/pint --test

# Frontend
cd ../aris-frontend
npm run types:check
npm run lint:check
npm run build
```

For workflow, notification, attachment, and PDF changes, also verify the real browser/API path with representative data. Static checks alone do not prove an approval route, PDF render, file download, or real-time delivery works against a deployed database.

## Security notes

- Keep secrets in environment variables only.
- Restrict CORS and Sanctum stateful domains to trusted frontend origins in each environment.
- Use HTTPS, secure cookies, production queue workers, and a managed secret store outside local development.
- Maintain role and institution assignments carefully because they control document visibility and approval eligibility.
- Back up database records and uploaded evidence before schema or storage changes.

## License

No license file is currently included in this repository. Treat the project as internal/proprietary unless the project owner provides a license.
