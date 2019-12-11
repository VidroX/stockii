from datetime import datetime

from django.shortcuts import get_object_or_404
from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.statuses import STATUS_CODE
from api.triggers.serializers import TriggerPolymorphicSerializer, TriggerCreatePolymorphicSerializer
from triggers.models import Trigger
from tasks import restock_product, move_product


class TriggersListView(generics.ListCreateAPIView):
    serializer_class = TriggerPolymorphicSerializer
    permission_classes = [IsAuthenticated]
    queryset = Trigger.objects.all()
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = [
        'id',
        'created_by',
        'product',
        'name',
        'polymorphic_ctype',
        'creation_date',
        'activation_date',
        'status'
    ]
    search_fields = [
        'product__name',
        'name',
        'created_by__email',
        'created_by__first_name',
        'created_by__last_name',
        'created_by__patronymic',
        'creation_date',
        'activation_date'
    ]

    def post(self, request, *args, **kwargs):
        create_serializer = TriggerCreatePolymorphicSerializer(data=request.data)
        if create_serializer.is_valid():
            user = self.request.user
            if user:
                instance = create_serializer.save(created_by=user)
            else:
                instance = create_serializer.save(created_by=1)
            retrive_serializer = TriggerPolymorphicSerializer(instance)
            trigger_id = int(retrive_serializer.data.get('id', 0))
            product = retrive_serializer.data.get('product', None)
            trigger_type = retrive_serializer.data.get('resourcetype', None)
            trigger_activation_date = retrive_serializer.data.get('activation_date', None)

            if trigger_activation_date is not None and trigger_type is not None and product is not None:
                date = datetime.strptime(trigger_activation_date, "%Y-%m-%d")
                product_id = int(product.get('id', 0))

                if product_id > 0 and trigger_type == 'RestockTrigger':
                    quantity = int(retrive_serializer.data.get('quantity', 0))

                    if quantity > 0:
                        if date.date() == datetime.today().date():
                            restock_product(trigger_id, product_id, quantity)
                        else:
                            restock_product(trigger_id, product_id, quantity, schedule=date)
                    print("Trigger created")
                elif product_id > 0 and trigger_type == 'MoveTrigger':
                    from_warehouse = int(retrive_serializer.data.get('from_warehouse', 0))
                    to_warehouse = int(retrive_serializer.data.get('to_warehouse', 0))

                    if from_warehouse > 0 and to_warehouse > 0:
                        if date.date() == datetime.today().date():
                            move_product(trigger_id, product_id, from_warehouse, to_warehouse)
                        else:
                            move_product(trigger_id, product_id, from_warehouse, to_warehouse, schedule=date)
                    print("Trigger created")

            return Response(retrive_serializer.data, status=status.HTTP_201_CREATED)
        return Response(create_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        user = self.request.user
        if user:
            serializer.save(created_by=user)
        else:
            serializer.save(created_by=1)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Trigger.objects.all()

        try:
            return Trigger.objects.filter(created_by=user)
        except Trigger.DoesNotExist:
            return Trigger.objects.none()


@api_view(['DELETE', 'PUT', 'GET'])
@permission_classes([IsAuthenticated])
def change_trigger(request, trigger_id):
    if trigger_id is not None and trigger_id > 0:
        user = request.user
        if request.method == "DELETE":
            trigger = get_object_or_404(Trigger, id=trigger_id)
            if user.is_superuser or trigger.created_by == user:
                if trigger.delete():
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
                    'status': 31,
                    'message': STATUS_CODE[31]
                })
                response.status_code = 405
                return response
        elif request.method == "GET":
            trigger = get_object_or_404(Trigger, id=trigger_id)
            if user.is_superuser or trigger.created_by == user:
                serialized = TriggerPolymorphicSerializer(trigger)
                if serialized is not None:
                    return Response({
                        'status': 12,
                        'message': STATUS_CODE[12],
                        'data': {
                            'trigger': serialized.data
                        }
                    })
                else:
                    return Response({
                        'status': 9,
                        'message': STATUS_CODE[9]
                    })
            else:
                response = Response({
                    'status': 32,
                    'message': STATUS_CODE[32]
                })
                response.status_code = 405
                return response
        elif request.method == "PUT":
            trigger = get_object_or_404(Trigger, id=trigger_id)

            if user.is_superuser or trigger.created_by == user:
                status = int(request.data.get('status', 1))

                if status > 2 or status < 1:
                    return Response({
                        'status': 27,
                        'message': STATUS_CODE[27]
                    })

                trigger.status = status
                trigger.save()

                return Response({
                    'status': 12,
                    'message': STATUS_CODE[12]
                })
            else:
                response = Response({
                    'status': 31,
                    'message': STATUS_CODE[31]
                })
                response.status_code = 405
                return response
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

