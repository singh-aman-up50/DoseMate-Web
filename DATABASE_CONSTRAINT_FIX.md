# Database Constraint Fix - Step-by-Step Guide

## Problem
```
ERROR: new row for relation "users" violates check constraint "users_role_check"
```

This happens because your PostgreSQL database has a CHECK constraint on the `role` column that doesn't match the values your application is trying to insert.

## Root Cause
The enum values in your Java application are:
- `ROLE_USER`
- `ROLE_CAREGIVER`
- `ROLE_ADMIN`

But your database constraint probably only allows:
- `USER`
- `CAREGIVER`
- `ADMIN`

(or is missing the ROLE_ prefix)

## Solution

### Option 1: Using pgAdmin (Easiest)

1. **Open pgAdmin**
   - Go to http://localhost:5050 (or your pgAdmin URL)
   - Login with your credentials

2. **Navigate to Query Tool**
   - Left sidebar → Servers → postgres (your server)
   - Expand to see `dosemate` database
   - Right-click on `dosemate` → Query Tool

3. **Execute the Fix**
   ```sql
   ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
   
   ALTER TABLE users ADD CONSTRAINT users_role_check 
     CHECK (role IN ('ROLE_USER', 'ROLE_CAREGIVER', 'ROLE_ADMIN'));
   ```

4. **Verify**
   - You should see "Query returned successfully"
   - Go to `dosemate` → Schemas → public → Tables → users → Constraints
   - You should see `users_role_check` with the updated condition

### Option 2: Using psql (Command Line)

```bash
# Connect to PostgreSQL
psql -U postgres -d dosemate

# Run the SQL
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('ROLE_USER', 'ROLE_CAREGIVER', 'ROLE_ADMIN'));

# Verify
\d users

# Exit
\q
```

### Option 3: Delete and Recreate Database

If the above doesn't work:

```sql
-- Connect to postgres (default) database first
-- Then run:
DROP DATABASE IF EXISTS dosemate;
CREATE DATABASE dosemate;

-- The next time your app starts with 
-- spring.jpa.hibernate.ddl-auto=update
-- it will recreate the tables with correct constraints
```

## Verification

After running the fix, test registration:

1. Start your Spring Boot application
2. Try registering a new ROLE_CAREGIVER user with:
   - Email: test@example.com
   - Organization: Test Hospital
   - License Number: LIC123
   - Specialization: General Medicine
   - Years Experience: 5

3. If registration succeeds, the constraint fix worked!

## Still Getting Error?

Check these:
1. **Is the fix applied to the correct database?**
   - Verify you're connected to `dosemate` database
   
2. **Did you restart your application?**
   - Stop and restart the Spring Boot app after applying the fix

3. **Check the current constraint:**
   ```sql
   SELECT constraint_name, constraint_type
   FROM information_schema.table_constraints
   WHERE table_name = 'users';
   ```

4. **View the constraint details:**
   ```sql
   SELECT pg_get_constraintdef(oid)
   FROM pg_constraint
   WHERE conname = 'users_role_check';
   ```

## Quick SQL to Update Java Entity

The entity file has already been updated with:
```java
@Enumerated(EnumType.STRING)
@Column(columnDefinition = "varchar(50) CHECK (role IN ('ROLE_USER', 'ROLE_CAREGIVER', 'ROLE_ADMIN'))")
private Role role;
```

This ensures JPA will create the correct constraint when creating tables from scratch.

---

**After applying this fix, registration should work perfectly!**
