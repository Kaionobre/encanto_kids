from django.db import models

class Responsavel(models.Model):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20)

    def __str__(self):
        return self.nome