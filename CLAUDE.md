# CRM para Bufetes de Abogados - Easy Law

## Descripción del Proyecto

CRM basado en Django para la gestión de bufetes de abogados. Permite a cada abogado registrar clientes, gestionar expedientes con fechas límite y documentación, y recibir avisos mediante un calendario integrado.

## Stack Tecnológico

- **Backend:** Django 6.0.1 / Python 3.13
- **Frontend:** Tailwind CSS 4 (vía CDN del navegador)
- **Base de datos:** SQLite3 (desarrollo) — migrar a PostgreSQL en producción
- **Gestión de dependencias:** Pipenv
- **Servidor de desarrollo:** `python manage.py runserver`

## Estructura del Proyecto

```
config/              # Configuración Django (settings, urls, wsgi, asgi)
clients/             # App: gestión de clientes
cases/               # App: gestión de expedientes/casos legales
lawyers/             # App: gestión de abogados
templates/           # Templates globales (base.html)
db.sqlite3           # Base de datos de desarrollo
manage.py            # CLI de Django
Pipfile / Pipfile.lock
```

## URLs Configuradas

| URL               | Vista                | Template                          |
|--------------------|----------------------|-----------------------------------|
| `/admin/`          | Django Admin         | —                                 |
| `/clientes/`       | `lista_clientes`     | `clients/client_list.html`        |
| `/expedientes/`    | `lista_expedientes`  | `cases/expedient_list.html`       |
| `/abogados/`       | `lista_abogados`     | `lawyers/lawyer_list.html`        |

## Modelos Actuales

### Client (clients/models.py)
- nombres, apellidos, email (unique), direccion (opcional), telefono (opcional), fecha_creacion (auto)
- abogado: FK → Lawyer (on_delete=SET_NULL, null=True, related_name='clientes')

### Expedient (cases/models.py)
- titulo, fecha_limite (DateField)
- client: FK → Client (on_delete=CASCADE, related_name='expedients')

### Lawyer (lawyers/models.py)
- nombre, apellidos, telefono (opcional), email (unique), num_colegiado (unique), fecha_creacion (auto)

### Relaciones
```
Lawyer (1) ──── (M) Client    (FK en Client.abogado)
Client (1) ──── (M) Expedient (FK en Expedient.client)
```

## Objetivo Funcional

1. **Abogados:** cada abogado se registra y gestiona sus propios clientes
2. **Clientes:** cada cliente pertenece a un abogado y tiene múltiples expedientes
3. **Expedientes:** cada caso tiene título, fechas límite, estado y documentación asociada
4. **Calendario:** sistema de avisos y notificaciones sobre plazos próximos a vencer
5. **Papeleos/Documentos:** gestión de documentos vinculados a cada expediente

## Estado Actual

### Implementado
- Modelos de datos (Client, Expedient, Lawyer) con relaciones FK correctas
- Migraciones aplicadas
- Panel de administración Django con CRUD básico (admin.site.register para los 3 modelos)
- Configuración base del proyecto con CSRF para ngrok
- URLs por app con vistas de listado (solo lectura)
- Templates HTML con Tailwind CSS: base.html + listados de clientes, expedientes y abogados
- Navegación global (navbar en base.html con enlaces a las 3 secciones)

### Pendiente de implementar
- Formularios de entrada de datos (crear, editar, eliminar clientes/expedientes/abogados)
- Sistema de autenticación y permisos por abogado
- Modelo de documentos/papeleos vinculados a expedientes
- Campos adicionales en Expedient: estado, descripción, tipo de caso
- Calendario con alertas de fechas límite
- Landing page / página de inicio
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

- El modelo Expedient necesita campos adicionales: estado, descripción, tipo de caso, documentos adjuntos.
- Se necesita una app de calendario/notificaciones o integrar señales Django para alertas de plazos.
- Settings tiene DEBUG=True y SECRET_KEY hardcodeada — usar variables de entorno en producción.
- ALLOWED_HOSTS = ['*'] debe restringirse en producción.
- CSRF_TRUSTED_ORIGINS configurado para ngrok (desarrollo con túnel).
- Templates usan Tailwind CSS 4 vía CDN (@tailwindcss/browser) — considerar build propio en producción.

## Convenciones

- Nombres de modelos en inglés, campos en español
- Apps Django separadas por dominio (clients, cases, lawyers)
- Admin registrado para todos los modelos
- Vistas como funciones (function-based views)
- Templates siguen patrón `app/templates/app/nombre.html` + `templates/base.html` global
- Ramas git: `main`, `development`
