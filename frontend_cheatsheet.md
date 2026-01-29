# Django - Guia Rapida de Referencia

## Estructura de ficheros de un proyecto Django

### Nivel proyecto (creado con `django-admin startproject nombre`)

| Fichero / Carpeta | Descripcion |
|---|---|
| `manage.py` | Punto de entrada para ejecutar comandos de Django (servidor, migraciones, etc.) |
| `config/` | Carpeta del proyecto principal (nucleo de configuracion). No es una app, es donde vive la configuracion global. Se llama asi por convencion, pero toma el nombre que le des al hacer `startproject` |
| `config/settings.py` | Configuracion global: base de datos, apps instaladas, idioma, rutas, etc. |
| `config/urls.py` | Rutas principales. Desde aqui se enlazan las URLs de cada app con `include()` |
| `config/wsgi.py` | Punto de entrada para servidores web en produccion (WSGI) |
| `config/asgi.py` | Igual que wsgi.py pero para servidores asincronos (ASGI) |

### Nivel app (creado con `python manage.py startapp nombre`)

| Fichero | Descripcion |
|---|---|
| `models.py` | Define las tablas de la base de datos como clases Python |
| `views.py` | Logica de cada pagina: recibe peticiones y devuelve respuestas |
| `urls.py` (app) | Rutas propias de la app. Hay que crearlo manualmente e incluirlo en el `urls.py` del proyecto |
| `admin.py` | Registra modelos para que aparezcan en el panel de administracion `/admin` |
| `forms.py` | Define formularios (hay que crearlo manualmente) |
| `serializers.py` | Convierte modelos a JSON para APIs REST (hay que crearlo, se usa con DRF) |
| `tests.py` | Tests automaticos de la app |
| `apps.py` | Configuracion de la app (nombre, etc.) |
| `migrations/` | Carpeta con los ficheros de migracion generados automaticamente |

### Otros ficheros comunes

| Fichero | Descripcion |
|---|---|
| `templates/` | Carpeta con los ficheros HTML |
| `static/` | Carpeta con CSS, JS e imagenes |
| `requirements.txt` | Lista de dependencias del proyecto (`pip freeze > requirements.txt`) |
| `.env` | Variables de entorno (claves secretas, config de BD). No subir a git |
| `db.sqlite3` | Base de datos SQLite por defecto (solo desarrollo) |


### PARA DESARROLLAR  ---------------------------------------------
● Los ficheros que vas a tocar constantemente en tu app (clients/) son:                                                       
  
  Modificas siempre:                                                                                                            - models.py — defines tus tablas (campos, relaciones)
  - views.py — la lógica de cada página/endpoint                                                                              
  - urls.py (de la app) — las rutas de tu app (lo creas tú manualmente)
  - admin.py — registras modelos para verlos en /admin
  - templates/ — tus ficheros HTML (los creas tú)

  Modificas a veces:
  - forms.py — si necesitas formularios (lo creas tú)
  - serializers.py — solo si haces API REST con DRF (lo creas tú)
  - tests.py — para tests

  En config/ (proyecto):
  - settings.py — lo tocas para añadir apps a INSTALLED_APPS, configurar BD, etc.
  - urls.py — lo tocas una vez por app para hacer el include() de las rutas de la app

  No toques nunca:
  - manage.py — solo lo ejecutas, no lo editas
  - wsgi.py / asgi.py — configuración de producción, no se toca en desarrollo
  - apps.py — rara vez necesita cambios
  - migrations/ — se generan solos con makemigrations, no los edites manualmente
  - __init__.py — ficheros vacíos, déjalos como están

### ------------------------------------------------------------------


## Comandos basicos (por orden de uso)

## VOLVER AL ENTORNO
pipenv shell 

### MAS USADO Aplica cambios base de datos

# Crear nueva appp

python manage.py startapp cases
> Despues de crear la app, anadirla a `INSTALLED_APPS` en `settings.py`.


# Generar migraciones a partir de los modelos
python manage.py makemigrations

# Aplicar las migraciones a la base de datos
python manage.py migrate


### Lanzar panel con NGROK para que entre ana
ejecuta el runserver
en otra cmd escribes:
ngrok http 8000 
eso te da la URL y añadele el /admin


### --------------

> Flujo: modificas `models.py` -> `makemigrations` -> `migrate`.

### 1. Servidor de desarrollo

# Arrancar el servidor en http://127.0.0.1:8000
python manage.py runserver

# Arrancar en otro puerto
python manage.py runserver 8080



### 2. Crear proyecto y apps

# Crear un proyecto nuevo
django-admin startproject nombre_proyecto

# Crear una app dentro del proyecto
python manage.py startapp nombre_app

### 3. Crear superusuario para el panel
python manage.py createsuperuser 


