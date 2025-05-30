from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend  # Para filtros
from apps.agenda.models import AgendaDiaria, AnexoAgenda
from .serializers import AgendaDiariaSerializer, AnexoAgendaSerializer
from apps.crianca.models import Crianca  # Para verificar a criança
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated

# Permissão customizada para verificar se o usuário é o responsável pela criança da agenda


class IsResponsavelDaCriancaDaAgenda(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.is_superuser:
            return True
        if hasattr(request.user, 'responsavel'):
            return obj.crianca.responsavel == request.user.responsavel
        return False


class AgendaDiariaViewSet(viewsets.ModelViewSet):
    serializer_class = AgendaDiariaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'crianca': ['exact'],
        'crianca__id': ['exact'],
        'data': ['exact', 'gte', 'lte', 'range'],
    }

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return AgendaDiaria.objects.all().select_related('crianca').prefetch_related('anexos')

        if hasattr(user, 'responsavel'):
            return AgendaDiaria.objects.filter(crianca__responsavel=user.responsavel).select_related('crianca').prefetch_related('anexos')

        return AgendaDiaria.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        crianca_id = self.request.data.get('crianca')

        if not crianca_id:
            raise serializers.ValidationError(
                {"crianca": "Este campo é obrigatório."})

        try:
            crianca = Crianca.objects.get(pk=crianca_id)
        except Crianca.DoesNotExist:
            raise serializers.ValidationError(
                {"crianca": "Criança não encontrada."})

        if not (user.is_staff or user.is_superuser):
            if not hasattr(user, 'responsavel') or crianca.responsavel != user.responsavel:
                raise permissions.PermissionDenied(
                    "Você não tem permissão para criar uma agenda para esta criança.")

        serializer.save(crianca=crianca)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy', 'retrieve', 'observacao_pais', 'informar_falta']:
            return [permissions.IsAuthenticated(), IsResponsavelDaCriancaDaAgenda()]
        return super().get_permissions()

    @action(detail=True, methods=['patch'], url_path='observacao-pais')
    def observacao_pais(self, request, pk=None):
        agenda = self.get_object()
        # Só permite observação se a criança estiver presente
        if not agenda.presente:
            return Response({"detail": "Não é possível adicionar observação para um dia de falta."}, status=status.HTTP_400_BAD_REQUEST)

        observacao = request.data.get('observacao_pais')
        if observacao is None:
            return Response({"observacao_pais": "Este campo é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        agenda.observacao_pais = observacao
        agenda.save(update_fields=['observacao_pais', 'atualizado_em'])
        serializer = self.get_serializer(agenda)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='informar-falta')
    def informar_falta(self, request, pk=None):
        agenda = self.get_object()
        justificativa = request.data.get('justificativa_falta', '')

        agenda.presente = False
        agenda.justificativa_falta = justificativa

        # Limpar outros campos relevantes quando a falta é informada
        agenda.alimentacao_detalhes = ""
        agenda.comportamento_notas = ""
        agenda.atividades_descricao = ""
        agenda.recado_equipe = ""
        # agenda.observacao_pais = "" # Decide se quer limpar a observação dos pais também

        fields_to_update = [
            'presente', 'justificativa_falta', 'atualizado_em',
            'alimentacao_detalhes', 'comportamento_notas',
            'atividades_descricao', 'recado_equipe'
        ]
        # if quer_limpar_observacao_pais:
        #    fields_to_update.append('observacao_pais')

        agenda.save(update_fields=fields_to_update)
        serializer = self.get_serializer(agenda)
        return Response(serializer.data)


class AnexoAgendaViewSet(viewsets.ModelViewSet):
    serializer_class = AnexoAgendaSerializer
    # Ajustar permissões se necessário
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        agenda_id = self.request.query_params.get('agenda_diaria_id')

        qs = AnexoAgenda.objects.all()

        if agenda_id:
            qs = qs.filter(agenda_diaria_id=agenda_id)
        else:
            if self.action == 'list':
                return AnexoAgenda.objects.none()

        if user.is_staff or user.is_superuser:
            return qs.select_related('agenda_diaria__crianca')

        if hasattr(user, 'responsavel'):
            return qs.filter(agenda_diaria__crianca__responsavel=user.responsavel).select_related('agenda_diaria__crianca')

        return AnexoAgenda.objects.none()

    def perform_create(self, serializer):
        # Esta função agora seria usada principalmente pela administração.
        # Pais não terão UI para isso.
        agenda_diaria_id = self.request.data.get('agenda_diaria')
        if not agenda_diaria_id:
            raise serializers.ValidationError(
                {"agenda_diaria": "Este campo é obrigatório."})

        try:
            agenda = AgendaDiaria.objects.get(pk=agenda_diaria_id)
        except AgendaDiaria.DoesNotExist:
            raise serializers.ValidationError(
                {"agenda_diaria": "Registro de agenda não encontrado."})

        user = self.request.user
        # Apenas staff/admin podem criar anexos diretamente via API agora
        if not (user.is_staff or user.is_superuser):
            # Redundante se apenas admin usa
            if not hasattr(user, 'responsavel') or agenda.crianca.responsavel != user.responsavel:
                raise permissions.PermissionDenied(
                    "Você não tem permissão para adicionar anexos a esta agenda.")

        serializer.save(agenda_diaria=agenda)

    # Ajustar get_permissions para AnexoAgenda se necessário,
    # por exemplo, para restringir delete/update a admins.
