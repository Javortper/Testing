from django.urls import path
from . import views

# Cada linea conecta una direccion web con una vista (funcion)
# Ejemplo: cuando alguien entra a /clientes/, Django ejecuta views.lista_clientes
urlpatterns = [
    path('', views.lista_clientes, name='lista_clientes'),
]
