# DoseMate Caregiver Feature - Complete Implementation Guide

## 🔧 Critical Step 1: Fix Database Constraint Error

The error you're encountering is due to a PostgreSQL CHECK constraint that doesn't match your Java enum values.

### Solution:

Run the following SQL command in your PostgreSQL database (using pgAdmin or psql):

```sql
-- Drop the existing constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the corrected constraint
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('ROLE_USER', 'ROLE_CAREGIVER', 'ROLE_ADMIN'));
```

**How to execute:**
1. Open pgAdmin → Connect to your `dosemate` database
2. Open Query Tool
3. Paste the SQL above and execute
4. You should see `Query returned successfully`

---

## ✅ Backend Implementation Status

All backend components are already implemented:

### 1. **Models** ✓
- `User.java` - Contains role field with enum mapping
- `CaregiverRelation.java` - Manages caregiver-patient relationships
- `CaregiverStatus.java` - Enum for relationship status (PENDING, APPROVED, REJECTED, REMOVED)

### 2. **Repository** ✓
- `CaregiverRelationRepository.java` - Full data access layer

### 3. **Service** ✓
- `CaregiverService.java` - Business logic for:
  - Generating invites for caregivers
  - Accepting/rejecting invites
  - Managing patient-caregiver relationships
  - Viewing patient data (medicines, reminders, history)
  - Calculating patient adherence metrics

### 4. **API Controller** ✓
- `CaregiverController.java` - All REST endpoints:
  - `POST /api/caregiver/generate-invite` - Patient invites caregiver
  - `POST /api/caregiver/accept-invite/{code}` - Caregiver accepts invite
  - `GET /api/caregiver/my-patients` - Caregiver views all patients
  - `GET /api/caregiver/pending-invites` - Caregiver views pending invites
  - `POST /api/caregiver/{id}/respond` - Caregiver accept/reject invite
  - `GET /api/caregiver/patient/{id}/reminders` - View patient's reminders
  - `GET /api/caregiver/patient/{id}/history` - View patient's medication history
  - And more...

---

## 🎨 Frontend Implementation Status

All frontend components are already implemented:

### 1. **Pages**
- `CaregiverDashboard.jsx` - Main caregiver dashboard showing:
  - Pending invites from patients
  - List of approved patients
  - Patient details with adherence metrics
  - Weekly adherence chart
  - Recent medication history
  
- `ManageCaregivers.jsx` - Patient's caregiver management page:
  - Invite caregiver by email
  - Manage pending requests
  - View approved caregivers
  - Remove caregivers

- `AcceptCaregiverInvite.jsx` - Caregiver acceptance page

- `CaregiverProfile.jsx` - Caregiver profile settings

### 2. **API Integration**
- All endpoints connected via `/api/axios` client

### 3. **Routes**
- `/caregiver/dashboard` - Caregiver dashboard
- `/caregiver/profile` - Caregiver profile
- `/caregiver/accept/:code` - Accept invite link

---

## 📱 User Workflows

### **Patient invites Caregiver:**
1. Patient goes to "Manage Caregivers" page
2. Clicks "Invite Caregiver"
3. Enters caregiver's email and relationship type
4. System generates an invite code
5. Patient shares the code with caregiver

### **Caregiver Accepts Invite:**
1. Caregiver receives the invite code
2. Caregiver visits `/caregiver/accept/CODE`
3. Or caregiver logs in to dashboard → "Pending Invites" 
4. Caregiver clicks "Accept" button
5. Relationship moves to APPROVED status

### **Caregiver Views Patient Data:**
1. Caregiver logs in → Caregiver Dashboard
2. Sees list of approved patients
3. Clicks on patient to view:
   - Adherence rate
   - Pending reminders
   - Medication history
   - Weekly adherence chart
   - Missed doses count
   - Active medicines count

---

## 🛠️ Testing the Feature

### 1. **Create Test Users:**

**Patient User:**
- Email: patient@example.com
- Password: Test@123
- Role: Patient (ROLE_USER)

**Caregiver User:**
- Email: caregiver@example.com
- Password: Test@123
- Role: Caregiver (ROLE_CAREGIVER)
- Organization: City Hospital
- License: DL123456
- Specialization: General Medicine
- Experience: 5 years

