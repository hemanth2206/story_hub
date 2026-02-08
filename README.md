# Story Hub

A full-stack story platform where readers can browse and comment, writers can publish and edit articles, and admins can manage users.

## Features
- Role-based flows for readers, writers, and admins
- Clerk authentication on the frontend
- Article publish, edit, soft delete/restore, and comments
- Admin login and user block/unblock
- MongoDB persistence with Mongoose

## Tech Stack
- Frontend: React + Vite, Clerk, React Router, Bootstrap
- Backend: Node.js, Express, MongoDB, Mongoose, JWT

## Project Structure
- Frontend: client
- Backend: server

## Environment Variables

Frontend:
- VITE_CLERK_PUBLISHABLE_KEY

Backend:
- DBURL
- PORT (set to 3000 or update client API URLs)
- JWT_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD_HASH
- CLERK_SECRET_KEY

## Setup

### Frontend
```bash
cd client
npm install
npm run dev


##Backend
cd server
npm install
node [server.js](http://_vscodecontentref_/0)



Admin Setup
Generate a password hash with server/hashAdminPassword.js, then set ADMIN_PASSWORD_HASH in your backend environment variables. Change the hardcoded password string before running in any real environment.

API Endpoints
User:

POST /user-api/user
POST /user-api/login
GET /user-api/articles?category=
PUT /user-api/comment/:articleId
Author:

POST /author-api/author
POST /author-api/login
POST /author-api/article
GET /author-api/articles?category=
PUT /author-api/article/:articleId
PUT /author-api/articles/:articleId
Admin:

POST /admin-api/login
GET /admin-api/all-users
PUT /admin-api/toggle-block/:id
Misc:

POST /check-blocked



Notes
The client currently calls the API at http://localhost:3000. Keep the backend on port 3000, or update the client API URLs if you choose a different port. ``````
