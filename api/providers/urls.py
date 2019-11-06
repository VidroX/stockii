from django.urls import path, include
from api.providers import views

urlpatterns = [
    path('', views.ProvidersListView.as_view(), name='providers_list'),
    path('<int:provider_id>/', views.delete_provider, name='providers_delete')
]
