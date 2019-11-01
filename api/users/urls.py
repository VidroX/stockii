from django.urls import path, include

from api.users import views

urlpatterns = [
    path('<int:user_id>/', views.get_user_data_api, name='users_get_current'),
]
