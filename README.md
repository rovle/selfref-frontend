# Self-Referential Quiz Builder

## Project Description

This project is a Nuxt frontend for the self-referential quiz generation backend.

### Key Features

- Multiple ways to generate self-referential quizzes:
  - Using a predefined difficulty level
  - Providing an answer list
  - Defining custom parameters
- User-friendly quiz-solving interface.
- Responsive design.
- To do: Export/import quizzes for sharing and backup.

## Setup

Make sure to install dependencies:

```bash
bun i
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun --bun run dev

# or set host to expose to the network
bun --bun run dev --host 0.0.0.0
```

## Production

Build the application for production:

```bash
bun --bun run build
```

Locally preview production build:

```bash
bun --bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
