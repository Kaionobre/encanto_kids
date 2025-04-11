from django.db import models

# Create your models here.
class Pacote(models.Model):
    TIPO_CHOICES = [
        ('avulso', 'Avulso'),
        ('meio', 'Meio Período'),
        ('integral', 'Integral'),
    ]

    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
    ]

    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def __str__(self):
        return self.nome
