from rest_framework import serializers
from apps.responsavel.models import Responsavel
# from apps.autenticacao.models import CustomUser # Se quiser serializar campos do CustomUser


class ResponsavelSerializer(serializers.ModelSerializer):
    # Opcional: Para incluir informações do CustomUser associado no endpoint "me"
    user_username = serializers.CharField(
        source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_tipo_usuario = serializers.CharField(
        source='user.tipo_usuario', read_only=True)

    class Meta:
        model = Responsavel
        fields = [
            'id',
            'user',  # ID do CustomUser
            'user_username',
            'user_email',
            'user_tipo_usuario',
            'nome',
            'cpf',
            # Email do Responsavel (pode ser diferente do CustomUser.email se permitido)
            'email',
            'telefone',
            # Adicione outros campos do Responsavel que você quer expor
        ]
        # Se 'user' (o campo ForeignKey para CustomUser) não for necessário na resposta para o cliente,
        # você pode removê-lo dos fields e manter apenas os campos derivados como user_username.
        # fields = '__all__' também funcionaria, mas listar explicitamente dá mais controle.

        # Se você quiser que o campo 'user' (ID do CustomUser) seja apenas para leitura
        # ao criar/atualizar um Responsavel diretamente (não no fluxo de registro do CustomUser),
        # você pode adicionar:
        # read_only_fields = ['user']
        # No entanto, seu fluxo principal de criação de Responsavel é via CustomUserSerializer.
