"""
URL configuration for encanto_kids project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from apps.contrato.api.router import router as contrato_router
from apps.crianca.api.router import router as crianca_router
from apps.pacote.api.router import router as pacote_router
from apps.responsavel.api.router import router as responsavel_router
from apps.autenticacao.api.router import router as autenticacao_router
from apps.agenda.api.router import router as agenda_router
from apps.pagamentos.api.router import router as pagamentos_router
from apps.notificacoes.api.router import router as notificacoes_router
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # Usar .urls para incluir as rotas do router
    path('api/', include(contrato_router.urls)),
    path('api/', include(crianca_router.urls)),
    path('api/', include(pacote_router.urls)),
    path('api/', include(responsavel_router.urls)),
    path('api/', include(agenda_router.urls)),
    path('api/', include(pagamentos_router.urls)),
    # Corrigido para notificacoes_router.urls
    path('api/', include(notificacoes_router.urls)),
    path('api/auth/', include(autenticacao_router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    if hasattr(settings, 'STATIC_ROOT'):
        urlpatterns += static(settings.STATIC_URL,
                              document_root=settings.STATIC_ROOT)
