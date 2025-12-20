# Survey Builder App

Una aplicación simple y escalable para crear y gestionar múltiples encuestas con Supabase.

## 🚀 Configuración Inicial

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/pablojavierrodriguez/survey-builder.git
cd survey-builder
npm install
```

### Paso 2: Crear proyecto Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Guarda la URL del proyecto y las API keys

### Paso 3: Inicializar base de datos
1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta el script `INITIALIZATION.sql` (incluido en este repo)
3. Esto crea las tablas necesarias y configura RLS

### Paso 4: Configurar la aplicación
1. Ejecuta `npm run dev`
2. Accede a la aplicación
3. Completa el wizard de configuración con:
   - URL de Supabase
   - Service Role Key
   - Nombre de la aplicación

### Paso 5: Migrar a sistema multi-encuesta
1. Si tienes datos existentes, ejecuta los scripts de migración en orden:
   ```bash
   scripts/01_create_surveys_table.sql
   scripts/02_add_survey_id_to_responses.sql
   scripts/03_create_default_survey.sql
   scripts/04_link_existing_responses.sql
   scripts/05_create_survey_stats_view.sql
   scripts/10_add_response_data_column.sql
   ```

### Paso 6: ¡Listo!
La aplicación está configurada y lista para crear múltiples encuestas.

## 🛠️ Tecnologías

- **Frontend:** Next.js 15.2.8, React, TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **UI:** Tailwind CSS, shadcn/ui, Framer Motion
- **Deploy:** Vercel

## 📁 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── admin/             # Panel de administración
│   │   ├── surveys/       # Gestión de encuestas
│   │   ├── analytics/     # Análisis por encuesta
│   │   └── dashboard/     # Dashboard principal
│   ├── auth/              # Páginas de autenticación
│   ├── survey/[slug]/     # Vista pública de encuestas
│   ├── api/               # API Routes
│   └── setup/             # Wizard de configuración
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI
│   └── survey-renderer.tsx  # Renderizador dinámico
├── lib/                   # Utilidades y configuración
│   ├── types/            # TypeScript types
│   └── api/              # API helpers
├── scripts/              # Scripts de migración SQL
├── docs/                 # Documentación
└── INITIALIZATION.sql    # Script de inicialización
```

## 🔧 Características

- ✅ **Sistema Multi-Encuesta**: Crea y gestiona múltiples encuestas
- ✅ **Editor Visual de Preguntas**: Drag-and-drop para configurar preguntas
- ✅ **Tipos de Preguntas Dinámicas**:
  - Single Choice (selección única)
  - Multiple Select (selección múltiple)
  - Long Text (texto largo)
  - Short Text (texto corto)
  - Email
  - Number
  - Salary Range (rango salarial personalizado)
- ✅ **Configuración por Encuesta**: Cada encuesta con sus propias preguntas y settings
- ✅ **Gestión de Estado**: Activar/desactivar, publicar/despublicar encuestas
- ✅ **Análisis Filtrado**: Analytics por encuesta específica
- ✅ **Duplicación de Encuestas**: Clonar encuestas existentes
- ✅ **Autenticación con Supabase**: Sistema multi-admin
- ✅ **Panel de Administración**: Dashboard completo con estadísticas
- ✅ **Arquitectura Escalable**: JSONB para datos flexibles
- ✅ **Row Level Security (RLS)**: Seguridad integrada

## 📊 Sistema de Encuestas

### Crear Nueva Encuesta
1. Ve a **Admin Panel → Surveys**
2. Click **"Create Survey"**
3. Configura título, slug y descripción
4. Click **"Edit Questions"** para configurar preguntas
5. Arrastra y suelta para reordenar
6. Activa y publica cuando esté lista

### Gestionar Preguntas
- **Agregar**: Click "Add Question"
- **Editar**: Click en cualquier pregunta
- **Reordenar**: Arrastra con el ícono de grip
- **Eliminar**: Click en el ícono de basura
- **Cambiar Tipo**: Dropdown de tipos de pregunta
- **Opciones**: Para preguntas de selección

### Selector Automático
- Si hay **1 encuesta activa**: Carga automáticamente
- Si hay **múltiples encuestas**: Muestra selector visual
- Si **no hay encuestas**: Mensaje de bienvenida

## 🔐 Roles y Permisos

- **Admin**: Control total del sistema
- **Viewer**: Vista de analytics (solo lectura)

## 🚀 Deploy

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy automático

## 📖 Documentación

Ver `docs/MULTI_SURVEY_GUIDE.md` para guía completa del sistema multi-encuesta.

## 🐛 Troubleshooting

### La encuesta no aparece
- Verifica que esté publicada (`is_published = true`)
- Verifica que esté activa (`is_active = true`)

### Las respuestas no se guardan
- Verifica la conexión a Supabase
- Revisa que el `survey_id` sea correcto
- Verifica RLS policies en Supabase

### Preguntas no se renderizan
- Verifica que el JSON de config sea válido
- Verifica que los tipos de pregunta sean soportados
- Para choice questions, verifica que exista array de options

## 📝 Licencia

MIT
