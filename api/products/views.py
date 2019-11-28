from django.shortcuts import get_object_or_404
from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from api.products.serializers import ProductSerializer, ProductCreateSerializer
from api.statuses import STATUS_CODE
from products.models import Product, ProductLimit
from warehouses.models import WarehouseAccess, Warehouse


class ProductsListView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['id', 'name', 'warehouse', 'quantity']
    search_fields = ['name', 'warehouse__location']

    def post(self, request, *args, **kwargs):
        create_serializer = ProductCreateSerializer(data=request.data)
        if create_serializer.is_valid():
            instance = create_serializer.save()
            retrive_serializer = ProductSerializer(instance)
            return Response(retrive_serializer.data, status=status.HTTP_201_CREATED)
        return Response(create_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Product.objects.all()

        warehouses = Warehouse.objects.filter(warehouseaccess__user=user)

        try:
            return Product.objects.filter(warehouse__in=warehouses)
        except Product.DoesNotExist or Warehouse.DoesNotExist or WarehouseAccess.DoesNotExist:
            return Product.objects.none()


@api_view(['DELETE', 'PUT', 'GET'])
@permission_classes([IsAuthenticated])
def change_product(request, product_id):
    if product_id is not None and product_id > 0:
        if request.method == "DELETE":
            product = get_object_or_404(Product, id=product_id)
            if product.delete():
                return Response({
                    'status': 12,
                    'message': STATUS_CODE[12]
                })
            else:
                return Response({
                    'status': 9,
                    'message': STATUS_CODE[9]
                })
        elif request.method == "GET":
            product = get_object_or_404(Product, id=product_id)
            serialized = ProductSerializer(product)
            if serialized is not None:
                return Response({
                    'status': 12,
                    'message': STATUS_CODE[12],
                    'data': {
                        'product': serialized.data
                    }
                })
            else:
                return Response({
                    'status': 9,
                    'message': STATUS_CODE[9]
                })
        elif request.method == "PUT":
            product = get_object_or_404(Product, id=product_id)

            try:
                product_limit = ProductLimit.objects.get(product=product)
            except ProductLimit.DoesNotExist:
                product_limit = None

            quantity = int(request.data.get('quantity', 0))
            warehouse = request.data.get('warehouse', None)

            if product_limit is not None:
                if quantity < product_limit.min_amount:
                    return Response({
                        'status': 22,
                        'message': STATUS_CODE[22]
                    })
                if quantity > product_limit.max_amount:
                    return Response({
                        'status': 23,
                        'message': STATUS_CODE[23]
                    })

            product.quantity = quantity
            if warehouse is not None and int(warehouse) > 0:
                product.warehouse_id = int(warehouse)
            product.save()

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


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def set_product_limit(request, product_id):
    if product_id is not None and product_id > 0:
        if request.method == "PUT":
            product = get_object_or_404(Product, id=product_id)

            min_amount = int(request.data.get('min_amount', 0))
            max_amount = int(request.data.get('max_amount', 0))

            if min_amount >= max_amount:
                return Response({
                    'status': 26,
                    'message': STATUS_CODE[26]
                })

            try:
                product_limit = ProductLimit.objects.get(product=product)
            except ProductLimit.DoesNotExist:
                product_limit = ProductLimit(product=product, min_amount=min_amount, max_amount=max_amount)
                if product_limit.min_amount > product.quantity:
                    return Response({
                        'status': 24,
                        'message': STATUS_CODE[24]
                    })
                if product_limit.max_amount < product.quantity:
                    return Response({
                        'status': 25,
                        'message': STATUS_CODE[25]
                    })
                product_limit.save()

            if product.quantity < min_amount:
                return Response({
                    'status': 22,
                    'message': STATUS_CODE[22]
                })
            if product.quantity > max_amount:
                return Response({
                    'status': 23,
                    'message': STATUS_CODE[23]
                })

            product_limit.min_amount = min_amount
            product_limit.max_amount = max_amount
            product_limit.save()

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
