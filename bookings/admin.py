from django.contrib import admin
from .models import User, Resource, Booking

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'role', 'status', 'createdAt')
    list_filter = ('role', 'status')
    search_fields = ('name', 'email')

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'capacity', 'status')
    list_filter = ('type', 'status')
    search_fields = ('name',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'userId', 'resourceId', 'bookingDate', 'timeSlot', 'status')
    list_filter = ('status', 'bookingDate')
    search_fields = ('userId__name', 'resourceId__name')
