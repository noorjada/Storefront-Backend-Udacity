# Storefront Backend Requirements

## API Endpoints

### Users
| HTTP Verb | Route | Description | Auth Required |
|-----------|-------|-------------|---|
| GET | `/users` | Get all users | Yes |
| GET | `/users/:id` | Get a specific user with their 5 most recent purchases | Yes |
| POST | `/users` | Create a new user (returns JWT token) | No |
| POST | `/users/authenticate` | Authenticate a user and get JWT token | No |
| PUT | `/users/:id` | Update user information | Yes |
| DELETE | `/users/:id` | Delete a user | Yes |

### Products
| HTTP Verb | Route | Description | Auth Required |
|-----------|-------|-------------|---|
| GET | `/products` | Get all products | No |
| GET | `/products/:id` | Get a specific product | No |
| GET | `/products/popular` | Get 5 most commonly ordered products | No |
| POST | `/products` | Create a new product | Yes |
| PUT | `/products/:id` | Update a product | Yes |
| DELETE | `/products/:id` | Delete a product | Yes |

### Orders
| HTTP Verb | Route | Description | Auth Required |
|-----------|-------|-------------|---|
| POST | `/orders` | Create a new order | Yes |
| GET | `/orders/current/:userId` | Get current (active) order for a user | Yes |
| GET | `/orders/completed/:userId` | Get all completed orders for a user | Yes |
| POST | `/orders/:id/products` | Add a product to an order | Yes |
| PUT | `/orders/:id` | Update order status | Yes |
| DELETE | `/orders/:id` | Delete an order | Yes |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Data Shapes

### User Object
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "password": "encrypted_password_hash"
}
```

### Product Object
```json
{
  "id": 1,
  "name": "Product Name",
  "price": 99.99,
  "description": "Product description"
}
```

### Order Object
```json
{
  "id": 1,
  "user_id": 1,
  "status": "active"
}
```

### Order Item Object
```json
{
  "id": 1,
  "order_id": 1,
  "product_id": 1,
  "quantity": 2,
  "price": 99.99
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. 
- Tokens are returned in the response when users sign up or authenticate.
- Tokens must be included in the `Authorization` header as `Bearer <token>` for protected routes.
- Token validation is performed by the `verifyAuthToken` middleware on protected routes.

## Security

- User passwords are hashed using bcrypt with a salt for secure storage.
- Environment variables (DATABASE_URL, TOKEN_SECRET, BCRYPT_PASSWORD, SALT_ROUNDS) should never be committed to version control.
