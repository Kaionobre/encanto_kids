from rest_framework import serializers
from apps.responsavel.models import Responsavel

class ResponsavelSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Responsavel
        fields = '__all__'

