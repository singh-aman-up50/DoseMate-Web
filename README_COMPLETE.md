# 💊 DoseMate - Medicine Reminder App
## Complete Full-Stack Application

A modern, production-ready medicine reminder application built with **Spring Boot**, **React**, and **Recharts**. Helps users manage their medications with smart reminders, real-time adherence tracking, and comprehensive health analytics.

---

## ✨ Features

### 🩺 Medicine Management
- Add, edit, delete medicines with rich details
- Track medication stock with low-stock warnings
- Support for medicine images and custom tags
- Organize by type (antibiotic, painkiller, vitamin, etc.)
- Multiple reminder times per medicine
- Medication information includes:
  - Name, brand, strength
  - Dosage and frequency
  - Route (oral, injection, topical, etc.)
  - Units (tablet, capsule, ml)
  - Stock levels and refill thresholds

### ⏰ Intelligent Reminders
- Automatic reminder generation based on schedules
- Multiple delivery channels (app, email, SMS ready)
- Customizable repeat patterns (daily, weekly, monthly)
- Snooze functionality (default 10 minutes)
- Timezone-aware scheduling
- Status tracking (PENDING, TAKEN, MISSED, SNOOZED)
- Real-time reminder notifications

### 📊 Adherence Analytics
- Overall adherence percentage calculation
- Weekly trends with bar charts
- Daily performance metrics with line charts
- Medicine-specific statistics
- Taken vs missed dose tracking
- Average response latency monitoring
- Historical data aggregation
- Date-range filtering for custom reports

### 📈 Real-Time Dashboard
- Live updating charts via WebSocket
- Weekly adherence visualization (bar chart)
- Overall status pie chart
- Pending reminders list
- Quick action buttons (mark taken, snooze)
- Responsive design (mobile, tablet, desktop)
- Beautiful Tailwind CSS UI

### 🔐 Security
- JWT token-based authentication
- User data isolation and privacy
- CSRF protection enabled
- Role-based access control
- Secure password hashing (bcrypt)
- Session management with token refresh
- Input validation on all endpoints

---

## 🛠️ Tech Stack

### Backend
| Component | Technology |
|-----------|------------|
| Framework | Spring Boot 3.1.4 |
| Database | PostgreSQL |
| ORM | Hibernate/JPA |
| Security | Spring Security + JWT |
| Real-Time | Spring WebSocket |
| Build Tool | Maven |
| Java Version | 17+ (Tested on Java 22) |

### Frontend
| Component | Technology |
|-----------|------------|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS 3 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| HTTP Client | Axios |
| Routing | React Router v6 |

### Database
- **RDBMS**: PostgreSQL
- **Connection Pool**: HikariCP
- **Auto Schema**: Hibernate DDL Update

---

## 📋 API Endpoints

### Medicines
```
POST   /api/medicines              - Create medicine
GET    /api/medicines              - List all medicines
GET    /api/medicines/active       - List active medicines
GET    /api/medicines/search       - Search medicines
GET    /api/medicines/{id}         - Get medicine details
GET    /api/medicines/{id}/stock-status - Check stock status
PUT    /api/medicines/{id}         - Update medicine
PUT    /api/medicines/{id}/stock   - Update stock level
DELETE /api/medicines/{id}         - Delete medicine
```

### Reminders
```
POST   /api/reminders/medicine/{medicineId} - Create reminder
GET    /api/reminders/medicine/{medicineId} - Get reminders for medicine
GET    /api/reminders/pending              - Get pending reminders
GET    /api/reminders/upcoming             - Get upcoming (next 24h)
PUT    /api/reminders/{id}/status          - Mark as taken/missed
PUT    /api/reminders/{id}/snooze          - Snooze reminder
```

### History & Analytics
```
GET    /api/history                        - Get intake history
GET    /api/history/date-range            - Filter by date range
GET    /api/history/medicine/{medicineId} - Medicine-specific history
POST   /api/history                        - Record intake
GET    /api/history/stats                 - Overall adherence stats
GET    /api/history/stats/medicine/{id}   - Medicine-specific stats
GET    /api/history/stats/weekly          - Weekly trends (7-day)
```

