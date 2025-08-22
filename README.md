# NPM Pulse

NPM Pulse is a live dashboard for watching new and updated packages as they roll in on the NPM registry. It provides a real-time feed of the latest activity on NPM, letting you see new releases and updates as they happen.

NPM package info sourced using [@warsam-e/npm](https://github.com/warsam-e/npm), which provides a simple API for accessing NPM package metadata, as well as search and user profile information.

## Stack
- [Bun](https://bun.sh/)
- [Elysia](https://elysiajs.com/)
- [SvelteKit](https://svelte.dev/docs/kit/introduction)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

### Install dependencies
```sh
bun i
```

### Build the project
```sh
bun build:site
```

### Run the project
- **Frontend**: `bun site:dev`
- **API**: `bun api:dev` or `bun api`

Or use Docker Compose (for api):
```sh
docker compose up --build
```

