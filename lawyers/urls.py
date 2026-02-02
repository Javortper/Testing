from django.urls import path
from . import views

urlpatterns = [
    path('', views.lista_abogados, name='lista_abogados'),
    path('crear/', views.crear_abogado, name='crear_abogado'),
    path('editar/<int:pk>/', views.editar_abogado, name='editar_abogado'),
    path('eliminar/<int:pk>/', views.eliminar_abogado, name='eliminar_abogado'),
]
