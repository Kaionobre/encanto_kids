from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.contrato.api.viewset import ContratoViewset

router = DefaultRouter()
router.register(r'contrato', ContratoViewset)

urlpatterns = [
    path('', include(router.urls)),
]
