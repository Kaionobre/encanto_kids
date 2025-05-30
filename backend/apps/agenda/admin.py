from django.contrib import admin
from .models import AgendaDiaria, AnexoAgenda


class AnexoAgendaInline(admin.TabularInline):  # Ou admin.StackedInline
    model = AnexoAgenda
    extra = 1  # Quantidade de forms de anexo vazios para adicionar de uma vez
    fields = ('arquivo', 'descricao')  # Campos a serem exibidos no inline


@admin.register(AgendaDiaria)
class AgendaDiariaAdmin(admin.ModelAdmin):
    list_display = ('crianca', 'data', 'presente', 'atualizado_em')
    # Filtrar por responsável também
    list_filter = ('data', 'presente', 'crianca__responsavel__nome')
    search_fields = ('crianca__nome', 'data',
                     'recado_equipe', 'observacao_pais')
    date_hierarchy = 'data'  # Navegação por datas
    ordering = ('-data', 'crianca')
    # Permite adicionar anexos diretamente na tela da AgendaDiaria
    inlines = [AnexoAgendaInline]

    fieldsets = (
        (None, {
            'fields': ('crianca', 'data', 'presente', 'justificativa_falta')
        }),
        ('Detalhes do Dia (Equipe)', {
            'classes': ('collapse',),  # Começa recolhido
            'fields': ('alimentacao_detalhes', 'comportamento_notas', 'atividades_descricao', 'recado_equipe')
        }),
        ('Observações dos Pais', {
            'classes': ('collapse',),
            'fields': ('observacao_pais',)
        }),
    )
    # readonly_fields = ('criado_em', 'atualizado_em') # Se quiser mostrar, mas não editar


@admin.register(AnexoAgenda)
class AnexoAgendaAdmin(admin.ModelAdmin):
    list_display = ('agenda_diaria', 'descricao_curta', 'criado_em')
    list_filter = ('agenda_diaria__data', 'agenda_diaria__crianca__nome')
    search_fields = ('descricao', 'agenda_diaria__crianca__nome')
    # raw_id_fields = ('agenda_diaria',) # Útil se houver muitos registros de agenda

    def descricao_curta(self, obj):
        if obj.descricao:
            return obj.descricao[:50] + '...' if len(obj.descricao) > 50 else obj.descricao
        return '-'
    descricao_curta.short_description = 'Descrição'
