from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
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
            'is_superuser': validated_data.is_superuser,
            'is_active': validated_data.is_active
        }


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_user_data_api(request, user_id):
    token = get_token_from_header(request.headers)

    if user_id is not None and user_id > 0:
        is_valid = check_token(user_id, token)
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
    else:
        return Response({
            'status': 13,
            'message': STATUS_CODE[13]
        })
