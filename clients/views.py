from django.shortcuts import render
from .models import Client


def lista_clientes(request):
    """
    Esta vista hace dos cosas:
    1. Busca TODOS los clientes en la base de datos
    2. Los manda al template HTML para que se muestren
    """
    # Client.objects.all() = "dame todos los clientes de la base de datos"
    clientes = Client.objects.all()

    # render() junta el template HTML con los datos y devuelve la pagina
    # 'clients/client_list.html' = el archivo HTML que vamos a crear
    # {'clientes': clientes} = los datos que le pasamos al HTML
    return render(request, 'clients/client_list.html', {'clientes': clientes})
