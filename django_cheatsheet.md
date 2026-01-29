# Django - Guia Rapida de Referencia

## Estructura de ficheros de un proyecto Django

### Nivel proyecto (creado con `django-admin startproject nombre`)

| Fichero | Descripcion |
|---|---|
| `manage.py` | Punto de entrada para ejecutar comandos de Django (servidor, migraciones, etc.) |
| `settings.py` | Configuracion global: base de datos, apps instaladas, idioma, rutas, etc. |
| `urls.py` (proyecto) | Rutas principales. Desde aqui se enlazan las URLs de cada app con `include()` |
| `wsgi.py` | Punto de entrada para servidores web en produccion (WSGI) |
| `asgi.py` | Igual que wsgi.py pero para servidores asincronos (ASGI) |

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

---

## Comandos basicos (por orden de uso)

### 1. Crear proyecto y apps

```bash
# Crear un proyecto nuevo
django-admin startproject nombre_proyecto

# Crear una app dentro del proyecto
python manage.py startapp nombre_app
```

> Despues de crear la app, anadirla a `INSTALLED_APPS` en `settings.py`.

### 2. Migraciones (base de datos)

```bash
# Generar migraciones a partir de los modelos
python manage.py makemigrations

# Aplicar las migraciones a la base de datos
python manage.py migrate
```

> Flujo: modificas `models.py` -> `makemigrations` -> `migrate`.

### 3. Servidor de desarrollo

```bash
# Arrancar el servidor en http://127.0.0.1:8000
python manage.py runserver

# Arrancar en otro puerto
python manage.py runserver 8080
```

### 4. Superusuario y admin

```bash
# Crear superusuario para acceder a /admin
python manage.py createsuperuser
```

### 5. Shell y depuracion

```bash
# Abrir shell interactivo de Django (para probar queries, modelos, etc.)
python manage.py shell
```

### 6. Ficheros estaticos

```bash
# Recopilar todos los estaticos en una carpeta (para produccion)
python manage.py collectstatic
```

### 7. Dependencias

```bash
# Instalar dependencias
pip install -r requirements.txt

# Guardar dependencias actuales
pip freeze > requirements.txt
```

### 8. Entorno virtual

```bash
# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (Linux/Mac)
source venv/bin/activate

# Desactivar
deactivate
```
