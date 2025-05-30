from rest_framework.routers import DefaultRouter
from apps.crianca.api.viewset import CriancaViewset
from django.urls import path, include

router = DefaultRouter()
# Adicionamos o basename='crianca' aqui
router.register(r'crianca', CriancaViewset, basename='crianca')

urlpatterns = [
    path('', include(router.urls)),
]
