from django import forms
from .models import Client


class LawyerForm(forms.ModelForm):
    class Meta:
        model = Client
        fields = ['nombre', 'apellidos', 'email', 'direccion', 'telefono', 'abogado']
