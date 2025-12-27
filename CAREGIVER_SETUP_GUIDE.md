# DoseMate Caregiver System - Complete Setup & Usage Guide

## 🎯 Overview

Full caregiver system is now implemented with:
- ✅ Caregiver role registration
- ✅ Patient-to-caregiver invitation system
- ✅ Caregiver dashboard with multi-patient view
- ✅ Real-time monitoring of patient medications
- ✅ Adherence tracking and missed dose alerts
- ✅ Secure permission-based access

---

## 📋 Table of Contents

1. [Backend Setup](#backend-setup)
2. [Frontend Setup](#frontend-setup)
3. [Testing Workflow](#testing-workflow)
4. [API Endpoints](#api-endpoints)
5. [Features Breakdown](#features-breakdown)

---

## 🔧 Backend Setup

### Database Migration

New tables created automatically via JPA:

```sql
CREATE TABLE caregiver_relations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  caregiver_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  relationship VARCHAR(50),
  status ENUM('PENDING', 'APPROVED', 'REJECTED', 'REMOVED') DEFAULT 'PENDING',
  invite_code VARCHAR(10) UNIQUE,
  created_at TIMESTAMP,
  approved_at TIMESTAMP,
  FOREIGN KEY (caregiver_id) REFERENCES users(id),
  FOREIGN KEY (patient_id) REFERENCES users(id)
);
```

### Files Modified/Created

**Backend:**
- ✅ `model/Role.java` - Added `ROLE_CAREGIVER`
- ✅ `model/CaregiverRelation.java` - NEW
- ✅ `model/CaregiverStatus.java` - NEW
- ✅ `repository/CaregiverRelationRepository.java` - NEW
- ✅ `service/CaregiverService.java` - NEW
- ✅ `controller/CaregiverController.java` - NEW
- ✅ `dto/CaregiverRelationDTO.java` - NEW
- ✅ `dto/CaregiverRequestDTO.java` - NEW
- ✅ `dto/PatientOverviewDTO.java` - NEW
- ✅ `service/AuthService.java` - Updated for role selection
- ✅ `dto/RegisterRequest.java` - Added role field
- ✅ `dto/UserResponse.java` - Added role field
- ✅ `repository/ReminderRepository.java` - Added query methods
- ✅ `repository/HistoryRepository.java` - Added query methods

### Start Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

---

## 🎨 Frontend Setup

### Files Modified/Created

**Frontend:**
- ✅ `pages/CaregiverDashboard.jsx` - NEW - Caregiver's main dashboard
- ✅ `pages/ManageCaregivers.jsx` - NEW - Patient's caregiver management
- ✅ `pages/AcceptCaregiverInvite.jsx` - NEW - Invite acceptance flow
- ✅ `pages/Register.jsx` - Updated with role selection (Patient/Caregiver)
- ✅ `context/AuthContext.jsx` - Updated to handle role
- ✅ `components/Layout.jsx` - Updated for conditional navigation
- ✅ `App.jsx` - Updated with new routes

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🧪 Testing Workflow

### Scenario 1: Patient Invites Caregiver

#### Step 1: Register as Patient
1. Go to http://localhost:5173/register
2. Fill form:
   - First Name: `John`
   - Last Name: `Patient`
   - Email: `john@patient.com`
   - Password: `password123`
   - **Role:** Select **"Patient"** (default)
3. Click Register → Redirects to Login

#### Step 2: Register as Caregiver
1. Go to http://localhost:5173/register
2. Fill form:
   - First Name: `Jane`
   - Last Name: `Caregiver`
   - Email: `jane@caregiver.com`
   - Password: `caregiver123`
   - **Role:** Select **"Caregiver"**
3. Click Register → Redirects to Login

#### Step 3: Patient Invites Caregiver
1. Login as Patient (john@patient.com)
2. Navigate to **"Caregivers"** menu (only visible for patients)
3. Click **"Invite Caregiver"** button
4. Enter:
   - Caregiver Email: `jane@caregiver.com`
   - Relationship: `Daughter` (or any option)
5. Click **"Generate Invite"**
6. **Copy the invite code** (e.g., `ABC1234D`)

#### Step 4: Caregiver Accepts Invite
1. Logout (if still logged in as patient)
2. Caregiver navigates to: `http://localhost:5173/caregiver/accept/ABC1234D`
   - Replace `ABC1234D` with actual code from Step 3
3. Click **"Accept Invite"**
4. Auto-redirects to **Caregiver Dashboard**

#### Step 5: Patient Approves Request
1. Login as Patient again
2. Go to **"Caregivers"** page
3. In **"Pending Requests"** section, see Jane's request
4. Click **"Approve"** button
5. Status changes to **"Approved"**

#### Step 6: Caregiver Views Patient
1. Login as Caregiver (jane@caregiver.com)
2. You're on **Caregiver Dashboard**
3. Left panel shows **"My Patients"** - click on John's card
4. See:
   - Adherence Rate
   - Missed Doses Count
   - Active Medicines
   - Pending Reminders
   - Recent History

---

### Scenario 2: Patient Adds Medicine & Caregiver Monitors

#### Step 7: Patient Adds Medicine
1. Login as Patient (john@patient.com)
2. Go to **"Medicines"** page
3. Click **"Add New Medicine"**
4. Fill:
   - Name: `Aspirin`
   - Dosage: `500`
   - Unit: `mg`
   - Reminder Times: `09:00, 18:00`
5. Click **"Add Medicine"**

#### Step 8: Caregiver Monitors Reminders
1. Login as Caregiver
2. Go to **Caregiver Dashboard**
3. Click on patient's card
4. See **"Pending Reminders"** section
5. Shows: `Aspirin - Scheduled: [time]`

#### Step 9: Patient Marks Taken / Misses Dose
1. Login as Patient
2. Go to **"Reminders"** page
3. See pending reminder for Aspirin
4. Either:
   - Click **"Mark Taken"** (dose is marked)
   - Wait 10 minutes without clicking (auto-marks as MISSED)

#### Step 10: Caregiver Sees Updated Status
1. Caregiver refreshes dashboard
2. **"Missed Reminders"** counter updates
3. Patient's adherence % changes
4. Recent history shows MISSED or TAKEN status

---

## 📡 API Endpoints

### Authentication

```
POST /api/auth/register
  Body: { role: "ROLE_CAREGIVER" | "ROLE_USER", ... }
  Returns: { token, user: { role, ... } }
```

### Caregiver Operations

```
POST /api/caregiver/generate-invite
  Auth: Patient
  Body: { caregiverEmail: string, relationship: string }
  Returns: { inviteCode, ... }

POST /api/caregiver/accept-invite/{inviteCode}
  Auth: None (public endpoint for invite acceptance)
  Returns: { status: "APPROVED", ... }

PUT /api/caregiver/{relationId}/approve
  Auth: Patient
  Returns: { status: "APPROVED", ... }

PUT /api/caregiver/{relationId}/reject
  Auth: Patient
  Returns: HTTP 204

DELETE /api/caregiver/{relationId}
  Auth: Patient
  Returns: HTTP 204

GET /api/caregiver/my-patients
  Auth: Caregiver
  Returns: [ { patientId, patientName, adherenceRate, ... }, ... ]

GET /api/caregiver/patient/{patientId}/reminders
  Auth: Caregiver (must have approved relation)
  Returns: [ { id, medicineName, scheduledAt, status }, ... ]

GET /api/caregiver/patient/{patientId}/history
  Auth: Caregiver (must have approved relation)
  Returns: [ { id, medicine, status, timestamp }, ... ]

GET /api/caregiver/pending-requests
  Auth: Patient
  Returns: [ { id, caregiverName, caregiverEmail, status: "PENDING" }, ... ]

GET /api/caregiver/my-caregivers
  Auth: Patient
  Returns: [ { id, caregiverName, caregiverEmail, status: "APPROVED" }, ... ]
```

---

## 🎯 Features Breakdown

### 1. **Caregiver Registration**
- User selects role during signup: **Patient** or **Caregiver**
- Role stored in `users.role` field
- JWT token includes role information

### 2. **Invitation System**
- Patient generates unique invite code (8-char alphanumeric)
- Code shared with caregiver (copy-paste or link)
- Caregiver uses code to accept invitation
- Patient must approve request before caregiver gains access

### 3. **Multi-Patient Dashboard**
- Caregiver sees list of all approved patients
- Quick stats per patient:
  - Adherence Rate (%)
  - Pending Reminders (count)
  - Missed Doses (count)
  - Active Medicines (count)
- Click patient to view:
  - All pending reminders
  - Recent 10 history entries
  - Detailed adherence breakdown

### 4. **Permission Management**
- Patient can:
  - Invite multiple caregivers
  - Approve/Reject pending requests
  - Remove existing caregivers anytime
- Caregiver can only view approved patients' data

### 5. **Real-time Monitoring**
- Caregiver sees live adherence metrics
- History updates when patient marks doses
- Missed doses flagged automatically after 10 minutes

---

## 🔐 Security Notes

- ✅ Caregiver access controlled by `CaregiverStatus.APPROVED`
- ✅ Patient authorization verified on every caregiver endpoint
- ✅ Invite codes are one-time use (status: PENDING → APPROVED)
- ✅ JWT tokens store user role for role-based routing

---

## 🚀 Next Steps / Optional Enhancements

### Phase 2 (Recommended):
- [ ] Caregiver can manually mark doses for patient (if allowed)
- [ ] Send SMS/Email alerts to caregivers on missed doses
- [ ] Bulk caregiver reports (all patients' weekly adherence)
- [ ] Medication adjustment suggestions for caregivers
- [ ] Video call integration for follow-ups

### Phase 3 (Advanced):
- [ ] Multiple hierarchies (Super-caregivers managing caregivers)
- [ ] AI predictions for missed dose patterns
- [ ] Integration with hospital EMR systems
- [ ] Insurance reporting automated

---

## 🐛 Troubleshooting

### Issue: "Caregiver not found" on invite
**Solution:** Ensure caregiver has already registered with exact email

### Issue: Invite code not working
**Solution:** Check code expiry - generate new one if pending too long

### Issue: Caregiver sees wrong patient data
**Solution:** Verify `CaregiverRelation.status` is `APPROVED` in DB

### Issue: Role not showing in auth response
**Solution:** Rebuild backend (`mvn clean install`)

---

## 📞 Support

For questions or issues, check:
1. Backend logs: `backend/logs/`
2. Browser console: F12 → Console tab
3. Network requests: F12 → Network tab

---

**Setup Complete! 🎉 Ready for full caregiver system testing.**
