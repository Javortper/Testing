from django.shortcuts import render, redirect, get_object_or_404
from .models import Client
from .forms import LawyerForm

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

def crear_cliente(request):
    if request.method == 'POST':
        form = LawyerForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_clientes')
    else:
        form = LawyerForm()

    return render(request, 'clients/client_form.html', {'form': form})

def editar_cliente(request, pk):
    cliente = get_object_or_404(Client, pk=pk)
    if request.method == 'POST':
        form = LawyerForm(request.POST, instance=cliente)
        if form.is_valid():
            form.save()
            return redirect('lista_clientes')
    else:
        form = LawyerForm(instance=cliente)
    return render(request, 'clients/client_form.html', {'form': form})

def eliminar_cliente(request, pk):
    cliente = get_object_or_404(Client, pk=pk)
    if request.method == 'POST':
        cliente.delete()
        return redirect('lista_clientes')
    return render(request, 'clients/client_confirm_delete.html', {'cliente': cliente})