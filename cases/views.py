from django.shortcuts import render
from .models import Expedient


def lista_expedientes(request):
    expedientes = Expedient.objects.select_related('client').all()
    return render(request, 'cases/expedient_list.html', {'expedientes': expedientes})
