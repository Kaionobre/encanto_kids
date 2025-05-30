from rest_framework.routers import DefaultRouter
from apps.responsavel.api.viewset import ResponsavelViewset
from django.urls import path, include

router = DefaultRouter()
# O 'basename' é útil se o queryset no viewset for dinâmico ou None inicialmente.
# Para ModelViewSet com queryset definido, o DRF infere o basename.
# Mas é uma boa prática definir explicitamente.
router.register(r'responsavel', ResponsavelViewset, basename='responsavel')

urlpatterns = [
    path('', include(router.urls)),
]

# Nenhuma alteração é estritamente necessária aqui.
# O DefaultRouter do DRF é inteligente o suficiente para registrar a action 'me'
# que foi definida no ResponsavelViewset.
# A URL gerada para a action 'me' será /api/responsavel/me/
# (assumindo que este router.urls seja incluído em encanto_kids/urls.py sob /api/)
