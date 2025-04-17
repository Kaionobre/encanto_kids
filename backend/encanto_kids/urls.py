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
from apps.contrato.api import router
from apps.crianca.api import router
from apps.pacote.api import router
from apps.responsavel.api import router

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.contrato.api.router')),
    path('api/', include('apps.crianca.api.router')),
    path('api/', include('apps.pacote.api.router')),
    path('api/', include('apps.responsavel.api.router')),
]



