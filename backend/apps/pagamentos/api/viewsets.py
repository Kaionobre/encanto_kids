from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Cobranca
from .serializers import CobrancaSerializer
from django.utils import timezone


class IsOwnerDaCobranca(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.is_superuser:
            return True
        if hasattr(request.user, 'responsavel'):
            return obj.responsavel == request.user.responsavel
        return False


class CobrancaViewSet(viewsets.ModelViewSet):
    serializer_class = CobrancaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'status': ['exact', 'in'],
        'mes_referencia': ['exact', 'year', 'month', 'gte', 'lte'],
        'data_vencimento': ['exact', 'gte', 'lte'],
        'responsavel__id': ['exact'],
    }

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Cobranca.objects.all().select_related('responsavel')
        if hasattr(user, 'responsavel'):
            return Cobranca.objects.filter(responsavel=user.responsavel).select_related('responsavel')
        return Cobranca.objects.none()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='status-atual')
    def status_atual(self, request):
        user = request.user
        if not hasattr(user, 'responsavel'):
            return Response({"detail": "Usuário não é um responsável."}, status=status.HTTP_400_BAD_REQUEST)

        responsavel = user.responsavel
        hoje = timezone.now().date()

        # Busca cobrança pendente ou atrasada
        cobranca_atual = Cobranca.objects.filter(
            responsavel=responsavel,
            status__in=['pendente', 'atrasado']
        ).order_by('data_vencimento').first()

        # Fallback para cobrança recente paga
        if not cobranca_atual:
            cobranca_atual = Cobranca.objects.filter(
                responsavel=responsavel,
                status='pago',
                data_vencimento__month__gte=hoje.month - 1,
                data_vencimento__year=hoje.year
            ).order_by('-data_vencimento').first()

        # Fallback para próxima cobrança pendente
        if not cobranca_atual:
            cobranca_atual = Cobranca.objects.filter(
                responsavel=responsavel,
                status='pendente',
                data_vencimento__gte=hoje
            ).order_by('data_vencimento').first()

        if cobranca_atual:
            serializer = self.get_serializer(cobranca_atual)
            return Response(serializer.data)
        # Alterado para 200
        return Response({"detail": "Nenhuma cobrança atual encontrada."}, status=status.HTTP_200_OK)

    def get_permissions(self):
        if self.action == 'retrieve':
            return [permissions.IsAuthenticated(), IsOwnerDaCobranca()]
        return super().get_permissions()
