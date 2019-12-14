from django.shortcuts import get_object_or_404
from rest_framework import generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from api.permissions import SuperUserCreateOnly
from api.providers.serializers import ProvidersSerializer
from api.statuses import STATUS_CODE
from shipments.models import Provider


class ProvidersListView(generics.ListCreateAPIView):
    serializer_class = ProvidersSerializer
    permission_classes = [IsAuthenticated, SuperUserCreateOnly]
    queryset = Provider.objects.all()
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['id', 'name', 'working_from', 'working_to', 'weekends', 'average_delivery_time', 'phone']
    search_fields = ['name', 'working_from', 'working_to', 'phone']


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_provider(request, provider_id):
    if provider_id is not None and provider_id > 0:
        user = request.user
        if not user.is_superuser:
            return Response({
                'status': 16,
                'message': STATUS_CODE[16]
            })

        if request.method == "DELETE":
            provider = get_object_or_404(Provider, id=provider_id)
            if provider.delete():
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

