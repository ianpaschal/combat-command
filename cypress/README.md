# Cypress Integration Tests

This directory contains end-to-end integration tests for the Combat Command application using Cypress.

## Getting Started

### Prerequisites

1. Make sure you have the application running locally:
   ```bash
   npm run dev
   ```
   This will start both the frontend (Vite) and backend (Convex) servers.

2. The tests expect the application to be running on `http://localhost:5173` (default Vite port).

### Running Tests

#### Open Cypress Test Runner (Interactive Mode)
```bash
npm run test:e2e:open
```
This opens the Cypress Test Runner where you can:
- See all available tests
- Run tests individually or in groups
- Watch tests run in real-time
- Debug tests interactively

#### Run Tests in Headless Mode
```bash
npm run test:e2e
```
This runs all tests in the background without opening the browser UI.

#### Run Tests in Headed Mode
```bash
npm run test:e2e:headed
```
This runs tests with the browser visible (useful for debugging).

