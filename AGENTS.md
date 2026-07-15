# Repository Guidelines

## Project Structure & Module Organization

This repository contains two applications:

- `aris-frontend/`: React 19, TypeScript, Vite, Tailwind CSS application. Source is in `src/`; reusable UI is organized under `components/`, API clients under `services/`, local async hooks under `hooks/`, and shared contracts under `types/`.
- `aris-backend/`: Laravel 13 API. Application code is in `app/`; routes are in `routes/api.php`; database migrations, factories, and seeders are under `database/`; tests belong in `tests/`.

Keep features aligned with these existing folders. For example, add a new API resource as `src/services/<feature>.service.ts`, its stateful hook as `src/hooks/use<Feature>.ts`, and Laravel request validation under `app/Http/Requests/<Feature>/`.

## Build, Test, and Development Commands

Run commands from the relevant application directory.

- `cd aris-frontend && npm run dev`: start the Vite development server.
- `cd aris-frontend && npm run build`: type-check and build the production frontend.
- `cd aris-frontend && npm run lint`: run ESLint across the frontend.
- `cd aris-backend && composer run dev`: run Laravel, queue listener, logs, and Vite together.
- `cd aris-backend && composer test`: clear config and run the Laravel test suite.
- `cd aris-backend && ./vendor/bin/pint`: format PHP using Laravel Pint.

## Coding Style & Naming Conventions

Match surrounding code before introducing abstractions. Frontend uses TypeScript, functional components, `@/` imports, PascalCase component filenames, and camelCase hooks/services such as `useAccident.ts` and `accident.service.ts`. Keep API calls in services and loading/error state in hooks; use the configured Axios client and `react-toastify` for user feedback.

Backend follows Laravel conventions: PascalCase classes, singular models, plural migrations, resource controllers, Form Requests for validation, and API Resources for responses. Do not place business logic in controllers when an existing service pattern applies.

## Testing Guidelines

Run frontend type checking and linting before submitting UI/API changes. Add Laravel feature or unit tests in `aris-backend/tests/` for new endpoint behavior; use descriptive names such as `FR1043DraftTest.php`. No frontend test runner is currently configured, so verify affected flows manually and document that verification in the PR.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit-style messages, e.g. `feat: Add FR1043Controller` and `fix: Handle validation errors`. Keep commits focused and imperative. PRs should summarize behavior changes, identify affected frontend/backend areas, link the relevant issue or requirement, list validation commands run, and include screenshots for visible UI changes. Never commit `.env` files, credentials, tokens, or production data.
