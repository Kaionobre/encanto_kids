from rest_framework.routers import DefaultRouter
from .viewsets import AgendaDiariaViewSet, AnexoAgendaViewSet

router = DefaultRouter()
router.register(r'registros', AgendaDiariaViewSet, basename='agendadiaria')
router.register(r'anexos', AnexoAgendaViewSet, basename='anexoagenda')

urlpatterns = router.urls  # Exporta as URLs geradas pelo router
