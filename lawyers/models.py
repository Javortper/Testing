from django.db import models
from clients.models import Client

class Lawyer(models.Model):
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(unique=True)
    num_colegiado = models.CharField(max_length=50, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    client = models.OneToOneField(Client, on_delete=models.CASCADE, related_name='lawyer')

    def __str__(self):
        return f"{self.apellidos}, {self.nombre}"
