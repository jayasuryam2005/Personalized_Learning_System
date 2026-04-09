# Backend Setup

## 1. Install dependencies

```bash
cd backend
npm install
```

## 2. Configure environment

Copy `.env.example` to `.env` and update values if needed.

## 3. Run MongoDB

Use a local MongoDB server or MongoDB Atlas, then set `MONGODB_URI`.

## 4. Start the API

```bash
npm run dev
```

The API will start on `http://localhost:5000` by default.

## Default admin

The backend seeds an admin account on startup using:

- Email: `admin@skillpath.com`
- Password: `admin@123`

Override these through `.env`.

## Main API groups

- `POST /api/auth/login`
- `GET/POST/DELETE /api/users`
- `GET/POST /api/paths`
- `GET/POST/DELETE /api/resources`
- `GET/POST /api/progress`
- `GET/PATCH /api/platforms`
- `GET/POST /api/announcements`
- `GET/POST/PATCH /api/messages`
- `GET/PUT /api/roadmaps`
- `GET /api/dashboard/student`
- `GET /api/dashboard/teacher`
- `GET /api/dashboard/admin`

## Resource uploads

Use `multipart/form-data` with field name `file` on `POST /api/resources/upload`.
Uploaded files are served from `/uploads/<filename>`.
