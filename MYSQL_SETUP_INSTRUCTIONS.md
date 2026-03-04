# MySQL Workbench Setup Instructions

## Step 1: MySQL Workbench la Database Create Pannunga

1. **MySQL Workbench open pannunga**

2. **Local connection select pannunga** (localhost:3306)

3. **New SQL Tab open pannunga** (File → New Query Tab or Ctrl+T)

4. **Itha copy panni paste pannunga:**

```sql
CREATE DATABASE IF NOT EXISTS campus_resource_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

5. **Execute pannunga** (Lightning bolt icon or Ctrl+Enter)

6. **Verify pannunga:**
```sql
SHOW DATABASES;
```

`campus_resource_db` list la irukka check pannunga.

## Step 2: Python MySQL Client Install Pannunga

```bash
pip install mysqlclient
```

**Windows la issue vantha:**
```bash
pip install pymysql
```

Aprm `event_booking/__init__.py` file la add pannunga:
```python
import pymysql
pymysql.install_as_MySQLdb()
```

## Step 3: .env File Setup

1. `.env.example` ah `.env` nu copy pannunga:
```bash
copy .env.example .env
```

2. `.env` file edit pannunga with your MySQL password:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_NAME=campus_resource_db
DATABASE_USER=root
DATABASE_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

## Step 4: Django Migrations Run Pannunga

```bash
python manage.py makemigrations
python manage.py migrate
```

## Step 5: Superuser Create Pannunga

```bash
python manage.py createsuperuser
```

## Step 6: Server Start Pannunga

```bash
python manage.py runserver
```

## Verification

MySQL Workbench la check pannunga:
```sql
USE campus_resource_db;
SHOW TABLES;
```

Tables create aairukanum:
- bookings_user
- bookings_eventbooking
- bookings_bookingapproval
- auth_* tables
- django_* tables

## Common Issues

### Issue 1: mysqlclient install aagala
**Solution:**
```bash
pip install pymysql
```

### Issue 2: Access denied for user 'root'
**Solution:** 
- MySQL Workbench la correct password check pannunga
- `.env` file la correct password update pannunga

### Issue 3: Database connection error
**Solution:**
- MySQL service running ah check pannunga
- Port 3306 correct ah irukka check pannunga

## Database Created Successfully! ✅

Ipo neenga ready to use the backend!
