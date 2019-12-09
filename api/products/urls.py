from django.urls import path, include
from api.products import views

urlpatterns = [
    path('', views.ProductsListView.as_view(), name='products_list'),
    path('<int:product_id>/', views.change_product, name='products_change'),
    path('limit/<int:product_id>/', views.set_product_limit, name='products_limit_change'),
    path('refill/<int:product_id>/', views.refill_product, name='products_refill')
]
