from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.statuses import STATUS_CODE
from api.triggers.serializers import TriggerSerializer
from triggers.models import Trigger


class TriggersListView(generics.ListCreateAPIView):
    serializer_class = TriggerSerializer
    permission_classes = [IsAuthenticated]
    queryset = Trigger.objects.all()


@api_view(['DELETE', 'PUT', 'GET'])
@permission_classes([IsAuthenticated])
def change_trigger(request, trigger_id):
    if trigger_id is not None and trigger_id > 0:
        if request.method == "DELETE":
            trigger = get_object_or_404(Trigger, id=trigger_id)
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
        elif request.method == "GET":
            trigger = get_object_or_404(Trigger, id=trigger_id)
            serialized = TriggerSerializer(trigger)
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
        elif request.method == "PUT":
            trigger = get_object_or_404(Trigger, id=trigger_id)

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

