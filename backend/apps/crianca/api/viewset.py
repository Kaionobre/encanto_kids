from rest_framework import viewsets, status, serializers  # Adicionado serializers
from rest_framework.response import Response  # Adicionado Response
from apps.crianca.models import Crianca
from .serializer import CriancaSerializer  # .serializer para import relativo
# AllowAny não é necessário aqui
from rest_framework.permissions import IsAuthenticated


class CriancaViewset(viewsets.ModelViewSet):
    # queryset será definido dinamicamente em get_queryset
    serializer_class = CriancaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Este viewset retorna uma lista de crianças apenas para o responsável logado.
        Se o usuário logado não for um responsável (ou for admin),
        nenhuma criança é retornada por padrão (a menos que seja admin/staff).
        """
        user = self.request.user

        if not user.is_authenticated:
            return Crianca.objects.none()

        # Se o usuário for staff ou superuser, pode ver todas as crianças (opcional, ajuste conforme sua política)
        # Para um sistema focado em responsáveis, talvez até admin só veja via /admin e não via API de responsável.
        # Por agora, vamos permitir que admin veja tudo.
        if user.is_staff or user.is_superuser:
            # Se você quiser que o admin filtre por responsável_id via query param:
            responsavel_id_param = self.request.query_params.get(
                'responsavel_id')
            if responsavel_id_param:
                return Crianca.objects.filter(responsavel_id=responsavel_id_param)
            return Crianca.objects.all()

        # Verifica se o usuário logado tem um perfil de Responsavel associado
        try:
            responsavel_do_usuario = user.responsavel
            return Crianca.objects.filter(responsavel=responsavel_do_usuario)
        except AttributeError:  # Se user não tem o atributo 'responsavel'
            # Isso significa que o usuário logado não é um 'responsavel'
            # conforme a relação OneToOne. Retorna um queryset vazio.
            return Crianca.objects.none()
        except Exception as e:
            # Logar o erro 'e'
            print(f"Erro em CriancaViewset.get_queryset: {str(e)}")
            return Crianca.objects.none()

    def perform_create(self, serializer):
        """
        Associa automaticamente a nova criança ao Responsavel do usuário logado.
        """
        user = self.request.user
        try:
            responsavel_do_usuario = user.responsavel
            # O campo 'responsavel' no serializer será sobrescrito aqui,
            # garantindo que a criança seja associada ao responsável logado.
            serializer.save(responsavel=responsavel_do_usuario)
        except AttributeError:
            # Se o usuário não tem um perfil de responsável, não pode criar criança por este fluxo.
            # O serializer.is_valid() já deve ter falhado se 'responsavel' for obrigatório e read_only=False.
            # Mas é uma boa prática ter essa verificação.
            # Usamos ValidationError do DRF para uma resposta de erro clara.
            raise serializers.ValidationError(
                {"detail": "Apenas usuários com perfil de responsável podem cadastrar crianças."}
            )
        except Exception as e:
            # Logar o erro 'e'
            print(f"Erro em CriancaViewset.perform_create: {str(e)}")
            raise serializers.ValidationError(
                {"detail": "Ocorreu um erro interno ao tentar salvar a criança."}
            )

    # Opcional: Se você quiser que o filtro ?responsavel_id=X funcione explicitamente
    # para administradores (já tratado no get_queryset acima) ou para outros usos,
    # você pode usar django-filter:
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['responsavel', 'responsavel__id', 'nome', 'status']
    # Mas a segurança principal vem do get_queryset.
