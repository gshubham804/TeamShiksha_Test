# Discord Clone Application

A full-stack Discord clone application with authentication, built with Next.js (Frontend) and Express.js (Backend).

## Project Structure

```
Discord/
├── Backend/          # Express.js backend server
├── Frontend/         # Next.js frontend application
└── README.md         # This file
```

## Features

- User authentication (Sign up & Sign in)
- JWT-based token authentication
- Protected routes
- User dashboard
- Toast notifications for user feedback

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database (local or MongoDB Atlas)

## Setup Instructions

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   The backend server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3001` (or the next available port)

## API Endpoints

### Authentication

- `POST /signup` - Create a new user account
  - Body: `{ name, email, password }`
  - Response: `{ message, user }`

- `POST /signin` - Sign in to existing account
  - Body: `{ email, password }`
  - Response: `{ message, token, user }`

- `GET /me` - Get current user information (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user }`

## Git Setup

### Initializing Git Repository

If this is a new project, initialize git:

```bash
git init
```

### Creating .gitignore

Create a `.gitignore` file in the root directory:

```gitignore
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Next.js
.next/
out/
build/
dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Misc
*.pem
```

### First Commit

```bash
git add .
git commit -m "Initial commit: Discord clone application"
```

### Adding Remote Repository

```bash
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

## Development

- Backend runs on port 3000
- Frontend runs on port 3001 (or next available)
- Make sure MongoDB is running and accessible
- Update API_BASE_URL in `Frontend/utils/api.ts` if backend port changes

## Technologies Used

### Backend
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Zod for validation
- CORS enabled

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- react-hot-toast for notifications
- Lucide React for icons

## Notes

- Tokens are stored in localStorage
- Token expiration is set to 1 hour
- Protected routes check for token presence
- All API requests to protected endpoints include the token in the Authorization header

