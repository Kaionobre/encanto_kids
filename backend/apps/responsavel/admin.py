from django.contrib import admin
from .models import Responsavel


@admin.register(Responsavel)
class ResponsavelAdmin(admin.ModelAdmin):
    # opcional, útil com autocomplete
    search_fields = ['nome', 'user__username']
