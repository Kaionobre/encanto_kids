from rest_framework.routers import DefaultRouter
from apps.contrato.api.viewset import ContratoViewset

router = DefaultRouter()
router.register(r'contrato', ContratoViewset)

from django.urls import path, include
urlpatterns = [
    path('', include(router.urls)),
]