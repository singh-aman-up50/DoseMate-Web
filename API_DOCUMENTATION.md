# DoseMate REST API Documentation

## Base URL
`http://localhost:8080/api`

## Authentication
All endpoints (except `/auth/**`) require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
- **Response:** 200 OK (empty body)

### Login
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

---

## Medicine Endpoints

### Get All User Medicines
- **GET** `/medicines`
- **Response:** 200 OK
```json
[
  {
    "id": 1,
    "name": "Aspirin",
    "dosage": "500mg",
    "frequency": "DAILY",
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "reminderTimes": ["08:00", "20:00"],
    "active": true
  }
]
```

### Get Single Medicine
- **GET** `/medicines/{id}`
- **Response:** 200 OK (single medicine object)

### Add Medicine
- **POST** `/medicines`
- **Body:**
```json
{
  "name": "Aspirin",
  "dosage": "500mg",
  "frequency": "DAILY",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "reminderTimes": ["08:00", "20:00"]
}
```
- **Response:** 201 Created (medicine object)

### Update Medicine
- **PUT** `/medicines/{id}`
- **Body:** (same as POST)
- **Response:** 200 OK (updated medicine object)

### Delete Medicine
- **DELETE** `/medicines/{id}`
- **Response:** 204 No Content

---

## Reminder Endpoints

### Get All Reminders
- **GET** `/reminders`
- **Response:** 200 OK
```json
[
  {
    "id": 1,
    "medicine": { "id": 1, "name": "Aspirin", ... },
    "scheduledAt": "2025-01-15T08:00:00",
    "status": "PENDING",
    "createdAt": "2025-01-15T07:55:00Z"
  }
]
```

### Update Reminder Status
- **PUT** `/reminders/{id}/status`
- **Body:**
```json
{
  "status": "TAKEN"  // or "MISSED", "PENDING"
}
```
- **Response:** 200 OK (updated reminder object)

---

## History Endpoints

### Get All History
- **GET** `/history`
- **Response:** 200 OK
```json
[
  {
    "id": 1,
    "reminder": { "id": 1, ... },
    "status": "TAKEN",
    "recordedAt": "2025-01-15T08:05:00Z"
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "name": "Field is required",
  "email": "Invalid email format"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Not authorized"
}
```

### 404 Not Found
```json
{
  "error": "Medicine not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Database Flow

1. **Register/Login** → JWT token generated → stored in localStorage (frontend)
2. **API Request** → JWT added to header via Axios interceptor
3. **Backend** → Validates token → Extracts user email → Processes request
4. **Database** → CRUD operations tied to user
5. **Response** → JSON returned to frontend
6. **401 Response** → Token cleared → User redirected to login

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@test.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'
```

### Get Medicines (with token)
```bash
curl -X GET http://localhost:8080/api/medicines \
  -H "Authorization: Bearer <token>"
```
