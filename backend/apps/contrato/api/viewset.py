from rest_framework import viewsets
from apps.contrato.models import Contrato
from apps.contrato.api.serializer import ContratoSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated

class ContratoViewset(viewsets.ModelViewSet):
    queryset = Contrato.objects.all()
    serializer_class = ContratoSerializer
    permission_classes = [IsAuthenticated]
