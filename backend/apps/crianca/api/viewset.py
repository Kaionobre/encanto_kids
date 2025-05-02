from rest_framework import viewsets
from apps.crianca.models import Crianca
from apps.crianca.api.serializer import CriancaSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated


class CriancaViewset(viewsets.ModelViewSet):
    queryset = Crianca.objects.all()
    serializer_class = CriancaSerializer
    permission_classes = [IsAuthenticated]
