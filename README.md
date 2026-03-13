# 🛍️ Catálogo de Accesorios — Sistema Virtual de Catálogo

Sistema completo para catálogo de accesorios de moda con panel administrativo.

**Stack**: React + Tailwind CSS v4 (frontend) · Express.js + MongoDB (backend)

---

## 📋 Requisitos Previos

- **Node.js** 18+
- **MongoDB** corriendo localmente (puerto 27017)
  - [Descargar MongoDB Community Server](https://www.mongodb.com/try/download/community)

---

## 🚀 Instalación

### 1. Backend

```bash
cd server
npm install
```

Crea el archivo `.env` (ya incluido con valores por defecto):
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/catalogo_accesorios
JWT_SECRET=catalogo_super_secret_key_2024
JWT_EXPIRES_IN=7d
WHATSAPP_NUMBER=51982132639
ADMIN_USER=admin
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173

# Cloudinary (Necesario para imágenes en producción)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 2. Poblar la Base de Datos (ejecutar una sola vez)

```bash
cd server
node src/utils/seed.js
```

Esto crea:
- Usuario admin (`admin` / `admin123`)
- 5 categorías con subcategorías (Mujer, Hombre, Mascotas, Niños, Ropa)
- 8 productos de muestra

### 3. Frontend

```bash
cd client
npm install
```

---

## ▶️ Ejecutar en Desarrollo

Terminal 1 (backend):
```bash
cd server
npm run dev
```

Terminal 2 (frontend):
```bash
cd client
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:5173/adminpanel

---

## 🚀 Despliegue (Producción)

### 1. Base de Datos (MongoDB Atlas)
1. Crea un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtén tu cadena de conexión (URI) y reemplázala en el `.env`.

### 2. Almacenamiento de Imágenes (Cloudinary)
1. Crea una cuenta en [Cloudinary](https://cloudinary.com/).
2. Copia tus credenciales en el `.env` del backend. El sistema ya está configurado para subir automáticamente a Cloudinary.

### 3. Backend (Render / Railway)
1. Sube el código de la carpeta `server` a un repositorio de GitHub.
2. Conecta el repositorio a [Render](https://render.com/).
3. Configura las **Environment Variables** en Render con los valores del `.env`.

### 4. Frontend (Netlify / Vercel)
1. Sube el código de la carpeta `client` a un repositorio de GitHub.
2. Conecta el repositorio a Netlify.
3. **Manejo de API en Producción**: 
   Para que el frontend pueda hablar con el backend sin problemas de CORS, crea un archivo en `client/public/_redirects` con el siguiente contenido:
   ```text
   /api/*  https://TU-APP-EN-RENDER.onrender.com/api/:splat  200
   /*      /index.html                                     200
   ```
   *Esto redirigirá todas las peticiones de `/api` a tu servidor de Render automáticamente.*

---

## 🔐 Acceso Admin

| Campo | Valor |
|-------|-------|
| URL | `/adminpanel` |
| Usuario | `admin` |
| Contraseña | `admin123` |

> ⚠️ Cambiar las credenciales en `.env` antes de producción.

---

## 📁 Estructura del Proyecto

```
/
├── client/          # Frontend React + Tailwind v4
│   └── src/
│       ├── components/   # ui/, catalog/, admin/
│       ├── context/      # ThemeContext, AuthContext
│       ├── hooks/        # useProducts, useCategories, useFilters
│       ├── pages/        # 5 páginas principales
│       ├── services/     # api.js (axios)
│       └── utils/        # formatPrice, whatsapp
│
└── server/          # Backend Express.js
    └── src/
        ├── models/      # Product, Category, User, Settings
        ├── controllers/ # auth, products, categories, settings
        ├── routes/      # Rutas API
        ├── middleware/  # auth, upload, errorHandler
        └── utils/       # seed.js
```

---

## 🌐 API Endpoints

### Públicos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Lista productos (filtros: category, subcategory, featured, search) |
| GET | `/api/products/:id` | Detalle de producto |
| GET | `/api/categories` | Lista de categorías |
| GET | `/api/settings` | Configuración del negocio |

### Protegidos (requieren JWT)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login admin |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:id` | Editar producto |
| DELETE | `/api/products/:id` | Eliminar producto |
| POST | `/api/products/:id/images` | Subir imágenes |
| POST/PUT/DELETE | `/api/categories` | CRUD categorías |
| PUT | `/api/settings` | Actualizar configuración |

---

## 🎨 Diseño

- **Nombre de la Tienda**: MORA Store
- **Colores**: Paleta melón cálido (`#F4A06A`) y Beige elegante (`#F5F5DC`)
- **Tipografía**: Playfair Display (títulos) · DM Sans (body) · DM Mono (precios)
- **Animaciones**: Destello espejo en hover (Header), transiciones suaves de color.
- **Modo oscuro**: Toggle persistido en localStorage
- **Mobile-first**: Optimizado para navegación desde celular
