from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q  # Para queries OR
from ..models import Notificacao
from .serializers import NotificacaoSerializer


# ModelViewSet para permitir marcar como lida
class NotificacaoViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if not hasattr(user, 'responsavel'):
            # Se o usuário logado não tem um perfil de responsável, não retorna nenhuma notificação
            # (a menos que seja staff/admin, tratado abaixo)
            if not (user.is_staff or user.is_superuser):
                return Notificacao.objects.none()

        if user.is_staff or user.is_superuser:
            # Admins podem ver todas as notificações se precisarem (para depuração ou gerenciamento)
            # Ou você pode restringir isso também se preferir.
            return Notificacao.objects.all().order_by('-urgente', '-data_criacao')

        # Responsáveis veem suas notificações específicas E as notificações gerais (onde responsavel é None)
        return Notificacao.objects.filter(
            Q(responsavel=user.responsavel) | Q(responsavel__isnull=True)
        ).distinct().order_by('-urgente', '-data_criacao')

    def perform_update(self, serializer):
        # Permite que o usuário (responsável) atualize apenas o campo 'lida'
        # Outras atualizações seriam feitas pelo admin
        if 'lida' in serializer.validated_data and len(serializer.validated_data) == 1:
            # Verifica se o usuário é o dono da notificação (se ela for específica)
            notificacao = self.get_object()
            if notificacao.responsavel and notificacao.responsavel != self.request.user.responsavel:
                raise permissions.PermissionDenied(
                    "Você não tem permissão para modificar esta notificação.")
            serializer.save()
        else:
            # Se tentar modificar outros campos e não for admin
            if not self.request.user.is_staff:
                raise permissions.PermissionDenied(
                    "Você só pode marcar a notificação como lida.")
            serializer.save()  # Admin pode modificar tudo

    @action(detail=True, methods=['patch'], url_path='marcar-lida')
    def marcar_como_lida(self, request, pk=None):
        notificacao = self.get_object()

        # Verifica se a notificação é para este responsável ou geral
        if notificacao.responsavel and (not hasattr(request.user, 'responsavel') or notificacao.responsavel != request.user.responsavel):
            if not request.user.is_staff:  # Admin pode marcar qualquer uma como lida
                return Response({"detail": "Você não tem permissão para marcar esta notificação."}, status=status.HTTP_403_FORBIDDEN)

        if not notificacao.lida:
            notificacao.lida = True
            notificacao.save(update_fields=['lida'])

        serializer = self.get_serializer(notificacao)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='marcar-todas-lidas')
    def marcar_todas_como_lidas(self, request):
        user = request.user
        if not hasattr(user, 'responsavel'):
            return Response({"detail": "Usuário não é um responsável."}, status=status.HTTP_400_BAD_REQUEST)

        # Marca como lidas apenas as notificações do responsável e as gerais não lidas
        notificacoes_do_usuario = Notificacao.objects.filter(
            (Q(responsavel=user.responsavel) | Q(
                responsavel__isnull=True)) & Q(lida=False)
        )

        count = notificacoes_do_usuario.update(lida=True)

        return Response({"detail": f"{count} notificações marcadas como lidas."})

    # Criação de notificações seria feita pelo admin ou por signals/tasks.
    # Se precisar de um endpoint para o admin criar via API:
    # def create(self, request, *args, **kwargs):
    #     if not request.user.is_staff:
    #         return Response({"detail": "Apenas administradores podem criar notificações."}, status=status.HTTP_403_FORBIDDEN)
    #     return super().create(request, *args, **kwargs)
