from django.urls import path, include

urlpatterns = [
    path('auth/', include('api.auth.urls')),
    path('users/', include('api.users.urls')),
    path('warehouses/', include('api.warehouses.urls')),
]
