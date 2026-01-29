from django.contrib import admin
from .models import Client  # Importamos tu modelo

# Register your models here.
# Registramos el modelo para que aparezca en el panel
admin.site.register(Client)