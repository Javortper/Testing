# CRM para Bufetes de Abogados - Easy Law

## Descripción del Proyecto

CRM basado en Django para la gestión de bufetes de abogados. Permite a cada abogado registrar clientes, gestionar expedientes con fechas límite y documentación, y recibir avisos mediante un calendario integrado.

## Stack Tecnológico

- **Backend:** Django 6.0.1 / Python 3.13
- **Base de datos:** SQLite3 (desarrollo) — migrar a PostgreSQL en producción
- **Gestión de dependencias:** Pipenv
- **Servidor de desarrollo:** `python manage.py runserver`

## Estructura del Proyecto

```
config/              # Configuración Django (settings, urls, wsgi, asgi)
clients/             # App: gestión de clientes
cases/               # App: gestión de expedientes/casos legales
lawyers/             # App: gestión de abogados
db.sqlite3           # Base de datos de desarrollo
manage.py            # CLI de Django
Pipfile / Pipfile.lock
```

## Modelos Actuales

### Client (clients/models.py)
- nombres, apellidos, email (unique), direccion, telefono, fecha_creacion

### Expedient (cases/models.py)
- titulo, fecha_limite, client (FK → Client)

### Lawyer (lawyers/models.py)
- nombre, apellidos, telefono, email (unique), num_colegiado (unique), fecha_creacion
- client (OneToOne → Client)

### Relaciones
```
Lawyer (1) ──── (1) Client
Client (1) ──── (M) Expedient
```

## Objetivo Funcional

1. **Abogados:** cada abogado se registra y gestiona sus propios clientes
2. **Clientes:** cada cliente pertenece a un abogado y tiene múltiples expedientes
3. **Expedientes:** cada caso tiene título, fechas límite, estado y documentación asociada
4. **Calendario:** sistema de avisos y notificaciones sobre plazos próximos a vencer
5. **Papeleos/Documentos:** gestión de documentos vinculados a cada expediente

## Estado Actual

### Implementado
- Modelos de datos (Client, Expedient, Lawyer)
- Migraciones aplicadas
- Panel de administración Django con CRUD básico
- Configuración base del proyecto

### Pendiente de implementar
- Vistas y URLs por app (views.py están vacíos)
- Templates HTML / frontend
- Formularios de entrada de datos
- Sistema de autenticación y permisos por abogado
- Modelo de documentos/papeleos vinculados a expedientes
- Calendario con alertas de fechas límite
- Relación Lawyer ↔ Client debe ser ManyToMany o ForeignKey (un abogado tiene muchos clientes)
- API REST (si se necesita frontend separado)
- Tests

## Comandos Útiles

```bash
pipenv shell                          # Activar entorno virtual
python manage.py runserver            # Servidor de desarrollo
python manage.py makemigrations       # Generar migraciones
python manage.py migrate              # Aplicar migraciones
python manage.py createsuperuser      # Crear admin
```

## Notas de Arquitectura

- La relación actual Lawyer → Client es OneToOne, lo cual limita a un cliente por abogado. Debe cambiarse a ForeignKey (muchos clientes por abogado) o usar un campo FK en Client apuntando a Lawyer.
- El modelo Expedient necesita campos adicionales: estado, descripción, tipo de caso, documentos adjuntos.
- Se necesita una app de calendario/notificaciones o integrar señales Django para alertas de plazos.
- Settings tiene DEBUG=True y SECRET_KEY hardcodeada — usar variables de entorno en producción.
- ALLOWED_HOSTS = ['*'] debe restringirse en producción.

## Convenciones

- Nombres de modelos en inglés, campos en español
- Apps Django separadas por dominio (clients, cases, lawyers)
- Admin registrado para todos los modelos
- Ramas git: `main`, `development`
