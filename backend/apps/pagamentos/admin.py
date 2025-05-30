from django.contrib import admin
from .models import Cobranca

@admin.register(Cobranca)
class CobrancaAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'responsavel', 
        'mes_referencia_formatado', 
        'valor', 
        'data_vencimento', 
        'status', 
        'data_pagamento',
        'esta_atrasada_display'
    )
    list_filter = ('status', 'data_vencimento', 'mes_referencia', 'responsavel__nome')
    search_fields = (
        'responsavel__nome', 
        'responsavel__user__username', # CPF do usuário do responsável
        'responsavel__email',
        'descricao',
        'id_transacao_gateway'
    )
    date_hierarchy = 'data_vencimento'
    ordering = ('-data_vencimento',)
    list_editable = ('status',) # Permite editar o status diretamente na lista (com cuidado)
    
    fieldsets = (
        ("Informações Principais", {
            'fields': ('responsavel', 'mes_referencia', 'descricao', 'valor', 'data_vencimento')
        }),
        ("Status e Pagamento", {
            'fields': ('status', 'data_pagamento', 'metodo_pagamento_efetuado')
        }),
        ("Detalhes para Gateway (se aplicável)", {
            'classes': ('collapse',), # Começa recolhido
            'fields': ('link_boleto', 'codigo_pix', 'qr_code_pix_url', 'id_transacao_gateway')
        }),
        ("Timestamps", {
            'fields': ('criado_em', 'atualizado_em'),
            'classes': ('collapse',)
        })
    )
    readonly_fields = ('criado_em', 'atualizado_em')

    def mes_referencia_formatado(self, obj):
        return obj.mes_referencia.strftime("%m/%Y")
    mes_referencia_formatado.short_description = "Mês Referência"
    mes_referencia_formatado.admin_order_field = 'mes_referencia'

    def esta_atrasada_display(self, obj):
        return "Sim" if obj.esta_atrasada else "Não"
    esta_atrasada_display.short_description = "Atrasada?"
    esta_atrasada_display.boolean = True # Mostra ícones Sim/Não
