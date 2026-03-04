# Frontend Setup Instructions

## Prerequisites
- Node.js installed
- Backend running at http://127.0.0.1:8000/

## Installation

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Frontend will open at: **http://localhost:3001/**

## Features

### 1. Login Page
- Login with Email or Phone
- Password authentication
- 3 failed attempts → Account locked
- "Try another way" option

### 2. User Management
- Create, Read, Update, Delete users
- Fields: name, email, phone, password, role, status
- Validations: no special chars, size limits

### 3. Resource Management
- Create, Read, Update, Delete resources
- Fields: name, type (LAB/CLASSROOM/EVENT_HALL), capacity, status

### 4. Booking Management
- Create, Read, Update, Delete bookings
- Double-booking prevention
- Shows error if resource already booked for same date/time

## Usage Flow

1. Open http://localhost:3001/
2. Login with existing user credentials
3. Navigate to Users/Resources/Bookings
4. Perform CRUD operations
5. Test double-booking by creating same booking twice

## API Integration

All components connect to backend at:
- Users: http://127.0.0.1:8000/api/users/
- Resources: http://127.0.0.1:8000/api/resources/
- Bookings: http://127.0.0.1:8000/api/bookings/
- Login: http://127.0.0.1:8000/api/login/

## Troubleshooting

### Port 3000 already in use
- Frontend configured to use port 3001
- Check frontend/.env file

### CORS errors
- Backend already configured with CORS_ALLOW_ALL_ORIGINS = True
- No additional setup needed

### API connection failed
- Ensure backend is running at http://127.0.0.1:8000/
- Check Django server is active

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── UserManagement.js
│   │   ├── ResourceManagement.js
│   │   └── BookingManagement.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── .env
```

## Done! 🎉

Frontend ready with full CRUD operations and backend integration!
