from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.autenticacao.api.viewset import RegisterView

# Criando o router
router = DefaultRouter()
router.register(r'register', RegisterView, basename='register')

urlpatterns = [
    path('', include(router.urls)),  # Adicionando as rotas do router
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
