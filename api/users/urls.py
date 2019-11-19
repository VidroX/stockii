from django.urls import path, include

from api.users import views
from api.warehouses import views as warehouses_views

urlpatterns = [
    path('', views.UsersListView.as_view(), name='users_get_all'),
    path('<int:user_id>/', views.get_user_data_api, name='users_get_current'),
    path('<int:user_id>/warehouses/<int:warehouse_id>/', warehouses_views.change_warehouse_access, name='warehouses_change_access'),
]
