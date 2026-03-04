import re
from django.core.exceptions import ValidationError


def validate_no_special_characters(value):
    """Only allow letters, numbers, and spaces"""
    if not re.match(r'^[a-zA-Z0-9\s]+$', value):
        raise ValidationError(
            'Special characters are not allowed. Only letters, numbers, and spaces.'
        )


def validate_name_length(value):
    """Name should be between 3-50 characters"""
    if len(value) < 3:
        raise ValidationError('Name must be at least 3 characters long.')
    if len(value) > 50:
        raise ValidationError('Name cannot exceed 50 characters.')


def validate_phone_number(value):
    """Phone must be exactly 10 digits"""
    if not re.match(r'^\d{10}$', value):
        raise ValidationError('Phone number must be exactly 10 digits.')


def validate_email_format(value):
    """Basic email validation"""
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
        raise ValidationError('Invalid email format.')
