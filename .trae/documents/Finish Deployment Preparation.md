Based on the project state and the "Resuming Admin Integration and Deployment Prep.md" document, here is the plan to complete the unfinished business:

## Unfinished Business
The previous session was interrupted while preparing the **Self-Host Deployment Pack**. The frontend admin routes have been implemented, but the `deploy/minimal` directory has not been created yet.

## Implementation Plan

### 1. Cleanup
- Remove unused `Layout` import in `jewelry/src/components/admin/AdminGuard.tsx`.

### 2. Create Deployment Package
- Create the `deploy/minimal/` directory structure.
- **Backend**: Copy `backend/` source code to `deploy/minimal/backend` (excluding `node_modules`, local env files).
- **Frontend**: Copy `jewelry/` source code to `deploy/minimal/jewelry` (excluding `node_modules`, build artifacts).
- **Database**: Copy SQL migrations from `supabase/migrations` to `deploy/minimal/supabase/migrations`.

### 3. Documentation & Verification
- Verify `docs/DEPLOY.md` instructions match the created package structure.
- Create a `README.md` in `deploy/minimal/` pointing to the deployment guide.

This will result in a clean, self-contained folder (`deploy/minimal`) that you can zip and upload to your server as per the instructions in `docs/DEPLOY.md`.