### Authentication
```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login and get JWT token
GET    /api/auth/me               - Get current user info
PUT    /api/auth/change-password  - Change password
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** (tested on Java 22)
- **Node.js 16+** and npm
- **PostgreSQL 12+**
- **Git**

### Database Setup
```bash
# Create database
createdb dosemate

# Or using psql
psql -U postgres
CREATE DATABASE dosemate;
```

### Backend Setup
```bash
cd backend

# Update application.properties with your database credentials
# File: src/main/resources/application.properties
# spring.datasource.url=jdbc:postgresql://localhost:5432/dosemate
# spring.datasource.username=postgres
# spring.datasource.password=yourpassword

# Build and run
mvn clean install
mvn spring-boot:run

# Server starts on http://localhost:8080
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# App opens at http://localhost:5173
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build
# Output in dist/ directory

# Backend
cd backend
mvn clean package
# JAR in target/ directory
```

---

## 📖 Usage Guide

### Creating a Medicine
1. Navigate to **Medicines** page
2. Click **Add Medicine**
3. Fill in medicine details:
   - Name and brand
   - Strength and dosage
   - Route and unit
   - Reminder times (e.g., "09:00", "14:00", "21:00")
   - Initial stock
   - Refill threshold
   - Tags (optional)
4. Click **Save**

### Setting Up Reminders
1. Navigate to **Medicines**
2. Select medicine
3. Configure reminder times in 24-hour format
4. Save changes
5. System automatically generates daily reminders

### Marking Doses as Taken
1. Go to **Dashboard**
2. View pending reminders
3. Click **Mark Taken** on reminder
4. Optionally add notes
5. Submit - intake is recorded
6. Dashboard updates in real-time

### Viewing Analytics
1. Navigate to **Reports**
2. Select time range (week/month/all-time)
3. Optionally filter by medicine
4. View:
   - Key metrics (adherence %, taken/missed counts)
   - Weekly trend chart
   - Daily performance chart
   - Medicine-wise breakdown
5. Export as CSV

---

## 🔄 Key Workflows

### Daily Reminder Flow
```
Schedule Check (every minute)
    ↓
Check all active medicines
    ↓
Find medicines with reminders in next 5 minutes
    ↓
Create pending reminders
    ↓
Mark overdue reminders as missed
    ↓
Record missed doses to history
```

### User Intake Flow
```
Reminder Notification
    ↓
User Opens App/Dashboard
    ↓
Clicks "Mark Taken"
    ↓
System Records Intake
    ↓
Broadcast WebSocket Event
    ↓
Dashboard/Charts Update in Real-Time
    ↓
Adherence Stats Recalculated
```

---

## 🎨 UI Components

### Pages
- **Dashboard**: Overview with charts and pending reminders
- **Medicines**: CRUD interface for medicine management
- **Reminders**: Upcoming and pending reminders management
- **History**: Complete intake log with filtering
- **Reports**: Analytics and adherence trends
- **Profile**: User information and preferences

### Reusable Components
- `Layout`: Main layout with navigation header
- `ProtectedRoute`: Authentication wrapper for routes
- `StatCard`: Statistics display component
- `ReminderCard`: Reminder display component
- `MedicineForm`: Medicine creation/editing form

---

## 🔧 Configuration

### Backend Configuration
**File**: `backend/src/main/resources/application.properties`

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/dosemate
spring.datasource.username=postgres
spring.datasource.password=yourpassword

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT
jwt.secret=your-secret-key-here
jwt.expiration=86400000 # 24 hours

# Server
server.port=8080
server.servlet.context-path=/api
```

### Frontend Configuration
**File**: `frontend/src/api/axios.js`

```javascript
const API_BASE_URL = 'http://localhost:8080/api'
const WS_URL = 'ws://localhost:8080/ws'
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
mvn test
# 4 unit tests for controllers included
```

