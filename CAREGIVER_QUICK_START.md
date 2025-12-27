# 🚀 DoseMate Caregiver System - Quick Start

## 5-Minute Setup

### 1. Backend Start
```bash
cd backend
mvn spring-boot:run
```
Runs on http://localhost:8080

### 2. Frontend Start (New Terminal)
```bash
cd frontend
npm run dev
```
Runs on http://localhost:5173

### 3. Test It

**Register Patient:**
- http://localhost:5173/register
- Role: **Patient** (toggle button)
- Email: `patient@test.com`
- Password: `test1234`

**Register Caregiver:**
- http://localhost:5173/register
- Role: **Caregiver** (toggle button)
- Email: `caregiver@test.com`
- Password: `care1234`

**Invite Flow:**
1. Login as **patient@test.com**
2. Click "Caregivers" in menu
3. Click "Invite Caregiver" button
4. Enter `caregiver@test.com`
5. Copy the **invite code** (e.g., ABC1234D)

**Accept Invite:**
1. Logout
2. Visit: `http://localhost:5173/caregiver/accept/ABC1234D` (use your code)
3. Click "Accept Invite"
4. Auto-redirected to caregiver dashboard ✅

**Approve Request:**
1. Login back as patient
2. Go to "Caregivers"
3. See pending request, click "Approve"
4. Caregiver now has access ✅

**Monitor Patients:**
1. Login as caregiver
2. Caregiver Dashboard shows all patients
3. Click patient to see reminders & history

---

## 🎯 Key Features Implemented

| Feature | Status | Details |
|---------|--------|---------|
| Caregiver Registration | ✅ | Role selection in signup |
| Invite System | ✅ | Unique codes for patients to share |
| Multi-Patient View | ✅ | See all approved patients at once |
| Adherence Monitoring | ✅ | Real-time % tracking |
| Missed Dose Alerts | ✅ | Auto-flag after 10 min |
| Permission Control | ✅ | Patient approves/rejects caregivers |
| History Tracking | ✅ | View patient's dose history |
| Real-time Updates | ✅ | Dashboard refreshes automatically |

---

## 📁 Files Created/Modified

### Backend (7 new files)
- `model/CaregiverRelation.java`
- `model/CaregiverStatus.java`
- `repository/CaregiverRelationRepository.java`
- `service/CaregiverService.java`
- `controller/CaregiverController.java`
- `dto/CaregiverRelationDTO.java`
- `dto/PatientOverviewDTO.java`

### Frontend (4 new files)
- `pages/CaregiverDashboard.jsx`
- `pages/ManageCaregivers.jsx`
- `pages/AcceptCaregiverInvite.jsx`
- Updated: `App.jsx`, `Layout.jsx`, `Register.jsx`, `AuthContext.jsx`

---

## 💻 Demo Workflow

```
PATIENT SIDE:
  Register (Role: Patient)
    ↓
  Add Medicine + Schedule Reminders
    ↓
  Invite Caregiver → Generate Code
    ↓
  Approve Caregiver Request
    ↓
  View Connected Caregivers


CAREGIVER SIDE:
  Register (Role: Caregiver)
    ↓
  Accept Patient's Invite (using code)
    ↓
  Dashboard loads with all patients
    ↓
  Click patient → See reminders & adherence
    ↓
  Monitor adherence % in real-time
    ↓
  See missed doses automatically
```

---

## 🔧 API Usage Examples

### Patient generates invite for caregiver
```bash
curl -X POST http://localhost:8080/api/caregiver/generate-invite \
  -H "Authorization: Bearer <PATIENT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "caregiverEmail": "caregiver@test.com",
    "relationship": "daughter"
  }'
```

### Caregiver accepts invite
```bash
curl -X POST http://localhost:8080/api/caregiver/accept-invite/ABC1234D
```

### Caregiver lists patients
```bash
curl http://localhost:8080/api/caregiver/my-patients \
  -H "Authorization: Bearer <CAREGIVER_TOKEN>"
```

### Caregiver views patient reminders
```bash
curl http://localhost:8080/api/caregiver/patient/{patientId}/reminders \
  -H "Authorization: Bearer <CAREGIVER_TOKEN>"
```

---

## ✅ What's Working

- ✅ User can register as Patient or Caregiver
- ✅ Patient can invite caregivers by email
- ✅ Unique invite codes generated and shared
- ✅ Caregiver accepts via code → auto-approved
- ✅ Patient approves/rejects/removes caregivers
- ✅ Caregiver sees all approved patients
- ✅ Caregiver views patient medications & reminders
- ✅ Caregiver sees adherence metrics
- ✅ Caregiver sees patient's dose history
- ✅ Missed doses auto-tracked (10-min timeout)
- ✅ Role-based navigation in Layout
- ✅ Secure permission checks on all endpoints

---

## 🎓 Test Scenarios

### Scenario 1: Simple Caregiver Access
1. Patient registers
2. Patient adds 2 medicines with reminders
3. Caregiver registers and accepts invite
4. Patient approves
5. Caregiver logs in → sees 2 medicines pending

### Scenario 2: Multi-Caregiver
1. Patient invites 3 caregivers
2. All 3 accept and get approved
3. Patient can manage/remove any
4. All 3 see same patient data

### Scenario 3: Missed Dose Tracking
1. Patient has reminder scheduled NOW
2. Caregiver looks at dashboard (shows PENDING)
3. Wait 10 minutes without patient action
4. Caregiver refreshes → now shows MISSED

---

## 📝 Notes

- Invite codes valid indefinitely (no expiry)
- One-time use per code (becomes APPROVED)
- Patient must approve before caregiver sees data
- Caregivers cannot edit patient data (view-only)
- All timestamps in UTC

---

**Everything is ready! Start the backend & frontend and test the flows above. 🎉**
