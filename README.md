# Smart Reminders

A NestJS-based smart reminder application that uses AI/LLM capabilities to help create and manage reminders.

## Project State

This is a **work-in-progress** application with the following current features:

- **Smart Reminder Creation**: Uses LLM (Language Model) to process natural language reminder requests
- **REST API**: Provides endpoints for creating reminders
- **Modular Architecture**: Built with NestJS modules for reminders, LLM integration, and configuration
- **Validation**: Input validation using class-validator
- **Error Handling**: Custom exception filters for LLM-related errors

## Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

## Installation

```bash
# Install dependencies
pnpm install
```

## Running the Application

```bash
# Development mode (with hot reload)
pnpm run start:dev

# Production mode
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

The application will start on `http://localhost:3000` (or the port specified in your configuration).

## API Endpoints

- `POST /reminders` - Create a new smart reminder

## Development

```bash
# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run e2e tests
pnpm run test:e2e

# Lint code
pnpm run lint

# Format code
pnpm run format
```

## Project Structure

```
src/
├── reminders/          # Reminder management
├── llm/               # Language Model integration
├── notifications/     # Notification system
├── config/           # Configuration management
└── common/           # Shared utilities and filters
```

## License

This project is unlicensed (private).
