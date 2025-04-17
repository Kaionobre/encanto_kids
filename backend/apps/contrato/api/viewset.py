from rest_framework import viewsets
from apps.contrato.models import Contrato
from apps.contrato.api.serializer import ContratoSerializer

class ContratoViewset(viewsets.ModelViewSet):
    queryset = Contrato.objects.all()
    serializer_class = ContratoSerializer