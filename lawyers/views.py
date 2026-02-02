from django.shortcuts import render, redirect, get_object_or_404
from .models import Lawyer
from .forms import LawyerForm


def lista_abogados(request):
    abogados = Lawyer.objects.all()
    return render(request, 'lawyers/lawyer_list.html', {'abogados': abogados})


def crear_abogado(request):
    if request.method == 'POST':
        form = LawyerForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_abogados')
    else:
        form = LawyerForm()
    return render(request, 'lawyers/lawyer_form.html', {'form': form})


def editar_abogado(request, pk):
    abogado = get_object_or_404(Lawyer, pk=pk)
    if request.method == 'POST':
        form = LawyerForm(request.POST, instance=abogado)
        if form.is_valid():
            form.save()
            return redirect('lista_abogados')
    else:
        form = LawyerForm(instance=abogado)
    return render(request, 'lawyers/lawyer_form.html', {'form': form})


def eliminar_abogado(request, pk):
    abogado = get_object_or_404(Lawyer, pk=pk)
    if request.method == 'POST':
        abogado.delete()
        return redirect('lista_abogados')
    return render(request, 'lawyers/lawyer_confirm_delete.html', {'abogado': abogado})
