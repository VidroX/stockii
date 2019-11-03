from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from api.permissions import SuperUserCreateOnly
from api.warehouses.serializers import WarehousesSerializer
from warehouses.models import Warehouse, WarehouseAccess


class WarehousesListView(generics.ListCreateAPIView):
    serializer_class = WarehousesSerializer
    permission_classes = [IsAuthenticated, SuperUserCreateOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Warehouse.objects.all()

        try:
            return Warehouse.objects.filter(warehouseaccess__user=user)
        except Warehouse.DoesNotExist or WarehouseAccess.DoesNotExist:
            return Warehouse.objects.none()
