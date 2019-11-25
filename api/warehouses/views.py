from django.contrib.auth import get_user_model
from rest_framework import generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from api.permissions import SuperUserCreateOnly
from api.statuses import STATUS_CODE
from api.users.views import get_user_data
from api.warehouses.serializers import WarehousesSerializer
from warehouses.models import Warehouse, WarehouseAccess
from rest_framework.response import Response


class WarehousesListView(generics.ListCreateAPIView):
    serializer_class = WarehousesSerializer
    permission_classes = [IsAuthenticated, SuperUserCreateOnly]
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['id', 'location', 'working_from', 'working_to', 'weekends', 'phone']
    search_fields = ['location', 'working_from', 'working_to', 'phone']

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Warehouse.objects.all()

        try:
            return Warehouse.objects.filter(warehouseaccess__user=user)
        except Warehouse.DoesNotExist or WarehouseAccess.DoesNotExist:
            return Warehouse.objects.none()


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def change_warehouse_access(request, user_id, warehouse_id):
    if user_id is not None and user_id > 0 and warehouse_id is not None and warehouse_id > 0:
        user = request.user
        if not user.is_superuser:
            return Response({
                'status': 16,
                'message': STATUS_CODE[16]
            })

        remote_user = get_object_or_404(get_user_model(), id=user_id)

        if remote_user is None:
            return Response({
                'status': 17,
                'message': STATUS_CODE[17]
            })

        if request.method == "POST":
            warehouse = get_object_or_404(Warehouse, id=warehouse_id)
            serialized_warehouse = WarehousesSerializer(warehouse)

            warehouse_access = WarehouseAccess.objects.get_or_create(
                defaults={
                    "user": remote_user,
                    "warehouse": warehouse
                },
                user=remote_user,
                warehouse=warehouse
            )

            if serialized_warehouse is not None and warehouse_access is not None:
                return Response({
                    'status': 15,
                    'message': STATUS_CODE[15],
                    'data': {
                        'user': get_user_data(remote_user),
                        'warehouse': serialized_warehouse.data
                    }
                })
            else:
                return Response({
                    'status': 9,
                    'message': STATUS_CODE[9]
                })
        elif request.method == "DELETE":
            warehouse_access = get_object_or_404(WarehouseAccess, user=remote_user)
            if warehouse_access.delete():
                return Response({
                    'status': 18,
                    'message': STATUS_CODE[18]
                })
            else:
                return Response({
                    'status': 19,
                    'message': STATUS_CODE[19]
                })
        else:
            response = Response({
                        'status': 20,
                        'message': STATUS_CODE[20]
                    })
            response.status_code = 405
            return response

    else:
        return Response({
            'status': 13,
            'message': STATUS_CODE[13]
        })


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_warehouse(request, warehouse_id):
    if warehouse_id is not None and warehouse_id > 0:
        if request.method == "DELETE":
            warehouse = get_object_or_404(Warehouse, id=warehouse_id)
            if warehouse.delete():
                return Response({
                    'status': 12,
                    'message': STATUS_CODE[12]
                })
            else:
                return Response({
                    'status': 9,
                    'message': STATUS_CODE[9]
                })
        else:
            response = Response({
                        'status': 20,
                        'message': STATUS_CODE[20]
                    })
            response.status_code = 405
            return response
    else:
        return Response({
            'status': 21,
            'message': STATUS_CODE[21]
        })
