# Implementation Plan - Physical Health Integration

## Proposed Changes

### Backend
1. **Model Updates**:
    - `server/models/Health.js`: Add `userId` field.
    - `server/models/Workout.js`: [NEW] Create model for workout logs.
2. **Routes**:
    - `server/routes/health.routes.js`: Implement BMI, Habits, Water, and Symptom history.
    - `server/routes/workout.routes.js`: [NEW] Implement `/log` and `/history`.
3. **Server**:
    - `server/server.js`: Mount routes and remove redundant inline code.

### Frontend
1. **Routing**:
    - `client/src/App.jsx`: Add `/profile` and `/workout` routes.
2. **Navigation**:
    - `client/src/pages/PhysicalHealth.jsx`: Navigate to `/workout`.
    - `client/src/components/Navbar.jsx`: Add link to `/profile`.

## Verification
- Manual testing of data saving and retrieval from the Profile page.
