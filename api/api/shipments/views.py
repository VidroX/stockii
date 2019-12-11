from django.shortcuts import get_object_or_404
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.shipments.serializers import ShipmentsSerializer, ShipmentsCreateSerializer
from api.statuses import STATUS_CODE
from products.models import Product
from shipments.models import Shipment
from warehouses.models import Warehouse, WarehouseAccess


class ShipmentsListView(generics.ListCreateAPIView):
    serializer_class = ShipmentsSerializer
    permission_classes = [IsAuthenticated]
    queryset = Shipment.objects.all()
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = [
        'id',
        'product',
        'provider',
        'product__warehouse__location',
        'quantity',
        'start_date',
        'approximate_delivery',
        'status'
    ]
    search_fields = ['product__name', 'provider__name', 'product__warehouse__location', 'quantity']

    def post(self, request, *args, **kwargs):
        create_serializer = ShipmentsCreateSerializer(data=request.data)

        if create_serializer.is_valid():
            validated_data = create_serializer.validated_data
            product = validated_data.get('product', None)
            if product is not None:
                shipments = Shipment.objects.filter(product=product)
                new_quantity = validated_data.get('quantity', 0) + product.quantity
                for shipment in shipments:
                    if shipment.status == 1:
                        new_quantity += shipment.quantity

                if hasattr(product, 'limit') and product.limit is not None and\
                        new_quantity <= product.limit.max_amount:
                    instance = create_serializer.save()
                    retrive_serializer = ShipmentsSerializer(instance)
                    return Response(retrive_serializer.data, status=status.HTTP_201_CREATED)
                else:
                    if hasattr(product, 'limit') and product.limit is not None:
                        return Response({
                            'status': 28,
                            'message': STATUS_CODE[28]
                        })
                    else:
                        instance = create_serializer.save()
                        retrive_serializer = ShipmentsSerializer(instance)
                        return Response(retrive_serializer.data, status=status.HTTP_201_CREATED)

        return Response(create_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Shipment.objects.all()

        warehouses = Warehouse.objects.filter(warehouseaccess__user=user)

        try:
            return Shipment.objects.filter(product__warehouse__in=warehouses)
        except Shipment.DoesNotExist or Warehouse.DoesNotExist or WarehouseAccess.DoesNotExist:
            return Shipment.objects.none()


@api_view(['DELETE', 'PUT', 'GET'])
@permission_classes([IsAuthenticated])
def change_shipment(request, shipment_id):
    if shipment_id is not None and shipment_id > 0:
        if request.method == "DELETE":
            if request.user is not None and request.user.is_superuser:
                shipment = get_object_or_404(Shipment, id=shipment_id)
                if shipment.delete():
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
                return Response({
                    'status': 16,
                    'message': STATUS_CODE[16]
                })
        elif request.method == "GET":
            shipment = get_object_or_404(Shipment, id=shipment_id)
            serialized = ShipmentsSerializer(shipment)
            if serialized is not None:
                return Response({
                    'status': 12,
                    'message': STATUS_CODE[12],
                    'data': {
                        'shipment': serialized.data
                    }
                })
            else:
                return Response({
                    'status': 9,
                    'message': STATUS_CODE[9]
                })
        elif request.method == "PUT":
            shipment = get_object_or_404(Shipment, id=shipment_id)

            status = int(request.data.get('status', 1))

            if status > 2 or status < 1:
                return Response({
                    'status': 27,
                    'message': STATUS_CODE[27]
                })

            if status == 2:
                shipment.product.quantity += shipment.quantity
                shipment.product.save()
            elif status == 1:
                if shipment.status == 2:
                    new_quantity = shipment.product.quantity - shipment.quantity
                    if new_quantity >= 0:
                        shipment.product.quantity = new_quantity
                    else:
                        shipment.product.quantity = 0
                    shipment.product.save()

            shipment.status = status
            shipment.save()

            return Response({
                'status': 12,
                'message': STATUS_CODE[12]
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

