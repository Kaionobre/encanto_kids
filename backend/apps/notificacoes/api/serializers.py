from rest_framework import serializers
from ..models import Notificacao  # Importa do mesmo app


class NotificacaoSerializer(serializers.ModelSerializer):
    # Opcional: Formatar a data para exibição, se necessário (frontend geralmente lida com isso)
    # data_criacao_formatada = serializers.DateTimeField(source='data_criacao', format="%d/%m/%Y %H:%M", read_only=True)

    # Para exibir o nome do tipo em vez do valor chave
    tipo_display = serializers.CharField(
        source='get_tipo_display', read_only=True)

    class Meta:
        model = Notificacao
        fields = [
            'id',
            'responsavel',  # Envia o ID do responsável
            'tipo',
            'tipo_display',
            'titulo',
            'mensagem',
            'data_criacao',  # Envia no formato ISO, frontend formata como quiser
            # 'data_criacao_formatada',
            'lida',
            'link_acao',
            'texto_link_acao',
            'urgente',
        ]
        # Campos que não são definidos pelo cliente na criação/update
        read_only_fields = ('data_criacao', 'tipo_display')
