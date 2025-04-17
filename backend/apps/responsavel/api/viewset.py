from rest_framework import viewsets
from apps.responsavel.models import Responsavel
from apps.responsavel.api.serializer import ResponsavelSerializer

class ResponsavelViewset(viewsets.ModelViewSet):
    queryset = Responsavel.objects.all()
    serializer_class = ResponsavelSerializer