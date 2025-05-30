from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
# AllowAny não é necessário aqui
from rest_framework.permissions import IsAuthenticated
from apps.responsavel.models import Responsavel
from .serializer import ResponsavelSerializer  # .serializer para import relativo


class ResponsavelViewset(viewsets.ModelViewSet):
    queryset = Responsavel.objects.all()
    serializer_class = ResponsavelSerializer
    # Garante que apenas usuários autenticados acessem
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Retorna os dados do objeto Responsavel associado ao usuário (CustomUser) logado.
        """
        try:
            # O OneToOneField 'user' no modelo Responsavel cria um acesso reverso
            # a partir do objeto User (request.user) para o objeto Responsavel.
            # O nome padrão para esse acesso reverso é o nome do modelo em minúsculas,
            # ou seja, 'responsavel'.
            responsavel_obj = request.user.responsavel
            serializer = self.get_serializer(responsavel_obj)
            return Response(serializer.data)
        except Responsavel.DoesNotExist:
            # Este erro ocorreria se o CustomUser logado não tivesse um Responsavel associado.
            # Isso pode acontecer se um CustomUser foi criado sem tipo_usuario='responsavel'
            # ou se o objeto Responsavel foi deletado manualmente.
            return Response(
                {"detail": "Perfil de responsável não encontrado para este usuário."},
                status=status.HTTP_404_NOT_FOUND
            )
        except AttributeError:
            # Este erro ocorre se request.user não tiver o atributo 'responsavel'.
            # Comum se o usuário logado for, por exemplo, um superusuário que não é
            # também um 'responsavel' através do seu sistema de tipo_usuario.
            return Response(
                {"detail": "Este usuário não possui um perfil de responsável vinculado."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Logar o erro 'e' em um sistema de logging em produção
            print(f"Erro inesperado em ResponsavelViewset.me: {str(e)}")
            return Response(
                {"detail": "Ocorreu um erro ao buscar os dados do responsável."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get_queryset(self):
        """
        Restringe o queryset para que usuários não-staff/não-superusuários
        só possam ver/editar seu próprio perfil de responsável.
        Administradores podem ver todos.
        """
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Responsavel.objects.all()

        # Se o usuário tem um perfil de responsável, retorna apenas ele
        if hasattr(user, 'responsavel'):
            return Responsavel.objects.filter(pk=user.responsavel.pk)

        # Caso contrário (usuário comum sem perfil de responsável), não retorna nada
        return Responsavel.objects.none()
