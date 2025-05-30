from rest_framework.routers import DefaultRouter
from .viewsets import CobrancaViewSet

router = DefaultRouter()
router.register(r'cobrancas', CobrancaViewSet, basename='cobranca')

urlpatterns = router.urls
