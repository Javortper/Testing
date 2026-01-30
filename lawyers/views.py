from django.shortcuts import render
from .models import Lawyer


def lista_abogados(request):
    abogados = Lawyer.objects.all()
    return render(request, 'lawyers/lawyer_list.html', {'abogados': abogados})
