from rest_framework.routers import DefaultRouter
from .viewsets import NotificacaoViewSet

router = DefaultRouter()
router.register(r'notificacoes', NotificacaoViewSet, basename='notificacao')

# urlpatterns = router.urls # Se você preferir exportar urlpatterns diretamente
# Se não, o include no urls.py principal usará router.urls
