from rest_framework.routers import DefaultRouter
from apps.responsavel.api.viewset import ResponsavelViewset
from django.urls import path, include

router = DefaultRouter()
router.register(r'responsavel', ResponsavelViewset)

urlpatterns = [
    path('', include(router.urls)),
]