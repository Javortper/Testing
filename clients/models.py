from django.db import models

# Esta clase se convertirá en la tabla "clients_cliente" en la base de datos
class Cliente(models.Model):
    # CharField: Texto corto. Ideal para nombres.
    nombres = models.CharField(max_length=100) 
    apellidos = models.CharField(max_length=100)
    
    # EmailField: Django valida automáticamente que tenga formato @email.com
    email = models.EmailField(unique=True) # unique=True impide duplicados
    
    # TextField: Texto largo sin límite (para notas, dirección completa, etc.)
    # blank=True significa que este campo puede dejarse vacío, no es obligatorio.
    direccion = models.TextField(blank=True, null=True)
    
    telefono = models.CharField(max_length=20, blank=True)
    
    # DateTimeField: Guarda fecha y hora.
    # auto_now_add=True: Pone la fecha actual automáticamente al crearlo.
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    # Esta función mágica (__str__) define cómo se ve el objeto en texto.
    # Sin esto, en el panel verías "Cliente object (1)", que es feo.
    def __str__(self):
        return f"{self.apellidos}, {self.nombres}"