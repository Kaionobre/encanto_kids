from rest_framework import serializers
from apps.agenda.models import AgendaDiaria, AnexoAgenda
# Para detalhes da criança, se necessário
from apps.crianca.api.serializer import CriancaSerializer


class AnexoAgendaSerializer(serializers.ModelSerializer):
    arquivo_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AnexoAgenda
        fields = ['id', 'agenda_diaria', 'arquivo',
                  'arquivo_url', 'descricao', 'criado_em']
        # Será definido pelo ViewSet ao criar
        read_only_fields = ['agenda_diaria']

    def get_arquivo_url(self, obj):
        request = self.context.get('request')
        if obj.arquivo and request:
            return request.build_absolute_uri(obj.arquivo.url)
        return None


class AgendaDiariaSerializer(serializers.ModelSerializer):
    # Para exibir detalhes da criança em vez de apenas o ID (opcional)
    # crianca_detalhes = CriancaSerializer(source='crianca', read_only=True)

    # Para listar e criar anexos junto com a agenda
    # read_only=True para listagem
    anexos = AnexoAgendaSerializer(many=True, read_only=True)
    # Para permitir upload de anexos ao criar/atualizar a agenda, precisaria de lógica customizada
    # no create/update do serializer ou viewset, ou um endpoint separado para anexos.
    # Por simplicidade, vamos focar em um endpoint separado para anexos.

    class Meta:
        model = AgendaDiaria
        fields = [
            'id',
            'crianca',
            # 'crianca_detalhes',
            'data',
            'presente',
            'justificativa_falta',
            'alimentacao_detalhes',
            'comportamento_notas',
            'atividades_descricao',
            'recado_equipe',
            'observacao_pais',
            'anexos',  # Lista de anexos
            'criado_em',
            'atualizado_em'
        ]
        # 'crianca' será validada no ViewSet para garantir que pertence ao responsável logado

    def validate(self, data):
        # Validação para garantir que não haja duplicidade de agenda para a mesma criança na mesma data
        # ao criar um novo registro.
        request_method = self.context['request'].method
        if request_method == 'POST':  # Apenas na criação
            crianca = data.get('crianca')
            data_agenda = data.get('data')
            if crianca and data_agenda:
                if AgendaDiaria.objects.filter(crianca=crianca, data=data_agenda).exists():
                    raise serializers.ValidationError(
                        {"detail": f"Já existe um registro de agenda para a criança {crianca.nome} na data {data_agenda.strftime('%d/%m/%Y')}."}
                    )
        return data
