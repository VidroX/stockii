from django.urls import path, include
from api.shipments import views

urlpatterns = [
    path('', views.ShipmentsListView.as_view(), name='shipments_list'),
    path('<int:shipment_id>/', views.change_shipment, name='shipments_change')
]
