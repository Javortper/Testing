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
