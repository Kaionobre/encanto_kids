from django.contrib import admin
from .models import Notificacao


@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'titulo_ou_mensagem_curta',
        'responsavel_display',
        'tipo',
        'data_criacao',
        'lida',
        'urgente'
    )
    list_filter = ('tipo', 'lida', 'urgente',
                   'data_criacao', 'responsavel__nome')
    search_fields = (
        'titulo',
        'mensagem',
        'responsavel__nome',
        'responsavel__user__username'
    )
    list_editable = ('lida', 'urgente')  # Permite editar diretamente na lista
    date_hierarchy = 'data_criacao'
    ordering = ('-data_criacao',)

    fieldsets = (
        ("Destinatário e Tipo", {
            'fields': ('responsavel', 'tipo', 'urgente')
        }),
        ("Conteúdo da Notificação", {
            'fields': ('titulo', 'mensagem')
        }),
        ("Ação e Status", {
            'fields': ('link_acao', 'texto_link_acao', 'lida')
        }),
        ("Datas", {
            'fields': ('data_criacao',),
        })
    )
    readonly_fields = ('data_criacao',)
    # Melhora a seleção de responsável se houver muitos
    autocomplete_fields = ['responsavel']

    def responsavel_display(self, obj):
        return obj.responsavel.nome if obj.responsavel else "Geral (Todos)"
    responsavel_display.short_description = "Destinatário"
    responsavel_display.admin_order_field = 'responsavel'

    def titulo_ou_mensagem_curta(self, obj):
        if obj.titulo:
            return obj.titulo[:70] + '...' if len(obj.titulo) > 70 else obj.titulo
        return obj.mensagem[:70] + '...' if len(obj.mensagem) > 70 else obj.mensagem
    titulo_ou_mensagem_curta.short_description = "Título/Mensagem"
