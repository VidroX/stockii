from rest_framework import serializers

from accounts.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'email',
            'mobile_phone',
            'first_name',
            'last_name',
            'patronymic',
            'password'
            'birthday',
            'date_joined',
            'is_superuser',
            'is_active'
        ]
        write_only_fields = ('password',)

    def create(self, validated_data):
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
