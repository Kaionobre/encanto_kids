from django.db import models
from apps.responsavel.models import Responsavel  # Importa o modelo Responsavel
from django.utils import timezone


class Cobranca(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('pago', 'Pago'),
        ('atrasado', 'Atrasado'),
        ('cancelado', 'Cancelado'),
        # Novo status para pagamentos em andamento
        ('processando', 'Processando'),
    ]

    METODO_PAGAMENTO_CHOICES = [
        ('pix', 'PIX'),
        ('boleto', 'Boleto'),
        ('cartao_credito', 'Cartão de Crédito'),
        ('cartao_debito', 'Cartão de Débito'),
        ('outro', 'Outro'),
    ]

    responsavel = models.ForeignKey(
        Responsavel,
        on_delete=models.PROTECT,  # Evita deletar responsável se houver cobranças
        related_name='cobrancas',
        verbose_name="Responsável"
    )
    mes_referencia = models.DateField(
        verbose_name="Mês de Referência")  # Ex: 2025-10-01
    descricao = models.CharField(
        max_length=255,
        default="Mensalidade Encanto Kids",
        verbose_name="Descrição"
    )
    valor = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Valor (R$)"
    )
    data_vencimento = models.DateField(verbose_name="Data de Vencimento")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pendente',
        verbose_name="Status"
    )
    data_pagamento = models.DateField(
        null=True,
        blank=True,
        verbose_name="Data do Pagamento"
    )
    metodo_pagamento_efetuado = models.CharField(
        max_length=50,
        choices=METODO_PAGAMENTO_CHOICES,
        null=True,
        blank=True,
        verbose_name="Método de Pagamento Efetuado"
    )

    # Campos para integração com Gateway (exemplos)
    link_boleto = models.URLField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name="Link do Boleto"
    )
    codigo_pix = models.TextField(
        null=True,
        blank=True,
        verbose_name="Código PIX (Copia e Cola)"
    )
    qr_code_pix_url = models.URLField(  # Ou ImageField se for salvar a imagem do QR Code
        max_length=500,
        null=True,
        blank=True,
        verbose_name="URL do QR Code PIX"
    )
    id_transacao_gateway = models.CharField(
        max_length=150,  # Aumentado o tamanho
        null=True,
        blank=True,
        db_index=True,
        verbose_name="ID da Transação no Gateway"
    )

    # Timestamps
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Cobrança"
        verbose_name_plural = "Cobranças"
        ordering = ['-data_vencimento', 'responsavel__nome']
        # Pode ser útil ter uma cobrança única por responsável e mês de referência
        # unique_together = ('responsavel', 'mes_referencia') # Avalie se isso se aplica

    def __str__(self):
        return f"Cobrança de {self.responsavel.nome} - Ref: {self.mes_referencia.strftime('%m/%Y')} - Valor: R${self.valor}"

    @property
    def esta_atrasada(self):
        if self.status == 'pendente' and self.data_vencimento < timezone.now().date():
            return True
        return False
