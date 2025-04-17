from rest_framework.routers import DefaultRouter
from apps.pacote.api.viewset import PacoteViewset
from django.urls import path, include

router = DefaultRouter()
router.register(r'pacote', PacoteViewset)

urlpatterns = [
    path('', include(router.urls)),
]