### 2. **Test Workflow:**

**Step 1:** Register patient with ROLE_USER (default)

**Step 2:** Register caregiver with ROLE_CAREGIVER and required fields

**Step 3:** Login as patient → Manage Caregivers

**Step 4:** Generate invite for caregiver@example.com

**Step 5:** Copy the invite code

**Step 6:** Logout and login as caregiver

**Step 7:** Visit caregiver dashboard → See pending invite

**Step 8:** Click Accept → Caregiver approved

**Step 9:** Now caregiver can see patient's data

---

## 🚀 Key Features

### **For Caregivers:**
✅ View all assigned patients
✅ See patient's medications and reminders
✅ Track medication adherence with charts
✅ View patient's recent history
✅ Receive and manage invites
✅ Accept/reject patient requests
✅ Monitor pending reminders per patient

### **For Patients:**
✅ Invite specific caregivers
✅ Manage caregiver relationships
✅ Approve/reject caregiver requests
✅ Remove caregivers
✅ Control caregiver access

---

## 📊 Data Security

- Caregivers can ONLY view data of approved patients
- Role-based access control ensures proper authorization
- Patient data is protected and only visible to linked caregivers
- All relationships require explicit approval

---

## 🔄 Database Schema

```
users
├── id (PK)
├── email (UNIQUE)
├── password (hashed)
├── role (ROLE_USER, ROLE_CAREGIVER, ROLE_ADMIN)
├── firstName, lastName
├── phone, address, age
├── organization (for caregivers)
├── licenseNumber (for caregivers)
├── specialization (for caregivers)
├── yearsExperience (for caregivers)
└── createdAt, updatedAt

caregiver_relations
├── id (PK)
├── caregiver_id (FK → users)
├── patient_id (FK → users)
├── relationship (son, nurse, doctor, etc.)
├── status (PENDING, APPROVED, REJECTED, REMOVED)
├── inviteCode (unique)
├── createdAt
└── approvedAt
```

---

## 📝 Next Steps

1. **Execute the SQL constraint fix** (see Step 1 above)
2. **Test user registration** with ROLE_CAREGIVER
3. **Test the complete workflow** using test users
4. **Customize UI** as per your requirements
5. **Add notifications** (optional - when caregiver accepts invite)

---

## 🆘 Troubleshooting

### Issue: Still getting "users_role_check" constraint error
**Solution:** Make sure you executed the SQL fix in the correct database (dosemate)

### Issue: Caregiver not appearing in dashboard
**Solution:** Ensure caregiver role is ROLE_CAREGIVER and all required fields are filled

### Issue: Invites not showing up
**Solution:** Check that the caregiver's email matches exactly when generating invite

---

## 📞 API Endpoints Reference

### Patient Endpoints
```
POST   /api/caregiver/generate-invite      Generate caregiver invite
GET    /api/caregiver/my-caregivers        View approved caregivers
GET    /api/caregiver/pending-requests     View pending caregiver requests
PUT    /api/caregiver/{id}/approve         Approve caregiver request
PUT    /api/caregiver/{id}/reject          Reject caregiver request
DELETE /api/caregiver/{id}                 Remove caregiver
```

### Caregiver Endpoints
```
POST   /api/caregiver/accept-invite/{code}  Accept invite using code
GET    /api/caregiver/pending-invites       View pending patient invites
POST   /api/caregiver/{id}/respond          Accept/reject invite (ACCEPT/REJECT)
GET    /api/caregiver/my-patients           View all approved patients
GET    /api/caregiver/patient/{id}/reminders View patient's reminders
GET    /api/caregiver/patient/{id}/history   View patient's history
```

---

## 🎯 Feature Highlights

1. **Invite-based Access:** Only caregivers with valid emails can be invited
2. **Two-way Approval:** Both patient and caregiver must approve the relationship
3. **Real-time Dashboard:** Caregivers see live patient data
4. **Adherence Tracking:** Visual charts showing patient medication compliance
5. **Relationship Management:** Easy add/remove caregiver functionality
6. **Role-based Security:** Backend enforces that only approved caregivers see data

---

**Status: ✅ COMPLETE - Ready for Production Testing**
