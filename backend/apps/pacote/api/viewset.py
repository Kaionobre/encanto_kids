from rest_framework import viewsets
from apps.pacote.models import Pacote
from apps.pacote.api.serializer import PacoteSerializer

class PacoteViewset(viewsets.ModelViewSet):
    queryset = Pacote.objects.all()
    serializer_class = PacoteSerializer