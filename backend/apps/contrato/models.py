from django.db import models
from apps.crianca.models import Crianca

# Create your models here.
class Contrato(models.Model):
    crianca = models.OneToOneField(Crianca, on_delete=models.CASCADE, related_name='contrato')
    data_assinatura = models.DateField()
    data_validade = models.DateField()
    observacoes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Contrato de {self.crianca.nome}"
