# Personal Finance Management API

Backend API for a personal finance management application built with Node.js, Express, and TypeScript. This application allows users to track their bank accounts, balances, and transactions.

## Features

- User authentication (register, login, logout)
- Bank account management
- Transaction tracking and management
- Search functionality for transactions
- Simulated bank API integration
- Mock Supabase integration for data persistence

## Project Structure

The project follows the MVC (Model-View-Controller) pattern:

```
finance-tracker/
├── src/
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Middleware functions
│   ├── models/           # Data models and in-memory database
│   ├── routes/           # API routes
│   ├── services/         # External service integrations
│   ├── types/            # TypeScript type definitions
│   └── index.ts          # Application entry point
├── .env.example          # Example environment variables
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## API Endpoints

### Authentication

- **Register**: `POST /api/users/register`
- **Login**: `POST /api/users/login`
- **Logout**: `POST /api/users/logout`
- **Get Current User**: `GET /api/users/me`

### Bank Accounts

- **Get All Accounts**: `GET /api/accounts`
- **Get Account by ID**: `GET /api/accounts/:id`
- **Refresh Account Balances**: `GET /api/accounts/refresh`

### Transactions

- **Get All Transactions**: `GET /api/transactions`
- **Get Transaction by ID**: `GET /api/transactions/:id`
- **Get Account Transactions**: `GET /api/transactions/account/:accountId`
- **Search Transactions**: `GET /api/transactions/search?q=keyword`
- **Create Transaction**: `POST /api/transactions`
- **Update Transaction**: `PUT /api/transactions/:id`
- **Delete Transaction**: `DELETE /api/transactions/:id`

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```
   npm run dev
   ```

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Static type checking
- **bcrypt**: Password hashing
- **cookie-session**: Session management
- **uuid**: Unique ID generation
- **cors, helmet, morgan**: Security and logging middleware

## Implementation Details

### Authentication

The application uses cookie-session for maintaining user sessions. Passwords are hashed using bcrypt before storage.

### Security

- Session cookies are HTTP-only and secure in production
- Password hashing with bcrypt
- Helmet middleware for security headers
- CORS configuration to restrict origins

### In-memory Database

The application uses in-memory data structures for storing:
- User accounts
- Bank accounts
- Transactions

In a production environment, these would be replaced with a real database like PostgreSQL via Supabase.

### Mock External APIs

The application includes mock services to simulate:
- Bank API for fetching account balances and transactions
- Supabase for data persistence

These are designed to be easily replaced with real API clients when needed.