### 8. Entorno virtual

# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (Linux/Mac)
source venv/bin/activate

# Desactivar
deactivate


### -------------- RELACIONES

Django tiene 3 tipos de relaciones entre modelos:

#### 1. ForeignKey — Muchos a Uno (N:1)

Muchos registros de un modelo apuntan a uno de otro modelo.
Ejemplo: muchos casos pertenecen a un cliente.

```python
class Client(models.Model):
    name = models.CharField(max_length=100)

class Case(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='cases')
    title = models.CharField(max_length=200)
```

- `on_delete=models.CASCADE` — si se borra el cliente, se borran sus casos.
- `on_delete=models.PROTECT` — no deja borrar el cliente si tiene casos.
- `on_delete=models.SET_NULL` — pone el campo a NULL (requiere `null=True`).
- `related_name='cases'` — permite acceder desde el cliente: `client.cases.all()`.

```python
# Crear
case = Case.objects.create(client=client, title="Demanda")

# Consultar casos de un cliente
client.cases.all()

# Filtrar casos por nombre de cliente
Case.objects.filter(client__name="Juan")
```

#### 2. ManyToManyField — Muchos a Muchos (N:N)

Un registro puede relacionarse con muchos del otro modelo y viceversa.
Ejemplo: un caso puede tener varios abogados, y un abogado varios casos.

```python
class Lawyer(models.Model):
    name = models.CharField(max_length=100)

class Case(models.Model):
    title = models.CharField(max_length=200)
    lawyers = models.ManyToManyField(Lawyer, related_name='cases', blank=True)
```

- Django crea automaticamente una tabla intermedia.
- Se pone el campo en cualquiera de los dos modelos (no en ambos).

```python
# Anadir relaciones
case.lawyers.add(lawyer1, lawyer2)

# Quitar
case.lawyers.remove(lawyer1)

# Consultar
case.lawyers.all()          # abogados del caso
lawyer.cases.all()          # casos del abogado

# Filtrar
Case.objects.filter(lawyers__name="Ana")
```

Si necesitas campos extra en la relacion (ej: fecha de asignacion), usa `through`:

```python
class Assignment(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE)
    lawyer = models.ForeignKey(Lawyer, on_delete=models.CASCADE)
    assigned_date = models.DateField(auto_now_add=True)

class Case(models.Model):
    lawyers = models.ManyToManyField(Lawyer, through='Assignment')
```

#### 3. OneToOneField — Uno a Uno (1:1)

Un registro se relaciona con exactamente uno de otro modelo.
Ejemplo: un cliente tiene un perfil con datos extra.

```python
class Client(models.Model):
    name = models.CharField(max_length=100)

class ClientProfile(models.Model):
    client = models.OneToOneField(Client, on_delete=models.CASCADE, related_name='profile')
    notes = models.TextField(blank=True)
```

```python
# Acceder
client.profile          # desde el cliente
profile.client          # desde el perfil
```

#### Resumen rapido

| Relacion | Campo | Ejemplo |
|---|---|---|
| Muchos a Uno | `ForeignKey` | Muchos casos -> un cliente |
| Muchos a Muchos | `ManyToManyField` | Casos <-> Abogados |
| Uno a Uno | `OneToOneField` | Cliente <-> Perfil |


### -------------- FRONTEND: VISTAS + TEMPLATES

## Flujo para crear una pagina nueva

```
1. Crear la vista en views.py        → prepara los datos
2. Crear la URL en app/urls.py       → conecta direccion con vista
3. Incluir en config/urls.py         → registra la app (solo la primera vez)
4. Crear el template HTML            → muestra los datos
```

## Vista (views.py)

Una funcion que recibe una peticion (request) y devuelve una pagina HTML.

```python
from django.shortcuts import render
from .models import MiModelo

def mi_vista(request):
    datos = MiModelo.objects.all()
    return render(request, 'app/template.html', {'datos': datos})
```

render() hace 3 cosas:
1. Lee el archivo HTML
2. Inyecta los datos de Python dentro del HTML
3. Devuelve la pagina completa al navegador

Parametros de render:
- request → la peticion del usuario (pasalo siempre)
- 'app/template.html' → ruta al archivo HTML
- {'datos': datos} → diccionario con los datos para el HTML

### Consultas comunes al modelo

| Metodo ORM              | Que hace                          |
|--------------------------|-----------------------------------|
| `.all()`                | Todos los registros               |
| `.get(id=1)`            | Un registro por ID                |
| `.filter(campo=valor)`  | Filtrar por condicion             |
| `.count()`              | Contar registros                  |
| `.order_by('campo')`    | Ordenar                           |

## URL (app/urls.py)

