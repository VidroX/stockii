import time

import requests

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from api.auth.serializers import LoginSerializer, RegisterSerializer
from api.cookies import cookie_date
from api.statuses import STATUS_CODE
from api.users.views import get_user_data
from stocked.settings import CONFIG, TOKEN_HTTP_ONLY, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET

from api.tokens import get_token_from_header, get_access_token


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        r = get_access_token(request)
        return_token = request.data.get('return_token', False)
        full_user_data = request.data.get('full_user_data', False)

        if user:
            if r:
                json = r.json()
                expiry_time = str(cookie_date(json['expires_in']))

                if return_token:
                    data = {
                        'user': get_user_data(user, full_user_data),
                        'token': json['access_token'],
                        'token_expiry': expiry_time
                    }
                else:
                    data = {
                        'user': get_user_data(user, full_user_data),
                        'token_expiry': expiry_time
                    }

                response = Response({
                    'status': 0,
                    'message': STATUS_CODE[0],
                    'data': data
                })

                if not return_token:
                    response.set_cookie(
                        'token',
                        json['access_token'],
                        secure=request.is_secure(),
                        httponly=TOKEN_HTTP_ONLY,
                        samesite='Lax',
                        expires=expiry_time
                    )

                return response

            else:
                return Response({
                    'status_code': 1,
                    'message': STATUS_CODE[1]
                })
        else:
            return Response({
                'status_code': 11,
                'message': STATUS_CODE[11],
                'data': user
            })

    return Response({
        'status_code': 11,
        'message': STATUS_CODE[11],
        'data': serializer.errors
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        r = get_access_token(request)
        return_token = request.data.get('return_token', False)
        full_user_data = request.data.get('full_user_data', False)

        if r:
            json = r.json()
            expiry_time = str(cookie_date(json['expires_in']))

            if return_token:
                data = {
                    'user': get_user_data(serializer.validated_data, full_user_data),
                    'token': json['access_token'],
                    'token_expiry': expiry_time
                }
            else:
                data = {
                    'user': get_user_data(serializer.validated_data, full_user_data),
                    'token_expiry': expiry_time
                }

            response = Response({
                'status': 2,
                'message': STATUS_CODE[2],
                'data': data
            })

            if not return_token:
                response.set_cookie(
                    'token',
                    json['access_token'],
                    secure=request.is_secure(),
                    httponly=TOKEN_HTTP_ONLY,
                    samesite='Lax',
                    expires=expiry_time
                )

            return response
        else:
            response = Response({
                'status_code': 4,
                'message': STATUS_CODE[4]
            })

            return response

    response = Response({
        'status_code': 10,
        'message': STATUS_CODE[10],
        'data': serializer.errors
    })

    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_token(request):
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': request.data['refresh_token'],
        'client_id': OAUTH_CLIENT_ID,
        'client_secret': OAUTH_CLIENT_SECRET,
    }

    r = requests.post(CONFIG['oauth']['serverUrl'] + 'token/', data=data)
    if r:
        json = r.json()
        expiry_time = str(cookie_date(json['expires_in']))
        return_token = request.data.get('return_token', False)

        data = None

        if return_token:
            data = {
                'token': json['access_token'],
                'token_expiry': expiry_time
            }

        response = Response({
            'status': 5,
            'message': STATUS_CODE[5],
            'data': data
        })

        if not return_token:
            response.set_cookie(
                'token',
                json['access_token'],
                secure=request.is_secure(),
                httponly=TOKEN_HTTP_ONLY,
                samesite='Lax',
                expires=expiry_time
            )

        return response
    else:
        response = Response({
            'status_code': 6,
            'message': STATUS_CODE[6]
        })

        return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    token = get_token_from_header(request.headers)

    data = {
        'token': token,
        'client_id': OAUTH_CLIENT_ID,
        'client_secret': OAUTH_CLIENT_SECRET,
    }

    r = requests.post(CONFIG['oauth']['serverUrl'] + 'revoke_token/', data=data)

    if r.status_code == requests.codes.ok:
        return Response({
            'status': 8,
            'message': STATUS_CODE[8]
        })

    return Response({
        'status': 9,
        'message': STATUS_CODE[9],
        'data': {
            'http_status_code': r.status_code,
            'errors': r.json()
        }
    })
