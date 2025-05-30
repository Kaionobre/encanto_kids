from django.db import models
from django.conf import settings
from apps.responsavel.models import Responsavel  # Seu modelo Responsavel


class Notificacao(models.Model):
    TIPO_GERAL = 'geral'
    TIPO_LEMBRETE_PAGAMENTO = 'lembrete_pagamento'
    TIPO_STATUS_PAGAMENTO = 'status_pagamento'
    TIPO_AVISO_EVENTO = 'aviso_evento'
    TIPO_NOVO_ANEXO_AGENDA = 'novo_anexo_agenda'  # Exemplo de outro tipo

    TIPO_NOTIFICACAO_CHOICES = [
        (TIPO_GERAL, 'Geral'),
        (TIPO_LEMBRETE_PAGAMENTO, 'Lembrete de Pagamento'),
        (TIPO_STATUS_PAGAMENTO, 'Status de Pagamento'),
        (TIPO_AVISO_EVENTO, 'Aviso de Evento'),
        (TIPO_NOVO_ANEXO_AGENDA, 'Novo Anexo na Agenda'),
    ]

    # Se null=True, pode ser uma notificação geral para todos os responsáveis.
    # Ou, você pode ter um campo ManyToManyField para 'destinatarios' se quiser mais controle.
    responsavel = models.ForeignKey(
        Responsavel,
        on_delete=models.CASCADE,
        related_name='notificacoes',
        null=True,
        blank=True,
        verbose_name="Responsável Destinatário"
    )
    tipo = models.CharField(
        max_length=30,
        choices=TIPO_NOTIFICACAO_CHOICES,
        default=TIPO_GERAL,
        verbose_name="Tipo da Notificação"
    )
    titulo = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        verbose_name="Título"
    )
    mensagem = models.TextField(verbose_name="Mensagem")
    data_criacao = models.DateTimeField(
        auto_now_add=True, verbose_name="Data de Criação")
    lida = models.BooleanField(default=False, verbose_name="Lida?")

    # Para links de ação, como "Ver Pagamento" ou "Ver Evento"
    link_acao = models.CharField(  # Pode ser uma URL interna (ex: /pagamentos) ou externa
        max_length=500,
        blank=True,
        null=True,
        verbose_name="Link de Ação (Opcional)"
    )
    texto_link_acao = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Texto do Link de Ação"
    )
    urgente = models.BooleanField(default=False, verbose_name="Urgente?")

    # Opcional: Para referenciar um objeto específico relacionado à notificação
    # from django.contrib.contenttypes.fields import GenericForeignKey
    # from django.contrib.contenttypes.models import ContentType
    # content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True)
    # object_id = models.PositiveIntegerField(null=True, blank=True)
    # content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        verbose_name = "Notificação"
        verbose_name_plural = "Notificações"
        ordering = ['-data_criacao']  # Mais recentes primeiro

    def __str__(self):
        destinatario = "Geral"
        if self.responsavel:
            destinatario = self.responsavel.nome
        return f"Notificação para {destinatario}: {self.titulo or self.mensagem[:50]}"
