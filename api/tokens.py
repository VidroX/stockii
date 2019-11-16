import requests
from django.contrib.auth import get_user_model
from oauth2_provider.admin import AccessToken
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from api.statuses import STATUS_CODE
from stocked.settings import CONFIG, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET


def get_access_token(request):
    if request.data is None:
        raise ValidationError('Please provide request data')

    token_endpoint = CONFIG['oauth']['serverUrl'] + 'token/'

    data = {
        'grant_type': 'password',
        'username': request.data['email'],
        'password': request.data['password'],
        'client_id': OAUTH_CLIENT_ID,
        'client_secret': OAUTH_CLIENT_SECRET,
    }

    return requests.post(url=token_endpoint, data=data)


def get_token_from_header(headers):
    if not headers or not headers.get('Authorization'):
        return Response({
            'status': 7,
            'message': STATUS_CODE[7]
        })

    try:
        token = headers.get('Authorization').split(' ')[1]
        return token
    except:
        return Response({
            'status': 7,
            'message': STATUS_CODE[7]
        })


# Check if token is valid for user
def check_token(user_id, token):
    user = get_user_model().objects.get(id=user_id)
    token_info = AccessToken.objects.get(token=token).user

    if user and token_info:
        if user == token_info:
            return True
        else:
            return False
    else:
        return False
