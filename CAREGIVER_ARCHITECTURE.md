# DoseMate Caregiver System - Architecture & Summary

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DOSEMATE CAREGIVER SYSTEM                 │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                   │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────┐         ┌──────────────────────────┐   │
│  │  Patient UI      │         │  Caregiver UI            │   │
│  ├──────────────────┤         ├──────────────────────────┤   │
│  │ • Dashboard      │         │ • Caregiver Dashboard    │   │
│  │ • Medicines      │         │ • Patient List           │   │
│  │ • Reminders      │         │ • Patient Details        │   │
│  │ • Caregivers Mgmt│         │ • Adherence Metrics      │   │
│  │ • History        │         │ • History View           │   │
│  │ • Reports        │         │ • Reports (read-only)    │   │
│  └──────────────────┘         └──────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  AuthContext (manages login + role-based routing)     │   │
│  │  ThemeContext (dark/light mode)                        │   │
│  │  Layout (conditional nav based on user.role)          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└──────────────────────────────────────────────────────────────┘
                              ↕ API
┌──────────────────────────────────────────────────────────────┐
│               BACKEND (Spring Boot + JPA)                     │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ CaregiverController                                    │  │
│  │  - POST   /api/caregiver/generate-invite              │  │
│  │  - POST   /api/caregiver/accept-invite/{code}         │  │
│  │  - PUT    /api/caregiver/{relationId}/approve         │  │
│  │  - DELETE /api/caregiver/{relationId}                 │  │
│  │  - GET    /api/caregiver/my-patients                  │  │
│  │  - GET    /api/caregiver/patient/{id}/reminders       │  │
│  │  - GET    /api/caregiver/patient/{id}/history         │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ CaregiverService                                       │  │
│  │  - generateInviteCode()                                │  │
│  │  - acceptInvite()                                      │  │
│  │  - approveCaregiver()                                  │  │
│  │  - getCaregiverPatients()                              │  │
│  │  - getPatientReminders()                               │  │
│  │  - getPatientHistory()                                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Repositories                                           │  │
│  │  - CaregiverRelationRepository                         │  │
│  │  - UserRepository                                      │  │
│  │  - ReminderRepository                                  │  │
│  │  - HistoryRepository                                   │  │
│  │  - MedicineRepository                                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
└──────────────────────────────────────────────────────────────┘
                              ↕ JDBC
┌──────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                            │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Tables:                                                       │
│  ├── users                                                    │
│  │   ├── id, email, password                                 │
│  │   └── role (ROLE_USER, ROLE_CAREGIVER, ROLE_ADMIN)       │
│  │                                                            │
│  ├── medicines                                               │
│  │   ├── id, user_id, name, dosage                          │
│  │   └── reminder_times                                     │
│  │                                                            │
│  ├── reminders                                               │
│  │   ├── id, medicine_id, scheduled_at                      │
│  │   └── status (PENDING, TRIGGERED, TAKEN, MISSED)        │
│  │                                                            │
│  ├── history                                                 │
│  │   ├── id, reminder_id, status, timestamp                │
│  │   └── source (MANUAL, AUTO)                             │
│  │                                                            │
│  └── caregiver_relations ⭐ NEW                              │
│      ├── id, caregiver_id, patient_id                       │
│      ├── relationship, invite_code                          │
│      └── status (PENDING, APPROVED, REJECTED, REMOVED)      │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### 1. Caregiver Registration Flow

```
User fills registration form
  ↓
Selects role: Patient | Caregiver ← NEW
  ↓
AuthService.register()
  ├→ Sets role based on selection ← NEW
  └→ Saves user with ROLE_CAREGIVER ← NEW
  ↓
JWT token generated (includes role) ← NEW
  ↓
User redirected to login
  ↓
Login → user.role in AuthContext ← NEW
  ↓
Layout checks role ← NEW
  ├→ Patient: Show Medicines + Caregivers menu
  └→ Caregiver: Hide Medicines, Show different dashboard
```

### 2. Caregiver Invitation Flow

```
PATIENT SIDE:
  Patient clicks "Caregivers" menu ← NEW
    ↓
  "Invite Caregiver" form
    ↓
  POST /api/caregiver/generate-invite
    {caregiverEmail, relationship}
    ↓
  CaregiverService generates unique inviteCode
    ↓
  CaregiverRelation created (status=PENDING)
    ↓
  inviteCode returned to frontend
    ↓
  Patient copies code and shares

CAREGIVER SIDE:
  Caregiver receives link: /caregiver/accept/ABC1234D
    ↓
  POST /api/caregiver/accept-invite/{inviteCode}
    ↓
  CaregiverRelation status → PENDING (stays PENDING until patient approves)
    ↓
  Auto-redirect to caregiver dashboard
    ↓
  Caregiver waits for patient approval

PATIENT APPROVAL:
  Patient sees pending request in "Caregivers"
    ↓
  PUT /api/caregiver/{relationId}/approve
    ↓
  CaregiverRelation status → APPROVED ✅
    ↓
  Caregiver can now see patient's data

CAREGIVER ACCESS:
  GET /api/caregiver/my-patients
    ↓
  Returns list of APPROVED patients
    ↓
  Caregiver dashboard loads with patients
```

