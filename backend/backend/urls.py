from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, frontend_index
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # User registration & JWT
    path('api/user/register', CreateUserView.as_view(), name="register"),
    path('api/token/', TokenObtainPairView.as_view(), name="get_token"),
    path('api/refresh', TokenRefreshView.as_view(), name="refresh"),

    # Browsable API login
    path('api-auth/', include('rest_framework.urls')),

    # API endpoints
    path('api/', include('api.urls')),

    # Serve React frontend
]
