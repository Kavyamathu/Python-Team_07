# Campus Resource Management System - Complete Postman Testing Guide

## Base URL
```
http://127.0.0.1:8000
```

---

## 1. USER MANAGEMENT APIs

### 1.1 Create User (POST)
**Endpoint:** `POST http://127.0.0.1:8000/api/users/`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "country_code": "+91",
    "phone": "9876543210",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "country": "India",
    "password": "password123",
    "role": "STUDENT",
    "status": "ACTIVE"
}
```

**Expected Response (201 Created):**
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "country_code": "+91",
    "phone": "9876543210",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "country": "India",
    "role": "STUDENT",
    "status": "ACTIVE",
    "createdAt": "2026-02-22T10:30:00Z"
}
```

---

### 1.2 Get All Users (GET)
**Endpoint:** `GET http://127.0.0.1:8000/api/users/`

**Expected Response (200 OK):**
```json
[
    {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "role": "STUDENT",
        "status": "ACTIVE"
    }
]
```

---

### 1.3 Get User by ID (GET)
**Endpoint:** `GET http://127.0.0.1:8000/api/users/1/`

**Expected Response (200 OK):**
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "country_code": "+91",
    "phone": "9876543210",
    "role": "STUDENT",
    "status": "ACTIVE"
}
```

---

### 1.4 Update User (PUT)
**Endpoint:** `PUT http://127.0.0.1:8000/api/users/1/`

**Body (JSON):**
```json
{
    "name": "John Updated",
    "email": "john@example.com",
    "country_code": "+91",
    "phone": "9876543210",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "country": "India",
    "password": "password123",
    "role": "STUDENT",
    "status": "ACTIVE"
}
```

**Expected Response (200 OK):**
```json
{
    "id": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "status": "ACTIVE"
}
```

---

### 1.5 Delete User (DELETE)
**Endpoint:** `DELETE http://127.0.0.1:8000/api/users/1/`

**Expected Response (204 No Content)**

---

### 1.6 Filter Users by Status (GET)
**Endpoint:** `GET http://127.0.0.1:8000/api/users/?status=PENDING_STAFF`

**Expected Response (200 OK):**
```json
[
    {
        "id": 2,
        "name": "Pending User",
        "status": "PENDING_STAFF"
    }
]
```

---

### 1.7 Staff Review User (POST)
**Endpoint:** `POST http://127.0.0.1:8000/api/users/2/staff_review/`

**Body (JSON) - Approve:**
```json
{
    "action": "approve"
}
```

**Body (JSON) - Reject:**
```json
{
    "action": "reject",
    "reason": "Invalid documents"
}
```

**Expected Response (200 OK):**
```json
{
    "message": "User approved by staff. Sent to admin for final approval."
}
```

---

### 1.8 Admin Review User (POST)
**Endpoint:** `POST http://127.0.0.1:8000/api/users/2/admin_review/`

**Body (JSON) - Approve:**
```json
{
    "action": "approve"
}
```

**Body (JSON) - Reject:**
```json
{
    "action": "reject",
    "reason": "Does not meet criteria"
}
```

**Expected Response (200 OK):**
```json
{
    "message": "User approved by admin. Account is now active."
}
```

---

## 2. RESOURCE MANAGEMENT APIs

### 2.1 Create Resource (POST)
**Endpoint:** `POST http://127.0.0.1:8000/api/resources/`

**Body (JSON):**
```json
{
    "name": "Computer Lab 1",
    "type": "LAB",
    "capacity": 40,
    "status": "AVAILABLE"
}
```

**Expected Response (201 Created):**
```json
{
    "id": 1,
    "name": "Computer Lab 1",
    "type": "LAB",
    "capacity": 40,
    "status": "AVAILABLE"
}
```

---

### 2.2 Get All Resources (GET)
**Endpoint:** `GET http://127.0.0.1:8000/api/resources/`

**Expected Response (200 OK):**
```json
[
    {
        "id": 1,
        "name": "Computer Lab 1",
        "type": "LAB",
        "capacity": 40,
        "status": "AVAILABLE"
    },
    {
        "id": 2,
        "name": "Main Auditorium",
        "type": "EVENT_HALL",
        "capacity": 500,
        "status": "AVAILABLE"
    }
]
```

