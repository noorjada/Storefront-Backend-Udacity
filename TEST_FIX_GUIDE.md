# How to Fix Test Failures

## Issue 1: PostgreSQL Database Not Running

**Error**: `AggregateError` in database connections

**Solution**:
1. Start PostgreSQL service:
   ```bash
   # Windows
   net start postgresql-x64-15   # or your version
   # Or use PostgreSQL GUI from Windows Services
   
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. Create test database:
   ```bash
   psql -U postgres -c "CREATE DATABASE store_test;"
   ```

3. Run migrations to create tables:
   ```bash
   npm run build
   npx db-migrate up --env test
   ```

## Issue 2: JWT Token Format

The handlers are returning JWT as a raw string, but tests need it as JSON. This is already correct - `res.json(token)` returns the token string directly in the response body.

The test reads it with: `token = res.body`

## Issue 3: Running Tests

Once PostgreSQL is running and migrations are applied:

```bash
npm test
```

This will:
1. Set `ENV=test`
2. Compile TypeScript
3. Run all 70+ tests

## Complete Setup Steps

```bash
# 1. Start PostgreSQL (check Services on Windows)

# 2. Create databases
psql -U postgres
# In psql:
CREATE DATABASE store;
CREATE DATABASE store_test;
\q

# 3. Install dependencies (if not done)
npm install

# 4. Build the project
npm run build

# 5. Run migrations for both databases
npx db-migrate up          # for development (store)
npx db-migrate up --env test  # for testing (store_test)

# 6. Run tests
npm test

# 7. Or start dev server
npm run watch
```

## Checking PostgreSQL is Running

```bash
# Test connection
psql -U postgres -c "SELECT 1;"

# Should return: 1
```

## If Tests Still Fail

1. **Check database exists**:
   ```bash
   psql -U postgres -l | grep store
   ```

2. **Check tables exist**:
   ```bash
   psql -U postgres -d store_test -c "\dt"
   ```
   Should show: users, products, orders, order_items

3. **Check .env file**:
   - POSTGRES_USER should match your PostgreSQL user (default: postgres)
   - POSTGRES_PASSWORD should match your password
   - POSTGRES_HOST should be localhost
   - DATABASE ports should be correct

## Expected Test Output When Fixed

```
70 specs, 0 failures
Finished in X.XX seconds
```

All tests should pass once:
- ✅ PostgreSQL is running
- ✅ Tables are created via migrations
- ✅ Database credentials in .env are correct
