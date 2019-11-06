from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.shipments.serializers import ShipmentsSerializer
from api.statuses import STATUS_CODE
from shipments.models import Shipment


class ShipmentsListView(generics.ListCreateAPIView):
    serializer_class = ShipmentsSerializer
    permission_classes = [IsAuthenticated]
    queryset = Shipment.objects.all()


@api_view(['DELETE', 'PUT', 'GET'])
@permission_classes([IsAuthenticated])
def change_shipment(request, shipment_id):
    if shipment_id is not None and shipment_id > 0:
        if request.method == "DELETE":
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

