from django.db import models
from apps.responsavel.models import Responsavel
from apps.pacote.models import Pacote

class Crianca(models.Model):
    TURNO_CHOICES = [
        ('manha', 'Manhã'),
        ('tarde', 'Tarde'),
        ('integral', 'Integral'),
    ]

    nome = models.CharField(max_length=100)
    idade = models.IntegerField()
    turno = models.CharField(max_length=10, choices=TURNO_CHOICES)
    tipo_de_pacote = models.ForeignKey(Pacote, on_delete=models.SET_NULL, null=True)
    status = models.BooleanField(default=True)  # True = Ativa, False = Inativa
    foto = models.ImageField(upload_to='fotos_criancas/', null=True, blank=True)
    responsavel = models.ForeignKey(Responsavel, on_delete=models.CASCADE, related_name='criancas')

    def __str__(self):
        return self.nome
