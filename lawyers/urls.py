from django.urls import path
from . import views

urlpatterns = [
    path('', views.lista_abogados, name='lista_abogados'),
]
