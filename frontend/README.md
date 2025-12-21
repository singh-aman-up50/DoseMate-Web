# DoseMate Frontend

Modern React + Vite + Material UI frontend for the DoseMate medicine reminder system.

## Features

- **Authentication**: Login/Register with JWT
- **Dashboard**: View medicine summary and upcoming reminders
- **Medicine Management**: Add, Edit, Delete medicines
- **Dark/Light Theme**: Toggle between themes
- **Responsive Sidebar**: Easy navigation
- **History Tracking**: View intake history with statistics
- **Protected Routes**: Secure pages with auth
- **Axios Interceptor**: Auto JWT token injection

## Setup

Install dependencies:
```bash
npm install
```

Start dev server (runs on http://localhost:3000):
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Backend API

The frontend connects to the backend at `http://localhost:8080/api`.
Make sure the backend is running before starting the frontend.

## File Structure

```
src/
├── api/              # Axios config and interceptors
├── components/       # Reusable components (Layout, ProtectedRoute)
├── context/          # Auth and Theme contexts
├── pages/            # Page components (Login, Dashboard, etc.)
├── App.jsx           # Main app with routes
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Auth Flow

1. User registers or logs in
2. JWT token stored in localStorage
3. Axios interceptor adds token to every request
4. If 401 (unauthorized), user redirected to login
5. Protected routes check user existence

## Theme

- Light/Dark mode toggle in AppBar
- Theme persisted in localStorage
- Material UI theme system used
