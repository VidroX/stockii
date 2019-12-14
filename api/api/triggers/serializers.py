from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer

from api.products.serializers import ProductCreateSerializer
from triggers.models import Trigger, RestockTrigger, MoveTrigger


class TriggerSerializer(serializers.ModelSerializer):
    product = ProductCreateSerializer(read_only=True)

    class Meta:
        model = Trigger
        extra_kwargs = {
            'created_by': {'read_only': True}
        }
        exclude = ('polymorphic_ctype',)


class RestockTriggerSerializer(TriggerSerializer):
    class Meta:
        model = RestockTrigger
        extra_kwargs = {
            'created_by': {'read_only': True}
        }
        exclude = ('polymorphic_ctype',)


class MoveTriggerSerializer(TriggerSerializer):
    class Meta:
        model = MoveTrigger
        extra_kwargs = {
            'created_by': {'read_only': True}
        }
        exclude = ('polymorphic_ctype',)


class TriggerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trigger
        extra_kwargs = {
            'created_by': {'read_only': True}
        }
        exclude = ('polymorphic_ctype',)


class RestockTriggerCreateSerializer(TriggerCreateSerializer):
    class Meta:
        model = RestockTrigger
        extra_kwargs = {
            'created_by': {'read_only': True}
        }
        exclude = ('polymorphic_ctype',)


class MoveTriggerCreateSerializer(TriggerCreateSerializer):
    class Meta:
        model = MoveTrigger
        extra_kwargs = {
            'created_by': {'read_only': True}
        }
        exclude = ('polymorphic_ctype',)


class TriggerPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Trigger: TriggerSerializer,
        RestockTrigger: RestockTriggerSerializer,
        MoveTrigger: MoveTriggerSerializer
    }


class TriggerCreatePolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Trigger: TriggerCreateSerializer,
        RestockTrigger: RestockTriggerCreateSerializer,
        MoveTrigger: MoveTriggerCreateSerializer
    }
