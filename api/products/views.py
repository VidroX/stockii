import requests
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404
from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from api.products.serializers import ProductSerializer, ProductCreateSerializer
from api.statuses import STATUS_CODE
from api.tokens import get_token_from_header
from products.models import Product, ProductLimit
from shipments.models import Shipment, Provider
from stocked.settings import CONFIG
from warehouses.models import WarehouseAccess, Warehouse


def initiate_stock_refill(token, product, quantity):
    if product is None and (quantity is None or (quantity is not None and int(quantity) < 0)):
        raise ValidationError('Please provide product data and quantity')

    if token is None:
        raise ValidationError('Please provide user and token data')

    endpoint = CONFIG['api']['localUrl'] + 'products/refill/' + str(product.id) + '/'

    data = {
        'quantity': quantity
    }

    return requests.post(url=endpoint, data=data, headers={'Authorization': 'Bearer ' + str(token)})


def refill_stock(token, product, provider, delivery_date, quantity):
    if product is None or provider is None or delivery_date is None or\
            (quantity is None or (quantity is not None and int(quantity) < 0)):
        raise ValidationError('Please provide product, provider, delivery_date and quantity data')

    if token is None:
        raise ValidationError('Please provide user and token data')

    endpoint = CONFIG['api']['localUrl'] + 'shipments/'

    data = {
        'product': product.id,
        'quantity': quantity,
        'provider': provider.id,
        'approximate_delivery': delivery_date.strftime('%Y-%m-%d')
    }

    return requests.post(url=endpoint, data=data, headers={'Authorization': 'Bearer ' + str(token)})


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

            force = request.data.get('force', False)
            quantity = request.data.get('quantity', None)
            warehouse = request.data.get('warehouse', None)
            name = request.data.get('name', None)

            if quantity is not None and int(quantity) < 0:
                return Response({
                    'status': 29,
                    'message': STATUS_CODE[29]
                })

            new_quantity = -1
            if quantity is not None and int(quantity) >= 0:
                shipments = Shipment.objects.filter(product=product)
                new_quantity = int(quantity)
                for shipment in shipments:
                    if shipment.status == 1:
                        new_quantity += shipment.quantity

                try:
                    product_limit = ProductLimit.objects.get(product=product)
                except ProductLimit.DoesNotExist:
                    product_limit = None

                if not force and product_limit is not None and new_quantity >= 0:
                    if new_quantity < product_limit.min_amount:
                        return Response({
                            'status': 22,
                            'message': STATUS_CODE[22]
                        })
                    if new_quantity > product_limit.max_amount:
                        return Response({
                            'status': 23,
                            'message': STATUS_CODE[23]
                        })
                elif force and product_limit is not None and new_quantity < product_limit.min_amount:
                    token = get_token_from_header(request.headers)
                    refill_quantity = product_limit.min_amount - new_quantity
                    initiate_stock_refill(token, product, refill_quantity)

            if name is not None:
                product.name = name
            if quantity is not None and int(quantity) >= 0:
                product.quantity = int(quantity)
            if warehouse is not None and int(warehouse) > 0:
                _warehouse = get_object_or_404(Warehouse, id=warehouse)
                product.warehouse = _warehouse
            if (warehouse is not None and int(warehouse) > 0) or new_quantity >= 0 or name is not None:
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

            if min_amount == 0 and max_amount == 0:
                if hasattr(product, 'limit') and product.limit is not None and\
                        product.limit.id is not None and product.limit.id > 0:
                    product.limit.delete()
                return Response({
                    'status': 12,
                    'message': STATUS_CODE[12]
                })

            if min_amount >= max_amount:
                return Response({
                    'status': 26,
                    'message': STATUS_CODE[26]
                })

            shipments = Shipment.objects.filter(product=product)

            try:
                product_limit = ProductLimit.objects.get(product=product)
            except ProductLimit.DoesNotExist:
                product_limit = ProductLimit(product=product, min_amount=min_amount, max_amount=max_amount)

                new_quantity = product.quantity
                for shipment in shipments:
                    if shipment.status == 1:
                        new_quantity += shipment.quantity

                if product_limit.min_amount > new_quantity:
                    return Response({
                        'status': 24,
                        'message': STATUS_CODE[24]
                    })
                if product_limit.max_amount < new_quantity:
                    return Response({
                        'status': 25,
                        'message': STATUS_CODE[25]
                    })
                product_limit.save()

            new_quantity = product.quantity
            for shipment in shipments:
                if shipment.status == 1:
                    new_quantity += shipment.quantity

            if new_quantity < min_amount:
                return Response({
                    'status': 22,
                    'message': STATUS_CODE[22]
                })
            if new_quantity > max_amount:
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


@api_view(['POST'])
@permission_classes([IsAdminUser])
def refill_product(request, product_id):
    if product_id is not None and product_id > 0:
        if request.method == "POST":
            product = get_object_or_404(Product, id=product_id)
            token = get_token_from_header(request.headers)
            fastest_provider = Provider.objects.order_by(
                'average_delivery_time',
                '-weekends'
            )[0]
            quantity = request.data.get('quantity', 1)

            if quantity is not None and int(quantity) < 1:
                return Response({
                    'status': 29,
                    'message': STATUS_CODE[29]
                })

            today = datetime.now()
            working_to_time = datetime.now().replace(
                hour=fastest_provider.working_to.hour,
                minute=fastest_provider.working_to.minute,
                second=fastest_provider.working_to.second
            )
            is_weekend = working_to_time.weekday() == 6 or working_to_time.weekday() == 7
            is_saturday = working_to_time.weekday() == 6

            additional_days = 0
            estimated = today
            if today > working_to_time:
                additional_days = 1

            if fastest_provider.weekends:
                estimated += timedelta(days=(fastest_provider.average_delivery_time + additional_days))
            else:
                if is_weekend:
                    if today > working_to_time:
                        if is_saturday:
                            additional_days += 1
                    else:
                        additional_days += is_saturday if 2 else 1

                approximate_date = today + timedelta(days=(fastest_provider.average_delivery_time + additional_days))
                if approximate_date.weekday() == 6:
                    approximate_date += timedelta(days=2)
                elif approximate_date.weekday() == 7:
                    approximate_date += timedelta(days=1)

                estimated = approximate_date

            r = refill_stock(token, product, fastest_provider, estimated, quantity)

            if r:
                return Response({
                    'status': 12,
                    'message': STATUS_CODE[12]
                })
            else:
                return Response({
                    'status': 30,
                    'message': STATUS_CODE[30]
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

