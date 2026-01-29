from django.db import models
from clients.models import Cliente

class Cases(models.Model):
    titulo = models.CharField(max_length=100) 
    fecha_limite = models.DateField()  # DateField: Fecha sin hora.

    client = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='cases')

    def __str__(self):
        return f"{self.titulo}, {self.fecha_limite}"