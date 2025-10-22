# 🚀 Portafolio Web - Gerson Carranza

Portafolio profesional interactivo desarrollado con Next.js y Azure Functions, mostrando proyectos, experiencia y habilidades técnicas.

## 📋 Descripción

Aplicación web full-stack que consume APIs REST desde Azure Functions conectadas a Azure SQL Database, presentando de forma interactiva mi trayectoria profesional como Ingeniero de Sistemas y Analista de Datos.

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS + Shadcn/ui
- **Animaciones:** Framer Motion
- **Gráficos:** Recharts
- **State Management:** React Query (TanStack Query)
- **Deploy:** Vercel

### Backend
- **Plataforma:** Azure Functions (Serverless)
- **Lenguaje:** C# (.NET 7)
- **Base de Datos:** Azure SQL Database
- **APIs:** REST con arquitectura limpia

## 📁 Estructura del Proyecto
```
PortafolioWeb/
├── frontend/              # Aplicación Next.js
│   ├── app/              # App Router de Next.js
│   ├── components/       # Componentes React
│   │   ├── sections/    # Secciones principales
│   │   ├── interactive/ # Componentes interactivos
│   │   └── ui/          # Componentes UI (Shadcn)
│   └── lib/             # Utilidades y tipos
│
├── backend/              # Azure Functions
│   ├── Functions/       # Endpoints de la API
│   │   ├── GetProjects.cs
│   │   ├── GetExperience.cs
│   │   ├── GetSkills.cs
│   │   └── GetEducation.cs
│   └── Models/          # Modelos de datos
│
└── README.md
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- .NET 7 SDK
- Azure Functions Core Tools
- Azure SQL Database

### Frontend
```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: http://localhost:3000

### Backend
```bash
cd backend
dotnet restore
func start --cors *
```

Las APIs estarán disponibles en: http://localhost:7071/api

## 📡 Endpoints de la API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/projects` | GET | Obtiene lista de proyectos (con filtros opcionales) |
| `/api/projects?featured=true` | GET | Proyectos destacados |
| `/api/experience` | GET | Experiencia laboral |
| `/api/skills` | GET | Habilidades técnicas |
| `/api/skills?category=Backend` | GET | Skills por categoría |
| `/api/education` | GET | Educación académica |

## ⚙️ Configuración

### Variables de Entorno (Frontend)

Crear archivo `.env.local` en `/frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:7071/api
```

### Variables de Entorno (Backend)

Configurar en `local.settings.json`:
```json
{
  "Values": {
    "SqlConnectionString": "tu-connection-string-azure-sql"
  }
}
```

## 🗄️ Base de Datos

El proyecto utiliza Azure SQL Database con las siguientes tablas:

- `ds_Projects` - Proyectos desarrollados
- `ds_Experience` - Experiencia laboral
- `ds_Skills` - Habilidades técnicas
- `ds_Education` - Formación académica
- `ds_Analytics` - Métricas de visitas
- `ds_ContactMessages` - Mensajes de contacto

## ✨ Características Destacadas

- 🎨 Diseño minimalista y moderno
- 🔄 Animaciones fluidas con Framer Motion
- 📊 Gráficos interactivos manipulables
- 🔍 Sistema de zoom en imágenes
- 📱 Completamente responsive
- 🌙 Modo oscuro/claro (próximamente)
- ⚡ Optimizado para rendimiento
- 🔒 APIs seguras con Azure

## 🚀 Deploy

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Azure)
```bash
cd backend
func azure functionapp publish <nombre-function-app>
```

## 👨‍💻 Autor

**Gerson Josue Carranza Amaya**
- 💼 Ingeniero de Sistemas | Data Analyst Developer
- 📧 jotag.carranza@gmail.com
- 🌐 LinkedIn: [Tu perfil]
- 💻 GitHub: [@GersonJC](https://github.com/GersonJC)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!