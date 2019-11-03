from django.urls import path, include
from api.warehouses import views

urlpatterns = [
    path('', views.WarehousesListView.as_view(), name='warehouses_list'),
    # path('<int:user_id>/', views.get_user_data_api, name='users_get_current'),
]
