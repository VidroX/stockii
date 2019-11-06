from django.urls import path, include
from api.triggers import views

urlpatterns = [
    path('', views.TriggersListView.as_view(), name='triggers_list'),
    path('<int:trigger_id>/', views.change_trigger, name='triggers_change')
]
