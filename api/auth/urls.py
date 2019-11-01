from django.urls import path, include

from api.auth import views

urlpatterns = [
    path('login/', views.login, name='auth_login'),
    path('register/', views.register, name='auth_register'),
    path('token/refresh/', views.refresh_token, name='auth_token_refresh'),
    path('logout/', views.logout, name='auth_token_revoke'),
]
