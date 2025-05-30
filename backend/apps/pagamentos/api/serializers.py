from rest_framework import serializers
from ..models import Cobranca
from apps.responsavel.api.serializer import ResponsavelSerializer


class CobrancaSerializer(serializers.ModelSerializer):
    responsavel_detalhes = ResponsavelSerializer(
        source='responsavel', read_only=True)  # Ativado para mais detalhes
    mes_referencia_formatado = serializers.SerializerMethodField(
        read_only=True)
    esta_atrasada = serializers.BooleanField(read_only=True)

    class Meta:
        model = Cobranca
        fields = [
            'id',
            'responsavel',
            'responsavel_detalhes',  # Incluído para detalhes do responsável
            'mes_referencia',
            'mes_referencia_formatado',
            'descricao',
            'valor',
            'data_vencimento',
            'status',
            'data_pagamento',
            'metodo_pagamento_efetuado',
            'link_boleto',
            'codigo_pix',
            'qr_code_pix_url',
            'id_transacao_gateway',
            'esta_atrasada',
            'criado_em',
            'atualizado_em',
        ]
        read_only_fields = ('criado_em', 'atualizado_em',
                            'esta_atrasada', 'mes_referencia_formatado')

    def get_mes_referencia_formatado(self, obj):
        if obj.mes_referencia:
            return obj.mes_referencia.strftime("%B/%Y")  # Ex: Outubro/2025
        return None
