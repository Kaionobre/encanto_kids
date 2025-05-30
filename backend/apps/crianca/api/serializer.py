from rest_framework import serializers
from apps.crianca.models import Crianca
# Para serialização aninhada do pacote
from apps.pacote.api.serializer import PacoteSerializer
# from apps.responsavel.api.serializer import ResponsavelSerializer # Se quiser aninhar dados do responsável


class CriancaSerializer(serializers.ModelSerializer):
    # Opcional: Serialização aninhada para mostrar detalhes do pacote e do responsável
    # Isso pode reduzir o número de chamadas que o frontend precisa fazer.

    # Para o pacote:
    # Se 'tipo_de_pacote' no modelo Crianca é uma ForeignKey para Pacote:
    # Você pode mostrar os detalhes do pacote em vez de apenas o ID.
    tipo_de_pacote_detalhes = PacoteSerializer(
        source='tipo_de_pacote', read_only=True)

    # Para o responsável (opcional, pois o frontend já saberá quem é o responsável logado):
    # responsavel_detalhes = ResponsavelSerializer(source='responsavel', read_only=True)

    # Para permitir que o frontend envie apenas o ID do pacote ao criar/atualizar:
    # O campo 'tipo_de_pacote' padrão (que espera um ID) já é tratado pelo ModelSerializer.

    class Meta:
        model = Crianca
        fields = '__all__'
        # Tornar 'responsavel' read_only no serializer se o perform_create no ViewSet
        # for o único responsável por definir este campo. Isso evita que o frontend
        # tente enviar um ID de responsável diferente do usuário logado.
        read_only_fields = ['responsavel']  # O perform_create cuidará disso.

        # Se você não quiser que 'tipo_de_pacote' (o ID) apareça na resposta JSON
        # junto com 'tipo_de_pacote_detalhes', você pode omiti-lo dos 'fields' e
        # garantir que o frontend envie o ID para um campo de escrita separado se necessário,
        # ou confiar que o ModelSerializer lida com isso corretamente (ele geralmente lida).
        # Para simplificar, manter 'tipo_de_pacote' (ID) nos fields permite que o frontend
        # envie o ID para criar/atualizar a relação.