### Test Coverage
- Medicine CRUD operations
- Reminder status updates
- History recording
- Authentication flow

---

## 📊 Database Schema

### Key Tables
- `users` - User accounts and profiles
- `medicines` - Medicine catalog per user
- `medicine_images` - Medicine images (collection)
- `medicine_tags` - Medicine tags (collection)
- `reminders` - Scheduled reminders
- `history` - Intake records and adherence tracking

### Relationships
- **User → Medicines**: One-to-many
- **Medicine → Reminders**: One-to-many
- **Reminder → History**: One-to-many

---

## 🔒 Security Features

✅ **JWT Authentication**: Token-based stateless auth
✅ **CSRF Protection**: Built-in Spring Security CSRF tokens
✅ **Input Validation**: Server-side validation on all endpoints
✅ **User Isolation**: Users see only their own data
✅ **Password Encryption**: bcrypt hashing with salt
✅ **Rate Limiting**: Ready for implementation
✅ **CORS Configuration**: Properly configured for frontend

---

## 🌐 WebSocket Real-Time Updates

### Endpoints
- `ws://localhost:8080/ws/reminders` - Reminder events
- `ws://localhost:8080/ws/adherence` - Adherence updates

### Events
```javascript
// Intake recorded event
{
  type: "INTAKE_RECORDED",
  reminderId: 123,
  medicineId: 456,
  medicineName: "Aspirin",
  status: "TAKEN",
  timestamp: "2024-12-19T16:30:00Z",
  latencySeconds: 120
}
```

---

## 📱 Responsive Design

- **Mobile**: Full functionality on phones (320px+)
- **Tablet**: Optimized layouts for tablets (768px+)
- **Desktop**: Enhanced experience with full nav (1024px+)
- **Touch-friendly**: Large buttons for mobile users
- **Performance**: Optimized images and lazy loading

---

## 🚀 Production Deployment

### Docker Setup (Optional)
```dockerfile
# Backend Dockerfile
FROM openjdk:22-slim
COPY target/dosemate-backend-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

# Frontend Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

### Environment Variables
```bash
# Backend
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
JWT_SECRET
JWT_EXPIRATION

# Frontend
REACT_APP_API_URL
REACT_APP_WS_URL
```

---

## 📝 API Documentation

Detailed API documentation available in `API_DOCUMENTATION.md`:
- Complete endpoint reference
- Request/response schemas
- Authentication details
- Error handling
- Example usage

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check Java version
java -version

# Clear Maven cache
mvn clean install

# Check database connection
psql -U postgres -d dosemate
```

### Frontend Issues
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Clear browser cache
# Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
```

### WebSocket Connection Failed
```
- Ensure backend is running on port 8080
- Check firewall settings
- Browser console for error details
```

---

## 🤝 Contributing

This is a complete implementation. For extensions:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💻 Development Notes

### Recent Updates (Dec 19, 2024)
- ✅ Complete backend API implementation
- ✅ Real-time WebSocket integration
- ✅ Modern React frontend with Tailwind CSS
- ✅ Recharts integration for analytics
- ✅ User authentication and security
- ✅ Database schema with auto-migrations
- ✅ Unit tests for all controllers
- ✅ Comprehensive documentation

### Next Steps (Optional)
- Push notifications (Firebase Cloud Messaging)
- Email reminders (SendGrid/Mailgun)
- SMS reminders (Twilio)
- Mobile app (React Native)
- Advanced analytics (predictions)
- Doctor sharing features

---

## 📞 Support

For issues, questions, or suggestions:
1. Check existing documentation
2. Review API_DOCUMENTATION.md
3. Check backend/frontend logs
4. Verify database connection

---

## 🎉 Thank You

Thank you for using DoseMate! We hope this app helps you stay healthy and organized with your medications.

**Built with ❤️ using Spring Boot, React, and Tailwind CSS**

**Version**: 1.0.0  
**Last Updated**: December 19, 2024

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

---

**Happy Coding! 🚀**
