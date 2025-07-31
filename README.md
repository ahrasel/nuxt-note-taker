# Nuxt Minimal Starter

# Nuxt Note Taker

A modern note-taking application built with Nuxt 3, featuring user authentication, database management with Prisma, and Docker containerization.

## Features

- 🔐 **User Authentication** - JWT-based login/register system
- 📝 **Note Management** - Create, read, update, and delete notes
- 🗄️ **Database** - MySQL with Prisma ORM
- 🐳 **Docker Ready** - Complete containerization with Docker Compose
- 🎨 **Modern UI** - Built with Tailwind CSS
- 🌐 **Database Admin** - phpMyAdmin for database management

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript, Tailwind CSS
- **Backend**: Nuxt Server API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Containerization**: Docker & Docker Compose
- **Database Admin**: phpMyAdmin

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd nuxt-note-taker
   ```

2. **Start the development environment**

   ```bash
   ./start-dev.sh
   ```

   This script will:
   - Build and start all Docker containers
   - Set up the MySQL database
   - Run Prisma migrations
   - Generate Prisma client

3. **Access the application**
   - **Application**: http://localhost:3000
   - **phpMyAdmin**: http://localhost:8080
     - Server: `mysql`
     - Username: `nuxt_user`
     - Password: `nuxt_password`

## Manual Setup (if you prefer not to use the script)

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Start Docker containers**

   ```bash
   docker-compose up -d
   ```

3. **Wait for MySQL to be ready, then run migrations**
   ```bash
   # Wait a few seconds for MySQL to start
   yarn prisma migrate dev --name init
   yarn prisma generate
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user

  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string" // optional
  }
  ```

- `POST /api/auth/login` - Login user

  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

- `POST /api/auth/logout` - Logout user (clears auth cookie)

- `GET /api/auth/me` - Get current user profile (requires authentication)

## Database Schema

### Users Table

- `id` - Primary key
- `username` - Unique username
- `email` - Optional email
- `password` - Hashed password
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Notes Table

- `id` - Primary key
- `title` - Note title
- `content` - Note content
- `completed` - Boolean flag
- `archived` - Boolean flag
- `userId` - Foreign key to users table
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://nuxt_user:nuxt_password@localhost:3306/nuxt_notes"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# App Environment
NODE_ENV="development"
```

## Docker Services

- **nuxt-app**: The main Nuxt application (port 3000)
- **mysql**: MySQL 8.0 database (port 3306)
- **phpmyadmin**: phpMyAdmin interface (port 8080)

## Development Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Run Prisma commands
docker-compose exec nuxt-app npx prisma [command]

# Access MySQL directly
docker-compose exec mysql mysql -u nuxt_user -p nuxt_notes
```

## Production Deployment

1. Update environment variables for production
2. Change `NODE_ENV` to `production`
3. Use strong passwords and JWT secrets
4. Configure proper SSL certificates
5. Use production-ready database settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## License

[Your chosen license]

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
