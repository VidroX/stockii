from django.urls import path, include

urlpatterns = [
    path('auth/', include('api.auth.urls')),
    path('users/', include('api.users.urls')),
    path('warehouses/', include('api.warehouses.urls')),
    path('providers/', include('api.providers.urls')),
    path('products/', include('api.products.urls')),
    path('shipments/', include('api.shipments.urls')),
    path('triggers/', include('api.triggers.urls')),
]