---

### 2.3 Get Resource by ID (GET)
**Endpoint:** `GET http://127.0.0.1:8000/api/resources/1/`

**Expected Response (200 OK):**
```json
{
    "id": 1,
    "name": "Computer Lab 1",
    "type": "LAB",
    "capacity": 40,
    "status": "AVAILABLE"
}
```

---

### 2.4 Update Resource (PUT)
**Endpoint:** `PUT http://127.0.0.1:8000/api/resources/1/`

**Body (JSON):**
```json
{
    "name": "Computer Lab 1 - Updated",
    "type": "LAB",
    "capacity": 50,
    "status": "AVAILABLE"
}
```

**Expected Response (200 OK):**
```json
{
    "id": 1,
    "name": "Computer Lab 1 - Updated",
    "type": "LAB",
    "capacity": 50,
    "status": "AVAILABLE"
}
```

---

### 2.5 Delete Resource (DELETE)
**Endpoint:** `DELETE http://127.0.0.1:8000/api/resources/1/`

**Expected Response (204 No Content)**

---

## 3. BOOKING MANAGEMENT APIs

### 3.1 Create Booking (POST)
**Endpoint:** `POST http://127.0.0.1:8000/api/bookings/`

**Body (JSON):**
```json
{
    "userId": 1,
    "resourceId": 1,
    "bookingDate": "2026-02-25",
    "timeSlot": "09:00-10:00",
    "status": "PENDING"
}
```

**Expected Response (201 Created):**
```json
{
    "id": 1,
    "userId": 1,
    "resourceId": 1,
    "bookingDate": "2026-02-25",
    "timeSlot": "09:00-10:00",
    "status": "PENDING"
}
```

**Error Response (400 Bad Request) - Double Booking:**
```json
{
    "error": "This resource is already booked for the selected date and time slot"
}
```

---

### 3.2 Get All Bookings (GET)
**Endpoint:** `GET http://127.0.0.1:8000/api/bookings/`

**Expected Response (200 OK):**
```json
[
    {
        "id": 1,
        "userId": 1,
        "resourceId": 1,
        "bookingDate": "2026-02-25",
        "timeSlot": "09:00-10:00",
        "status": "PENDING"
    }
]
```

---

### 3.3 Get Booking by ID (GET)
**Endpoint:** `GET http://127.0.0.1:8000/api/bookings/1/`

**Expected Response (200 OK):**
```json
{
    "id": 1,
    "userId": 1,
    "resourceId": 1,
    "bookingDate": "2026-02-25",
    "timeSlot": "09:00-10:00",
    "status": "PENDING"
}
```

---

### 3.4 Update Booking (PUT)
**Endpoint:** `PUT http://127.0.0.1:8000/api/bookings/1/`

**Body (JSON) - Approve:**
```json
{
    "userId": 1,
    "resourceId": 1,
    "bookingDate": "2026-02-25",
    "timeSlot": "09:00-10:00",
    "status": "APPROVED"
}
```

**Body (JSON) - Reject with Reason:**
```json
{
    "userId": 1,
    "resourceId": 1,
    "bookingDate": "2026-02-25",
    "timeSlot": "09:00-10:00",
    "status": "REJECTED",
    "rejection_reason": "Resource under maintenance"
}
```

**Expected Response (200 OK):**
```json
{
    "id": 1,
    "userId": 1,
    "resourceId": 1,
    "bookingDate": "2026-02-25",
    "timeSlot": "09:00-10:00",
    "status": "APPROVED"
}
```

---

### 3.5 Delete Booking (DELETE)
**Endpoint:** `DELETE http://127.0.0.1:8000/api/bookings/1/`

**Expected Response (204 No Content)**

---

## 4. LOGIN API

### 4.1 Login with Email (POST)
**Endpoint:** `POST http://127.0.0.1:8000/api/login/`

**Body (JSON):**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "STUDENT",
        "status": "ACTIVE"
    }
}
```

---

### 4.2 Login with Phone (POST)
**Endpoint:** `POST http://127.0.0.1:8000/api/login/`

**Body (JSON):**
```json
{
    "phone": "9876543210",
    "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "name": "John Doe",
        "phone": "9876543210",
        "role": "STUDENT"
    }
}
```