### 3. Adherence Monitoring Flow

```
Caregiver Dashboard:
  GET /api/caregiver/my-patients
    ↓
  For each patient:
    ├→ COUNT reminders with status=PENDING
    ├→ COUNT history where status=MISSED (last 24h)
    ├→ CALCULATE adherence % = TAKEN / (TAKEN + MISSED) * 100
    └→ Display in PatientOverviewDTO

Patient Details:
  GET /api/caregiver/patient/{id}/reminders
    ├→ Show PENDING + TRIGGERED reminders
    └→ Display scheduled times

  GET /api/caregiver/patient/{id}/history
    ├→ Last 10 entries
    ├→ Show status (TAKEN/MISSED)
    └→ Display timestamp

Real-time Updates:
  When patient marks dose TAKEN:
    ├→ Reminder status → TAKEN
    ├→ History entry created
    └→ Caregiver refreshes dashboard → % updates

  When reminder expires (10 min timeout):
    ├→ Reminder auto-marked MISSED
    ├→ History entry created
    └→ Caregiver sees updated count
```

---

## 🔐 Security Model

```
Authentication Layer:
  ├─ JWT Token includes user.role
  └─ Token verified on every request

Authorization Layer:
  ├─ Patient endpoint:
  │  └─ Checks authentication.getPrincipal() == patient
  │
  ├─ Caregiver endpoint:
  │  ├─ Checks authentication.getPrincipal() == caregiver
  │  ├─ Verifies CaregiverRelation exists
  │  └─ Verifies CaregiverRelation.status == APPROVED
  │
  └─ Public endpoint:
     └─ /caregiver/accept-invite (no auth, uses one-time code)

Data Isolation:
  ├─ Patient only sees their own medicines
  ├─ Caregiver only sees APPROVED patients
  └─ All queries filtered by user_id
```

---

## 📈 Scalability Considerations

### Current Implementation
- Single server deployment
- Direct REST API calls (no caching)
- In-memory session management

### For Production Scale

**Immediate Improvements:**
- [ ] Add Redis caching for patient lists (invalidate on changes)
- [ ] Implement pagination for large patient lists
- [ ] Add database indexing on `caregiver_relations(caregiver_id, status)`
- [ ] Rate limiting on invite generation

**Advanced Features:**
- [ ] WebSocket for real-time caregiver notifications
- [ ] Message queue for async operations
- [ ] CDN for static assets
- [ ] Multi-region deployment

---

## 📚 Database Schema

```sql
-- New table for caregiver relationships
CREATE TABLE caregiver_relations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    caregiver_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    relationship VARCHAR(50),
    status ENUM('PENDING','APPROVED','REJECTED','REMOVED') DEFAULT 'PENDING',
    invite_code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    
    FOREIGN KEY (caregiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_caregiver_status (caregiver_id, status),
    INDEX idx_patient_status (patient_id, status),
    INDEX idx_invite_code (invite_code)
);

-- Modified users table
ALTER TABLE users ADD COLUMN role ENUM('ROLE_USER','ROLE_CAREGIVER','ROLE_ADMIN') DEFAULT 'ROLE_USER';
```

---

## 🎯 Use Cases Enabled

### Use Case 1: Elderly Patient with Family Caregiver
```
Patient (Grandpa, 75):
  - Takes 5 medicines daily
  - Gets reminders on phone
  - Forgets sometimes

Caregiver (Granddaughter, 30):
  - Lives in different city
  - Uses DoseMate caregiver dashboard
  - Sees grandpa's adherence daily
  - Gets alerted on missed doses
  - Can follow up by phone
  - Shares data with doctor
```

### Use Case 2: Nursing Home Manager
```
Manager:
  - Registers as ROLE_CAREGIVER
  - Adds 50 patients (each registers with ROLE_USER)
  - Gets invite codes, distributes to family
  - Monitors all patients on one dashboard
  - Ensures regulatory compliance
  - Generates reports for audits
```

### Use Case 3: Clinical Trial Coordinator
```
Coordinator:
  - Manages 200 trial participants
  - Each participant patient, coordinator is caregiver
  - Tracks adherence metrics
  - Exports reports for analysis
  - Verifies protocol compliance
```

---

## 🚀 Deployment Checklist

- [ ] Backend JAR built and tested
- [ ] Frontend build optimized
- [ ] Database migrations applied
- [ ] JWT secret configured
- [ ] CORS origins updated
- [ ] SSL certificate installed
- [ ] API rate limiting enabled
- [ ] Logging configured
- [ ] Monitoring alerts set up
- [ ] Backup strategy implemented
- [ ] User documentation complete
- [ ] Admin guide available

---

## 📞 Support & Maintenance

**Bug Reports:** Check CAREGIVER_TESTING_CHECKLIST.md  
**Setup Issues:** Refer to CAREGIVER_SETUP_GUIDE.md  
**Quick Start:** See CAREGIVER_QUICK_START.md  

---

**System Ready for Integration Testing ✅**
