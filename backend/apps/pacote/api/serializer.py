from rest_framework import serializers
from apps.pacote.models import Pacote

class PacoteSerializer(serializers.ModelSerializer):
    class Meta:
        model =  Pacote
        fields = '__all__'

