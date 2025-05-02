from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    TIPO_USUARIO = (
        ('administrador', 'administrador'),
        ('responsavel', 'responsavel'),
    )

    tipo_usuario = models.CharField(max_length=15, choices=TIPO_USUARIO, default="não especificado")

    def __str__(self):
        return f"{self.username} - {self.tipo_usuario}"