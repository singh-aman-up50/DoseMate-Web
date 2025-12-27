-- Fix the users_role_check constraint
-- Drop the existing constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new constraint that allows ROLE_ prefixed values
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('ROLE_USER', 'ROLE_CAREGIVER', 'ROLE_ADMIN'));

-- Verify the constraint was created
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'users' AND constraint_name = 'users_role_check';
