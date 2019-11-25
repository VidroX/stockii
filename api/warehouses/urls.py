from django.urls import path, include
from api.warehouses import views

urlpatterns = [
    path('', views.WarehousesListView.as_view(), name='warehouses_list'),
    path('<int:warehouse_id>/', views.delete_warehouse, name='warehouse_delete')
]
