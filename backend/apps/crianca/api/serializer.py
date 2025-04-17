from rest_framework import serializers
from apps.crianca.models import Crianca

class CriancaSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Crianca
        fields = '__all__'

