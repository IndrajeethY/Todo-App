# My To-Do List App

A beautiful, modern to-do list application built with Vite, TypeScript, React, shadcn-ui, and Tailwind CSS.

## Project Info

- **Frontend Repo**: https://github.com/IndrajeethY/Todo-App
- **Backend API**: https://github.com/IndrajeethY/Todo-backend

## Backend Configuration

This frontend connects to a REST API backend. By default, it uses the API from [IndrajeethY/Todo-backend](https://github.com/IndrajeethY/Todo-backend).

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:8080
```

For production, set `VITE_API_BASE_URL` to your deployed backend server.

### Authentication

- JWT-based authentication.
- Login endpoint: `POST /api/login`
- JWT token is stored in localStorage as `auth_token`
- All API requests include the token in the Authorization header.

### API Endpoints (expected from backend)

- `GET /api/todos` - Fetch all todos for the authenticated user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `POST /api/todos/:id/complete` - Mark a todo as complete
- `PATCH /api/todos/reorder` - Reorder todos

## How to Run Locally

**Requirements:**

- Node.js & npm (consider using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

**Steps:**

```sh
# 1. Clone the repository
git clone https://github.com/IndrajeethY/Todo-App

# 2. Navigate to the project directory
cd Todo-App

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

## Editing the Code

You can use any editor or IDE (VS Code recommended) to work on the codebase. Commit and push changes to your fork or branch as needed.

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

Configure your backend endpoint and deploy the app using your preferred static hosting service.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
