# DoseMate Caregiver System - Quick Commands Reference

## 🚀 Startup Commands

```bash
# Terminal 1: Start Backend
cd ~/Desktop/DoseMate-Web/backend
mvn spring-boot:run

# Terminal 2: Start Frontend
cd ~/Desktop/DoseMate-Web/frontend
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

---

## 📝 Test Workflow Commands

### Create Patient Account
```
URL: http://localhost:5173/register
Email: patient1@test.com
Password: patient123
Role: PATIENT (toggle button)
```

### Create Caregiver Account
```
URL: http://localhost:5173/register
Email: caregiver1@test.com
Password: care123
Role: CAREGIVER (toggle button)
```

---

## 🔗 Quick Navigation Links

| Action | URL |
|--------|-----|
| Register | http://localhost:5173/register |
| Login | http://localhost:5173/login |
| Patient Dashboard | http://localhost:5173/dashboard |
| Patient Caregivers | http://localhost:5173/caregivers |
| Caregiver Dashboard | http://localhost:5173/caregiver/dashboard |
| Accept Invite | http://localhost:5173/caregiver/accept/{CODE} |

---

## 📡 API Testing with curl

### Register as Caregiver
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Caregiver",
    "email": "jane@test.com",
    "password": "care123",
    "confirmPassword": "care123",
    "role": "ROLE_CAREGIVER"
  }'
```

### Register as Patient
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Patient",
    "email": "john@test.com",
    "password": "patient123",
    "confirmPassword": "patient123",
    "role": "ROLE_USER"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "patient123"
  }'
```
Response includes: `token` (use in Authorization header)

### Generate Invite Code (Patient)
```bash
curl -X POST http://localhost:8080/api/caregiver/generate-invite \
  -H "Authorization: Bearer <PATIENT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "caregiverEmail": "jane@test.com",
    "relationship": "daughter"
  }'
```
Response includes: `inviteCode` (e.g., "ABC1234D")

### Accept Invite (Caregiver)
```bash
curl -X POST http://localhost:8080/api/caregiver/accept-invite/ABC1234D
```

### List Patients (Caregiver)
```bash
curl -X GET http://localhost:8080/api/caregiver/my-patients \
  -H "Authorization: Bearer <CAREGIVER_TOKEN>"
```

### Get Patient Reminders (Caregiver)
```bash
curl -X GET http://localhost:8080/api/caregiver/patient/1/reminders \
  -H "Authorization: Bearer <CAREGIVER_TOKEN>"
```

### Get Patient History (Caregiver)
```bash
curl -X GET http://localhost:8080/api/caregiver/patient/1/history \
  -H "Authorization: Bearer <CAREGIVER_TOKEN>"
```

### Approve Caregiver (Patient)
```bash
curl -X PUT http://localhost:8080/api/caregiver/1/approve \
  -H "Authorization: Bearer <PATIENT_TOKEN>"
```

### Get Pending Requests (Patient)
```bash
curl -X GET http://localhost:8080/api/caregiver/pending-requests \
  -H "Authorization: Bearer <PATIENT_TOKEN>"
```

---

## 🐛 Debugging Commands

### Check Backend Logs
```bash
# Last 50 lines
tail -50 backend/logs/app.log

# Follow logs in real-time
tail -f backend/logs/app.log

# Search for errors
grep ERROR backend/logs/app.log
```

### Check Frontend Errors
Browser Console (F12):
```javascript
// Check localStorage
console.log(localStorage.getItem('user'))
console.log(localStorage.getItem('token'))

// Check current route
console.log(window.location.href)
```

### Database Inspection (if using MySQL)
```bash
mysql -u root -p dosemate_db

# List users
SELECT id, email, role FROM users;

# List caregiver relations
SELECT * FROM caregiver_relations;

# Check pending requests
SELECT * FROM caregiver_relations WHERE status = 'PENDING';
```

---

## 🧹 Cleanup Commands

### Clear Browser Cache
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
```

### Reset Database (Development Only)
```bash
cd backend
mvn clean install
# Restart app - schema auto-recreated

# Or manually (MySQL):
DROP DATABASE dosemate_db;
CREATE DATABASE dosemate_db;
```

### Kill Ports If Stuck
```bash
# Kill port 8080 (backend)
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill port 5173 (frontend)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## 📊 Postman Collection (Import)

Save as `caregiver_api.json`:

```json
{
  "info": { "name": "DoseMate Caregiver" },
  "item": [
    {
      "name": "Register Patient",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\"firstName\":\"John\",\"lastName\":\"Patient\",\"email\":\"john@test.com\",\"password\":\"patient123\",\"confirmPassword\":\"patient123\",\"role\":\"ROLE_USER\"}"
        }
      }
    },
    {
      "name": "Register Caregiver",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\"firstName\":\"Jane\",\"lastName\":\"Caregiver\",\"email\":\"jane@test.com\",\"password\":\"care123\",\"confirmPassword\":\"care123\",\"role\":\"ROLE_CAREGIVER\"}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"john@test.com\",\"password\":\"patient123\"}"
        }
      }
    },
    {
      "name": "Generate Invite",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/caregiver/generate-invite",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"caregiverEmail\":\"jane@test.com\",\"relationship\":\"daughter\"}"
        }
      }
    }
  ]
}
```

Import into Postman for easy testing.

---

## 🎯 Typical Test Sequence

```bash
# 1. Register patient
POST /api/auth/register (role=ROLE_USER)
→ Get token: PATIENT_TOKEN

# 2. Register caregiver  
POST /api/auth/register (role=ROLE_CAREGIVER)
→ Get token: CAREGIVER_TOKEN

# 3. Patient generates invite
POST /api/caregiver/generate-invite (auth: PATIENT_TOKEN)
→ Get code: ABC1234D

# 4. Caregiver accepts invite
POST /api/caregiver/accept-invite/ABC1234D
→ Status: PENDING (awaiting patient approval)

# 5. Patient approves
PUT /api/caregiver/1/approve (auth: PATIENT_TOKEN)
→ Status: APPROVED

# 6. Caregiver lists patients
GET /api/caregiver/my-patients (auth: CAREGIVER_TOKEN)
→ See patient in list

# 7. Caregiver views reminders
GET /api/caregiver/patient/1/reminders (auth: CAREGIVER_TOKEN)
→ See patient's reminders

✅ Workflow complete!
```

---

## 💾 Environment Variables (if needed)

```bash
# backend/.env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/dosemate_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400

# frontend/.env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=ws://localhost:8080
```

---

## 📞 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| 404 on login | Check backend is running on 8080 |
| Role not showing | Rebuild frontend (`npm install`) |
| Invite code not working | Generate new code, check spelling |
| CORS error | Backend CORS config needs update |
| 401 Unauthorized | Token expired, login again |
| Database connection error | Check MySQL running, credentials correct |
| Port already in use | Use kill commands above |

---

## 🎓 Files to Review

**For Understanding:**
1. Read: `CAREGIVER_IMPLEMENTATION_SUMMARY.md` (overview)
2. Read: `CAREGIVER_ARCHITECTURE.md` (design)
3. Read: `CAREGIVER_QUICK_START.md` (quick reference)
4. Read: `CAREGIVER_SETUP_GUIDE.md` (detailed guide)

**For Testing:**
1. Use: `CAREGIVER_TESTING_CHECKLIST.md` (verification)
2. Use: Commands above (manual testing)

---

**All commands ready for testing! 🚀**