Conecta direcciones web con vistas. Cada app tiene su propio urls.py.

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.lista, name='lista'),
    path('<int:id>/', views.detalle, name='detalle'),
    path('nuevo/', views.crear, name='crear'),
    path('<int:id>/editar/', views.editar, name='editar'),
    path('<int:id>/eliminar/', views.eliminar, name='eliminar'),
]
```

- `''` → ruta raiz de la app
- `<int:id>` → captura un numero de la URL y lo pasa como parametro a la vista
- `name='lista'` → nombre para referenciar esta URL desde templates

## Incluir en config/urls.py (solo una vez por app)

```python
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('clientes/', include('clients.urls')),
    path('expedientes/', include('cases.urls')),
    path('abogados/', include('lawyers.urls')),
]
```

## Template HTML

### Estructura de carpetas
```
app/
  templates/
    app/
      mi_template.html
```

### Heredar del template base
```html
{% extends 'base.html' %}

{% block titulo %}Mi Pagina{% endblock %}

{% block contenido %}
  <h1>Hola</h1>
{% endblock %}
```

### Sintaxis Django Templates

| Sintaxis                     | Que hace                        |
|------------------------------|---------------------------------|
| `{{ variable }}`             | Muestra un valor                |
| `{% if condicion %}`         | Condicional                     |
| `{% for x in lista %}`      | Bucle                           |
| `{% extends 'base.html' %}` | Hereda de otro template         |
| `{% block nombre %}`        | Define un bloque rellenable     |
| `{% url 'nombre' %}`        | Genera una URL por su nombre    |
| `{% csrf_token %}`          | Token de seguridad (formularios)|

### Ejemplo: mostrar lista
```html
{% for cliente in clientes %}
  <tr>
    <td>{{ cliente.nombres }}</td>
    <td>{{ cliente.email }}</td>
  </tr>
{% empty %}
  <tr><td>No hay datos.</td></tr>
{% endfor %}
```

### Ejemplo: enlace a detalle
```html
<a href="{% url 'detalle' id=cliente.id %}">Ver</a>
```

### Ejemplo: formulario
```html
<form method="POST">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Guardar</button>
</form>
```

## Formulario (forms.py)

```python
from django import forms
from .models import MiModelo

class MiModeloForm(forms.ModelForm):
    class Meta:
        model = MiModelo
        fields = ['campo1', 'campo2']
```

## Vista CRUD completa (patron para copiar)

```python
from django.shortcuts import render, get_object_or_404, redirect
from .models import MiModelo
from .forms import MiModeloForm

# LISTAR
def lista(request):
    objetos = MiModelo.objects.all()
    return render(request, 'app/lista.html', {'objetos': objetos})

# DETALLE
def detalle(request, id):
    objeto = get_object_or_404(MiModelo, id=id)
    return render(request, 'app/detalle.html', {'objeto': objeto})

# CREAR
def crear(request):
    if request.method == 'POST':
        form = MiModeloForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista')
    else:
        form = MiModeloForm()
    return render(request, 'app/form.html', {'form': form})

# EDITAR
def editar(request, id):
    objeto = get_object_or_404(MiModelo, id=id)
    if request.method == 'POST':
        form = MiModeloForm(request.POST, instance=objeto)
        if form.is_valid():
            form.save()
            return redirect('lista')
    else:
        form = MiModeloForm(instance=objeto)
    return render(request, 'app/form.html', {'form': form})

# ELIMINAR
def eliminar(request, id):
    objeto = get_object_or_404(MiModelo, id=id)
    if request.method == 'POST':
        objeto.delete()
        return redirect('lista')
    return render(request, 'app/confirmar_eliminar.html', {'objeto': objeto})
```

## CSS basico (en base.html dentro de <style>)

```css
/* Seleccionar por etiqueta */
h1 { color: blue; }

/* Seleccionar por clase (.nombre) */
.contenido { max-width: 900px; margin: 0 auto; }

/* Seleccionar por ID (#nombre) */
#titulo { font-size: 24px; }

/* Propiedades comunes */
margin: 10px;              /* espacio exterior */
padding: 10px;             /* espacio interior */
background-color: #fff;    /* fondo */
color: #333;               /* color del texto */
border: 1px solid #ccc;    /* borde */
border-radius: 8px;        /* esquinas redondeadas */
font-size: 16px;           /* tamano de texto */
text-decoration: none;     /* quitar subrayado */
```

## Flujo completo (resumen visual)

```
Usuario escribe URL en el navegador
      ↓
config/urls.py → reparte a la app correcta
      ↓
app/urls.py → ejecuta la vista correcta
      ↓
views.py → busca datos en la BD (models.py)
      ↓
render() → junta datos + template HTML
      ↓
template.html → genera la pagina final
      ↓
Navegador muestra la pagina
```
