def landing_page(request):
    """
    Esta vista hace dos cosas:
    """
    # Client.objects.all() = "dame todos los clientes de la base de datos"
    clientes = Client.objects.all()

    # render() junta el template HTML con los datos y devuelve la pagina
    # 'clients/client_list.html' = el archivo HTML que vamos a crear
    # {'clientes': clientes} = los datos que le pasamos al HTML
    return render(request, 'clients/client_list.html', {'clientes': clientes})