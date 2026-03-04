from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from .validators import (
    validate_no_special_characters,
    validate_name_length,
    validate_phone_number,
    validate_email_format
)


# Module 1: User Management
class User(models.Model):
    ROLE_CHOICES = (
        ('STUDENT', 'Student'),
        ('STAFF', 'Staff'),
        ('ADMIN', 'Admin'),
    )
    STATUS_CHOICES = (
        ('PENDING_STAFF', 'Pending Staff Approval'),
        ('PENDING_ADMIN', 'Pending Admin Approval'),
        ('ACTIVE', 'Active'),
        ('REJECTED', 'Rejected'),
        ('INACTIVE', 'Inactive'),
    )
    
    name = models.CharField(
        max_length=50,
        validators=[validate_no_special_characters, validate_name_length]
    )
    email = models.EmailField(
        unique=True,
        validators=[validate_email_format]
    )
    country_code = models.CharField(max_length=5, default='+91')
    phone = models.CharField(
        max_length=10,
        unique=True,
        validators=[validate_phone_number]
    )
    state = models.CharField(max_length=50, blank=True, null=True)
    district = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=50, default='India')
    password = models.CharField(max_length=128, default='password123')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING_STAFF')
    rejection_reason = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    
    # Login attempt tracking
    failed_login_attempts = models.IntegerField(default=0)
    last_failed_login = models.DateTimeField(null=True, blank=True)
    account_locked_until = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.role})"
    
    def is_account_locked(self):
        if self.account_locked_until and timezone.now() < self.account_locked_until:
            return True
        return False
    
    def increment_failed_attempts(self):
        self.failed_login_attempts += 1
        self.last_failed_login = timezone.now()
        
        if self.failed_login_attempts >= 3:
            self.account_locked_until = timezone.now() + timedelta(minutes=15)
        
        self.save()
    
    def reset_failed_attempts(self):
        self.failed_login_attempts = 0
        self.last_failed_login = None
        self.account_locked_until = None
        self.save()


# Module 2: Resource Management
class Resource(models.Model):
    TYPE_CHOICES = (
        ('LAB', 'Lab'),
        ('CLASSROOM', 'Classroom'),
        ('EVENT_HALL', 'Event Hall'),
    )
    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('UNAVAILABLE', 'Unavailable'),
    )
    
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    capacity = models.IntegerField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='AVAILABLE')

    def __str__(self):
        return f"{self.name} ({self.type})"


# Module 3: Booking Module
class Booking(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )
    
    userId = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    resourceId = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='bookings')
    bookingDate = models.DateField()
    timeSlot = models.CharField(max_length=50)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    rejection_reason = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.userId.name} - {self.resourceId.name} on {self.bookingDate}"

    def check_double_booking(self):
        conflicting = Booking.objects.filter(
            resourceId=self.resourceId,
            bookingDate=self.bookingDate,
            timeSlot=self.timeSlot
        ).exclude(id=self.id)
        return conflicting.exists()
