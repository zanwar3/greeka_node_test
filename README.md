<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Greeka ToDo API: NestJS + Postgres backend for managing tasks with CRUD, pagination and filters, Swagger docs, validation, TypeORM and migrations.

## Getting started

### 1) Clone and install
```bash
git clone <your-repo-url>
cd greeka-todo-api
npm ci
```

### 2) Start Postgres (Docker)
Port 55432 is used on host to avoid conflicts with local Postgres.
```bash
docker compose up -d db
docker compose ps
# expect: 0.0.0.0:55432->5432/tcp
```

### 3) Configure environment
You can export env inline or create a `.env` file. Defaults are shown below.
```bash
PORT=3000
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=55432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=greeka_todo
TYPEORM_LOGGING=false
```

### 4) Build and run migrations
```bash
npm run build
POSTGRES_HOST=127.0.0.1 POSTGRES_PORT=55432 POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres POSTGRES_DB=greeka_todo npm run db:migrate
```

### 5) Run the API
Development (watch mode):
```bash
POSTGRES_HOST=127.0.0.1 POSTGRES_PORT=55432 POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres POSTGRES_DB=greeka_todo npm run start:dev
```
Production build:
```bash
npm run build
POSTGRES_HOST=127.0.0.1 POSTGRES_PORT=55432 POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres POSTGRES_DB=greeka_todo npm run start:prod
```

### 6) Swagger docs
- Swagger UI: http://localhost:3000/api/docs
- API base path: http://localhost:3000/api

## API overview

Resource: `tasks`
- POST `/api/tasks` — Create Task
- GET `/api/tasks` — List Tasks (pagination + filters)
- GET `/api/tasks/:id` — Fetch One Task
- PATCH `/api/tasks/:id` — Update Task (status, priority, details)
- DELETE `/api/tasks/:id` — Delete Task

Status: `Pending`, `Done`, `In Progress`, `Paused`
Priority: `Red` (High), `Yellow` (Medium), `Blue` (Normal)

Filters on GET `/api/tasks`:
- `page` (default 1), `limit` (default 10, max 100)
- `search` (by name)
- `status`, `priority`, `isActive`

### Sample requests
Create
```bash
curl -sS -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"name":"Buy groceries","dueDate":"2025-12-31T17:00:00.000Z","status":"Pending","priority":"Blue","isActive":true}'
```
List
```bash
curl -sS 'http://localhost:3000/api/tasks?search=grocer&page=1&limit=5'
```
Fetch one
```bash
curl -sS http://localhost:3000/api/tasks/<id>
```
Update
```bash
curl -sS -X PATCH http://localhost:3000/api/tasks/<id> -H 'Content-Type: application/json' -d '{"status":"In Progress","priority":"Red"}'
```
Delete
```bash
curl -sS -X DELETE http://localhost:3000/api/tasks/<id> -i
```

## Docker notes (API container)
The `Dockerfile` builds the API. Best practice is to run migrations from the host first. Then:
```bash
docker compose up -d --build api
```
API: http://localhost:3000/api — Swagger: http://localhost:3000/api/docs

## Project layout and scripts
- `src/tasks/*` — entity, DTOs, controller, service, module
- `src/migrations/*` — TypeORM migrations
- `src/typeorm.config.ts` — DataSource for CLI
- `docker-compose.yml` — services for `db` and `api`
- Scripts: `start`, `start:dev`, `start:prod`, `build`, `db:migrate`, `db:revert`, `db:generate`

## Troubleshooting
- Postgres port in use: change the mapped host port in `docker-compose.yml` from `55432` to a free port
- macOS IPv6 refusal: use `POSTGRES_HOST=127.0.0.1` when running migrations/server
- Extensions: migrations enable required extensions; use Postgres 13+
