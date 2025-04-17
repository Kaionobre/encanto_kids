from rest_framework.routers import DefaultRouter
from apps.crianca.api.viewset import CriancaViewset
from django.urls import path, include

router = DefaultRouter()
router.register(r'crianca', CriancaViewset)

urlpatterns = [
    path('', include(router.urls)),
]