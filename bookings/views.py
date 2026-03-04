from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from .models import User, Resource, Booking
from .serializers import UserSerializer, ResourceSerializer, BookingSerializer, LoginSerializer


# Login View
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data.get('email')
        phone = serializer.validated_data.get('phone')
        password = serializer.validated_data.get('password')
        
        user = None
        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({
                    "error": "Invalid credentials"
                }, status=status.HTTP_401_UNAUTHORIZED)
        elif phone:
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                return Response({
                    "error": "Invalid credentials"
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check account status
        if user.status == 'PENDING_STAFF':
            return Response({
                "error": "Your account is pending staff approval. Please wait."
            }, status=status.HTTP_403_FORBIDDEN)
        
        if user.status == 'PENDING_ADMIN':
            return Response({
                "error": "Your account is pending admin approval. Please wait."
            }, status=status.HTTP_403_FORBIDDEN)
        
        if user.status == 'REJECTED':
            return Response({
                "error": f"Your account was rejected. Reason: {user.rejection_reason or 'Not specified'}"
            }, status=status.HTTP_403_FORBIDDEN)
        
        if user.status == 'INACTIVE':
            return Response({
                "error": "Your account is inactive. Contact admin."
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check if account is locked
        if user.is_account_locked():
            remaining_time = (user.account_locked_until - timezone.now()).seconds // 60
            return Response({
                "error": f"Account locked. Try again after {remaining_time} minutes.",
                "try_another_way": "You can try logging in with phone number instead of email"
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check password
        if check_password(password, user.password):
            user.reset_failed_attempts()
            return Response({
                "message": "Login successful",
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        else:
            user.increment_failed_attempts()
            remaining_attempts = 3 - user.failed_login_attempts
            
            if remaining_attempts <= 0:
                return Response({
                    "error": "Too many failed attempts. Account locked for 15 minutes.",
                    "try_another_way": "Try logging in with phone number"
                }, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                    "error": "Invalid credentials",
                    "remaining_attempts": remaining_attempts,
                    "message": f"{remaining_attempts} attempt(s) remaining"
                }, status=status.HTTP_401_UNAUTHORIZED)


# Module 1: User Management APIs
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = User.objects.all()
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter.upper())
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def staff_review(self, request, pk=None):
        """Staff reviews student registration"""
        user = self.get_object()
        
        if user.status != 'PENDING_STAFF':
            return Response({
                "error": "User is not pending staff approval"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        action_type = request.data.get('action')  # 'approve' or 'reject'
        reason = request.data.get('reason', '')
        
        if action_type == 'approve':
            user.status = 'PENDING_ADMIN'
            user.save()
            return Response({
                "message": "User approved by staff. Sent to admin for final approval.",
                "user": UserSerializer(user).data
            })
        elif action_type == 'reject':
            if not reason:
                return Response({
                    "error": "Reason is required for rejection"
                }, status=status.HTTP_400_BAD_REQUEST)
            user.status = 'REJECTED'
            user.rejection_reason = reason
            user.save()
            return Response({
                "message": "User rejected by staff",
                "user": UserSerializer(user).data
            })
        else:
            return Response({
                "error": "Action must be 'approve' or 'reject'"
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def admin_review(self, request, pk=None):
        """Admin gives final approval"""
        user = self.get_object()
        
        if user.status != 'PENDING_ADMIN':
            return Response({
                "error": "User is not pending admin approval"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        action_type = request.data.get('action')
        reason = request.data.get('reason', '')
        
        if action_type == 'approve':
            user.status = 'ACTIVE'
            user.save()
            return Response({
                "message": "User approved by admin. Account is now active.",
                "user": UserSerializer(user).data
            })
        elif action_type == 'reject':
            if not reason:
                return Response({
                    "error": "Reason is required for rejection"
                }, status=status.HTTP_400_BAD_REQUEST)
            user.status = 'REJECTED'
            user.rejection_reason = reason
            user.save()
            return Response({
                "message": "User rejected by admin",
                "user": UserSerializer(user).data
            })
        else:
            return Response({
                "error": "Action must be 'approve' or 'reject'"
            }, status=status.HTTP_400_BAD_REQUEST)


# Module 2: Resource Management APIs
class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [AllowAny]


# Module 3: Booking Module APIs
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        """Update booking status (approve/reject)"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
