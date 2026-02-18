# Mini Social Media Platform

Beginner-friendly full-stack social media mini project.

## Tech Stack
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT + bcrypt password hashing

## Project Structure
```
.
|-- server.js
|-- config/
|   `-- db.js
|-- controllers/
|   |-- authController.js
|   |-- userController.js
|   `-- postController.js
|-- middleware/
|   `-- authMiddleware.js
|-- models/
|   |-- User.js
|   `-- Post.js
|-- routes/
|   |-- authRoutes.js
|   |-- userRoutes.js
|   `-- postRoutes.js
|-- frontend/
|   |-- index.html
|   |-- dashboard.html
|   |-- profile.html
|   |-- css/style.css
|   `-- js/
|       |-- api.js
|       |-- auth.js
|       |-- dashboard.js
|       `-- profile.js
|-- .env.example
`-- package.json
```

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   On Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Update `.env` values:
   - `MONGO_URI` (your MongoDB connection string)
   - `JWT_SECRET` (any strong secret)
4. Start server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```
5. Open app in browser:
   - `http://localhost:5000`

## API Endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout` (protected)

### Users
- `GET /api/users/:id` (protected)
- `PUT /api/users/me/update` (protected)
- `PUT /api/users/:id/follow` (protected)

### Posts
- `GET /api/posts` (protected)
- `POST /api/posts` (protected)
- `PUT /api/posts/:id` (protected, owner only)
- `DELETE /api/posts/:id` (protected, owner only)
- `PUT /api/posts/:id/like` (protected)
- `POST /api/posts/:id/comment` (protected)

## Notes for Beginners
- JWT token is stored in browser `localStorage`.
- Protected API calls send `Authorization: Bearer <token>` header.
- Logout in this project means deleting token from frontend storage.
- Profile picture and post image are URL strings (not file upload).
