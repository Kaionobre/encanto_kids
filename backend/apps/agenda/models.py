from django.db import models
from apps.crianca.models import Crianca  # Seu modelo Crianca
from django.conf import settings  # Para referenciar o AUTH_USER_MODEL

# Modelo para os registros diários da agenda de cada criança


class AgendaDiaria(models.Model):
    crianca = models.ForeignKey(
        Crianca, on_delete=models.CASCADE, related_name='agendas_diarias')
    data = models.DateField()

    # Presença
    presente = models.BooleanField(default=True, verbose_name="Presente?")
    justificativa_falta = models.TextField(
        blank=True, null=True, verbose_name="Justificativa da Falta")

    # Detalhes do dia
    alimentacao_detalhes = models.TextField(
        blank=True, verbose_name="Detalhes da Alimentação")
    comportamento_notas = models.TextField(
        blank=True, verbose_name="Notas sobre o Comportamento")
    atividades_descricao = models.TextField(
        blank=True, verbose_name="Descrição das Atividades")
    recado_equipe = models.TextField(
        blank=True, verbose_name="Recado da Equipe para os Pais")

    # Observações dos pais (pode ser preenchido/editado pelos pais)
    observacao_pais = models.TextField(
        blank=True, null=True, verbose_name="Observações dos Pais")

    # Timestamps
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    # Quem atualizou pela última vez (opcional, mas útil)
    # atualizado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='agendas_atualizadas')

    class Meta:
        verbose_name = "Registro da Agenda Diária"
        verbose_name_plural = "Registros da Agenda Diária"
        # Garante que só haja um registro por criança por dia
        unique_together = ('crianca', 'data')
        ordering = ['-data', 'crianca__nome']

    def __str__(self):
        return f"Agenda de {self.crianca.nome} - {self.data.strftime('%d/%m/%Y')}"

# Modelo para anexos (fotos/vídeos) da agenda diária


class AnexoAgenda(models.Model):
    agenda_diaria = models.ForeignKey(
        AgendaDiaria, on_delete=models.CASCADE, related_name='anexos')
    arquivo = models.FileField(
        upload_to='anexos_agenda/%Y/%m/%d/', verbose_name="Arquivo")
    # Você pode usar ImageField se for apenas para imagens:
    # arquivo = models.ImageField(upload_to='anexos_agenda/%Y/%m/%d/', verbose_name="Imagem")
    descricao = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="Descrição do Anexo")

    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Anexo da Agenda"
        verbose_name_plural = "Anexos da Agenda"
        ordering = ['-criado_em']

    def __str__(self):
        return f"Anexo para {self.agenda_diaria} ({self.id})"
