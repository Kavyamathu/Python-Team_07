from rest_framework import serializers
from .models import User, Resource, Booking
from django.contrib.auth.hashers import make_password


# Module 1: User Management Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, max_length=20)
    
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'country_code', 'phone', 'state', 'district', 'country', 'password', 'role', 'status', 'createdAt')
        read_only_fields = ('id', 'createdAt')
        extra_kwargs = {
            'password': {'write_only': True},
            'state': {'required': False},
            'district': {'required': False}
        }
    
    def validate_password(self, value):
        """Password validation - no special chars, 6-20 length"""
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters.")
        if len(value) > 20:
            raise serializers.ValidationError("Password cannot exceed 20 characters.")
        return value
    
    def create(self, validated_data):
        # Hash password before saving
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


# Login Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(required=True)
    
    def validate(self, data):
        email = data.get('email')
        phone = data.get('phone')
        
        if not email and not phone:
            raise serializers.ValidationError({
                "error": "Either email or phone is required for login"
            })
        
        return data


# Module 2: Resource Management Serializer
class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ('id', 'name', 'type', 'capacity', 'status')
        read_only_fields = ('id',)


# Module 3: Booking Module Serializer
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ('id', 'userId', 'resourceId', 'bookingDate', 'timeSlot', 'status', 'rejection_reason')
        read_only_fields = ('id',)

    def create(self, validated_data):
        booking = Booking(**validated_data)
        # Business Rule: Check for double booking
        if booking.check_double_booking():
            raise serializers.ValidationError({
                "error": "Resource already booked for this date and time slot"
            })
        booking.save()
        return booking
    
    def update(self, instance, validated_data):
        """Allow status and rejection_reason updates"""
        instance.status = validated_data.get('status', instance.status)
        instance.rejection_reason = validated_data.get('rejection_reason', instance.rejection_reason)
        instance.save()
        return instance
