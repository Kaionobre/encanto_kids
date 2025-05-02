from rest_framework import viewsets
from apps.responsavel.models import Responsavel
from apps.responsavel.api.serializer import ResponsavelSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated

class ResponsavelViewset(viewsets.ModelViewSet):
    queryset = Responsavel.objects.all()
    serializer_class = ResponsavelSerializer
    permission_classes = [IsAuthenticated]

    