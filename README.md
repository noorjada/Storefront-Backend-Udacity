# Storefront Backend

A Node.js/Express backend API for an online storefront with user authentication, product catalog, and order management.

## Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** (v9 or higher)

## Project Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

**Note:** This project uses `bcryptjs` for password hashing, which does not require native compilation. Simply run `npm install` and all dependencies will be installed automatically without needing Python or build tools.

### 2. Database Setup

#### Create PostgreSQL Databases

```sql
-- Create development database
CREATE DATABASE store;

-- Create test database
CREATE DATABASE store_test;
```

#### Run Database Migrations

Make sure your environment variables are configured (see step 3), then run:

```bash
# Run migrations to create tables
npm run build
db-migrate up

# For test database
ENV=test db-migrate up
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following configuration:

```
# Server
PORT=3000

# Database
POSTGRES_HOST=localhost
POSTGRES_DB=store
POSTGRES_TEST_DB=store_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here

# Authentication & Security
TOKEN_SECRET=your_secret_jwt_key_here
BCRYPT_PASSWORD=your_bcrypt_pepper_here
SALT_ROUNDS=10

# Environment
ENV=dev
```

**Important**: Never commit the `.env` file to version control. It contains sensitive information.

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run watch
```

The server will start on **http://localhost:3000**

### Production Build

```bash
npm run build
node dist/server.js
```

### Running Tests

```bash
npm test
```

Tests use the `store_test` database and are run with Jasmine.

## Project Structure

```
src/
├── server.ts           # Express app setup and middleware
├── database.ts         # PostgreSQL connection pool
├── handlers/           # Route handlers grouped by resource
│   ├── users.ts       # User endpoints
│   ├── products.ts    # Product endpoints
│   └── orders.ts      # Order endpoints
├── middleware/         # Custom middleware
│   └── auth.ts        # JWT authentication middleware
└── models/            # Database models/business logic
    ├── user.ts        # User model
    ├── product.ts     # Product model
    └── order.ts       # Order model
spec/
└── support/
    └── jasmine.json   # Jasmine test configuration
src/tests/
├── handlers/          # Handler/endpoint tests
└── models/            # Database model tests
migrations/            # Database migration files
```

## API Documentation

See [REQUIREMENTS.md](REQUIREMENTS.md) for complete API endpoint documentation, HTTP verbs, authentication requirements, and database schema.

## API Endpoints Summary

### Users
- `POST /users` - Register new user
- `POST /users/authenticate` - Login user
- `GET /users` - List all users (protected)
- `GET /users/:id` - Get user with recent orders (protected)
- `PUT /users/:id` - Update user (protected)
- `DELETE /users/:id` - Delete user (protected)

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `GET /products/popular` - Get 5 most ordered products
- `POST /products` - Create product (protected)
- `PUT /products/:id` - Update product (protected)
- `DELETE /products/:id` - Delete product (protected)

### Orders
- `POST /orders` - Create order (protected)
- `GET /orders/current/:userId` - Get current order (protected)
- `GET /orders/completed/:userId` - Get completed orders (protected)
- `POST /orders/:id/products` - Add product to order (protected)
- `PUT /orders/:id` - Update order status (protected)
- `DELETE /orders/:id` - Delete order (protected)

## Authentication

The API uses JWT (JSON Web Tokens) for secure authentication:

1. **Create User or Login**: Send credentials to `/users` or `/users/authenticate`
2. **Receive Token**: The response includes a JWT token
3. **Use Token**: Include the token in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Security Features

- **Password Hashing**: User passwords are encrypted using bcrypt with a configurable salt
- **JWT Authentication**: Protected endpoints require valid JWT tokens
- **Environment Variables**: Sensitive data (database credentials, secrets) stored in `.env`
- **CORS**: Enabled for cross-origin requests

## Database Connection Details

- **Host**: localhost
- **Development Database**: store
- **Test Database**: store_test
- **Default Port**: 5432 (PostgreSQL)
- **Backend Server Port**: 3000

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check POSTGRES_USER and POSTGRES_PASSWORD in `.env`
- Verify database names exist: `store` and `store_test`

### JWT Token Errors
- Ensure TOKEN_SECRET is set in `.env`
- Include `Bearer` prefix in Authorization header
- Token may be expired (generate new one by logging in)

### Migration Errors
- Run `npm run build` first to compile TypeScript
- Ensure `.env` is properly configured
- Check PostgreSQL is running: `psql -U postgres -c "SELECT 1"`

## Development Notes

- TypeScript strict mode is enabled
- All async operations use async/await with proper error handling
- Const is used by default; let is used only when variable reassignment is needed
- All database connections are properly released to the pool

## License

Proprietary