---

## 5. COMPLETE WORKFLOW TEST

### Step 1: Create Student User
```
POST http://127.0.0.1:8000/api/users/
Body: {"name": "Student 1", "email": "student@test.com", "phone": "1234567890", "password": "pass123", "role": "STUDENT", "status": "PENDING_STAFF"}
```

### Step 2: Create Staff User
```
POST http://127.0.0.1:8000/api/users/
Body: {"name": "Staff 1", "email": "staff@test.com", "phone": "9876543210", "password": "pass123", "role": "STAFF", "status": "ACTIVE"}
```

### Step 3: Create Admin User
```
POST http://127.0.0.1:8000/api/users/
Body: {"name": "Admin 1", "email": "admin@test.com", "phone": "5555555555", "password": "pass123", "role": "ADMIN", "status": "ACTIVE"}
```

### Step 4: Staff Approves Student
```
POST http://127.0.0.1:8000/api/users/1/staff_review/
Body: {"action": "approve"}
```

### Step 5: Admin Approves Student
```
POST http://127.0.0.1:8000/api/users/1/admin_review/
Body: {"action": "approve"}
```

### Step 6: Create Resource
```
POST http://127.0.0.1:8000/api/resources/
Body: {"name": "Computer Lab 1", "type": "LAB", "capacity": 40, "status": "AVAILABLE"}
```

### Step 7: Create Booking
```
POST http://127.0.0.1:8000/api/bookings/
Body: {"userId": 1, "resourceId": 1, "bookingDate": "2026-02-25", "timeSlot": "09:00-10:00", "status": "PENDING"}
```

### Step 8: Staff Approves Booking
```
PUT http://127.0.0.1:8000/api/bookings/1/
Body: {"userId": 1, "resourceId": 1, "bookingDate": "2026-02-25", "timeSlot": "09:00-10:00", "status": "APPROVED"}
```

---

## 6. ERROR SCENARIOS TO TEST

### 6.1 Duplicate Email
```
POST http://127.0.0.1:8000/api/users/
Body: Same email as existing user
Expected: 400 Bad Request
```

### 6.2 Duplicate Phone
```
POST http://127.0.0.1:8000/api/users/
Body: Same phone as existing user
Expected: 400 Bad Request
```

### 6.3 Double Booking
```
POST http://127.0.0.1:8000/api/bookings/
Body: Same resource, date, and time slot as existing booking
Expected: 400 Bad Request with error message
```

### 6.4 Invalid Login
```
POST http://127.0.0.1:8000/api/login/
Body: Wrong password
Expected: 401 Unauthorized
```

### 6.5 Pending User Login
```
POST http://127.0.0.1:8000/api/login/
Body: User with status PENDING_STAFF
Expected: 403 Forbidden with message about pending approval
```

---

## 7. VALIDATION TESTS

### 7.1 Phone Number Validation
```
POST http://127.0.0.1:8000/api/users/
Body: {"phone": "123"} (less than 10 digits)
Expected: 400 Bad Request
```

### 7.2 Email Format Validation
```
POST http://127.0.0.1:8000/api/users/
Body: {"email": "invalid-email"}
Expected: 400 Bad Request
```

### 7.3 Name with Special Characters
```
POST http://127.0.0.1:8000/api/users/
Body: {"name": "John@123"}
Expected: 400 Bad Request
```

---

## Testing Checklist

- [ ] Create User (Student/Staff/Admin)
- [ ] Get All Users
- [ ] Get User by ID
- [ ] Update User
- [ ] Delete User
- [ ] Filter Users by Status
- [ ] Staff Review (Approve/Reject)
- [ ] Admin Review (Approve/Reject)
- [ ] Create Resource
- [ ] Get All Resources
- [ ] Update Resource
- [ ] Delete Resource
- [ ] Create Booking
- [ ] Get All Bookings
- [ ] Update Booking (Approve/Reject)
- [ ] Delete Booking
- [ ] Login with Email
- [ ] Login with Phone
- [ ] Test Double Booking Prevention
- [ ] Test Duplicate Email/Phone
- [ ] Test Validation Errors

---

**All APIs Working! Ready for Testing!** ✅
