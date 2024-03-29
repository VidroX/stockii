from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from accounts.models import User
from accounts.serializers import UserSerializer
from api.permissions import SuperUserDeleteOnly
from api.statuses import STATUS_CODE
from api.tokens import get_token_from_header, check_token


def get_user_data(validated_data, full=False):
    if full:
        return {
            'id': validated_data.id,
            'email': validated_data.email,
            'mobile_phone': validated_data.mobile_phone,
            'last_name': validated_data.last_name,
            'first_name': validated_data.first_name,
            'patronymic': validated_data.patronymic,
            'birthday': validated_data.birthday,
            'is_superuser': validated_data.is_superuser,
            'is_active': validated_data.is_active,
            'date_joined': validated_data.date_joined
        }
    else:
        return {
            'id': validated_data.id,
            'first_name': validated_data.first_name,
            'last_name': validated_data.last_name,
            'is_superuser': validated_data.is_superuser,
            'is_active': validated_data.is_active
        }


@api_view(['POST', 'DELETE'])
@permission_classes([SuperUserDeleteOnly])
def change_user_data(request, user_id):
    token = get_token_from_header(request.headers)

    if user_id is not None and user_id > 0:
        if request.method == "POST":
            user = request.user
            if not user.is_superuser:
                is_valid = check_token(user.id, token)
            else:
                is_valid = True

            if is_valid:
                return Response({
                    'status': 12,
                    'message': STATUS_CODE[12],
                    'data': {
                        'user': get_user_data(get_user_model().objects.get(id=user_id))
                    }
                })
            else:
                return Response({
                    'status': 14,
                    'message': STATUS_CODE[14]
                })
        elif request.method == "DELETE":
            user = get_object_or_404(User, id=user_id)
            if user.delete():
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
            'status': 13,
            'message': STATUS_CODE[13]
        })


class UsersListView(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['id', 'last_name', 'first_name', 'patronymic', 'email']
    search_fields = ['id', 'last_name', 'first_name', 'patronymic', 'email']
