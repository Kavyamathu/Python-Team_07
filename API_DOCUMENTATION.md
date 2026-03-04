# Campus Resource Management System - API Documentation

## Base URL
```
http://127.0.0.1:8000/api/
```

## Module 1: User Management APIs

### 1. Create User
**POST** `/api/users/`

Request Body:
```json
{
    "name": "Kavya",
    "email": "kavya@campus.com",
    "phone": "9876543210",
    "role": "STUDENT",
    "status": "ACTIVE"
}
```

### 2. Get All Users
**GET** `/api/users/`

### 3. Get User by ID
**GET** `/api/users/1/`

### 4. Update User
**PUT** `/api/users/1/`

Request Body:
```json
{
    "name": "Kavya Updated",
    "email": "kavya@campus.com",
    "phone": "9876543210",
    "role": "STAFF",
    "status": "ACTIVE"
}
```

### 5. Delete User
**DELETE** `/api/users/1/`

### 6. Filter by Status
**GET** `/api/users/?status=ACTIVE`

---

## Module 2: Resource Management APIs

### 1. Create Resource
**POST** `/api/resources/`

Request Body:
```json
{
    "name": "Computer Lab 1",
    "type": "LAB",
    "capacity": 50,
    "status": "AVAILABLE"
}
```

Example Resources:
```json
{
    "name": "Main Auditorium",
    "type": "EVENT_HALL",
    "capacity": 500,
    "status": "AVAILABLE"
}
```

```json
{
    "name": "Classroom A101",
    "type": "CLASSROOM",
    "capacity": 60,
    "status": "AVAILABLE"
}
```

### 2. Get All Resources
**GET** `/api/resources/`

### 3. Get Resource by ID
**GET** `/api/resources/1/`

### 4. Update Resource
**PUT** `/api/resources/1/`

Request Body:
```json
{
    "name": "Computer Lab 1 - Updated",
    "type": "LAB",
    "capacity": 60,
    "status": "UNAVAILABLE"
}
```

### 5. Delete Resource
**DELETE** `/api/resources/1/`

---

## Module 3: Booking Module APIs

### 1. Create Booking
**POST** `/api/bookings/`

Request Body:
```json
{
    "userId": 1,
    "resourceId": 1,
    "bookingDate": "2026-02-20",
    "timeSlot": "09:00-10:00",
    "status": "PENDING"
}
```

**Business Rule:** If same resource + same date + same timeSlot already exists, returns error:
```json
{
    "error": "Resource already booked for this date and time slot"
}
```

### 2. Get All Bookings
**GET** `/api/bookings/`

### 3. Get Booking by ID
**GET** `/api/bookings/1/`

### 4. Update Booking Status
**PUT** `/api/bookings/1/`

Request Body:
```json
{
    "userId": 1,
    "resourceId": 1,
    "bookingDate": "2026-02-20",
    "timeSlot": "09:00-10:00",
    "status": "APPROVED"
}
```

### 5. Delete Booking
**DELETE** `/api/bookings/1/`

---

## Testing Flow (Postman)

### Step 1: Create Users
```
POST http://127.0.0.1:8000/api/users/
Body: {"name": "Student1", "email": "student1@campus.com", "phone": "1234567890", "role": "STUDENT", "status": "ACTIVE"}
```

### Step 2: Create Resources
```
POST http://127.0.0.1:8000/api/resources/
Body: {"name": "Lab 1", "type": "LAB", "capacity": 50, "status": "AVAILABLE"}
```

### Step 3: Create Booking
```
POST http://127.0.0.1:8000/api/bookings/
Body: {"userId": 1, "resourceId": 1, "bookingDate": "2026-02-20", "timeSlot": "09:00-10:00"}
```

### Step 4: Test Double Booking (Should Fail)
```
POST http://127.0.0.1:8000/api/bookings/
Body: {"userId": 2, "resourceId": 1, "bookingDate": "2026-02-20", "timeSlot": "09:00-10:00"}
Expected: Error message "Resource already booked for this date and time slot"
```

### Step 5: Update Booking Status
```
PUT http://127.0.0.1:8000/api/bookings/1/
Body: {"userId": 1, "resourceId": 1, "bookingDate": "2026-02-20", "timeSlot": "09:00-10:00", "status": "APPROVED"}
```

---

## Field Validations

### User Fields:
- `name`: Required, max 100 chars
- `email`: Required, unique, valid email format
- `phone`: Required, max 15 chars
- `role`: Required, choices: STUDENT, STAFF
- `status`: Required, choices: ACTIVE, INACTIVE

### Resource Fields:
- `name`: Required, max 100 chars
- `type`: Required, choices: LAB, CLASSROOM, EVENT_HALL
- `capacity`: Required, integer
- `status`: Required, choices: AVAILABLE, UNAVAILABLE

### Booking Fields:
- `userId`: Required, must exist in User table
- `resourceId`: Required, must exist in Resource table
- `bookingDate`: Required, date format YYYY-MM-DD
- `timeSlot`: Required, string (e.g., "09:00-10:00")
- `status`: Auto set to PENDING, choices: PENDING, APPROVED, REJECTED

---

## Server Status
Server running at: **http://127.0.0.1:8000/**

Admin Panel: **http://127.0.0.1:8000/admin/**
- Username: admin
- Password: (set during createsuperuser)
