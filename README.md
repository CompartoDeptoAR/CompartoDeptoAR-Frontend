
# 🚀 CompartoDeptoAR – Frontend

Frontend de la app **CompartoDepto Arg**, desarrollado con **React**, **TypeScript** y **Vite**.
Este proyecto se encarga de la **interfaz de usuario**, consumiendo la API del backend y permitiendo a los usuarios interactuar con todas las funcionalidades relacionadas con publicaciones, perfiles, chat, favoritos y administración.

---

## 🛠 Tecnologías utilizadas

### 🚀 Tecnologías principales

* **React 19** + **TypeScript**
* **Vite 7** (dev server + build)
* **Bootstrap 5** + CSS
* **React Router DOM 7**
* **Axios** (cliente HTTP)
* **Firebase 12** (autenticación)

### 🗺 Mapas y geolocalización

El proyecto utiliza dos librerías de mapas:

* **Leaflet** + `react-leaflet`
* **Mapbox GL JS** + `react-map-gl`

### 📊 Gráficos

* **Chart.js 4**
* **react-chartjs-2**

### 📦 Upload de imágenes

* **react-dropzone**

### 🧭 Íconos

* **lucide-react**

---

## 🧰 Scripts disponibles

| Script          | Acción                                     |
| --------------- | ------------------------------------------ |
| `npm start`     | Inicia Vite en modo desarrollo             |
| `npm run build` | Compila TypeScript y genera el build final |
| `npm run lint`  | Ejecuta ESLint + Prettier                  |
| `npm test`      | Alias que ejecuta `lint`                   |

---

## 📥 Instalación y uso

```bash
# Clonar el repo
git clone https://github.com/tu-repo/frontend-compartoDeptoAR.git

# Entrar al proyecto
cd compartodeptoar-frontend

# Instalar dependencias
npm install

# Correr en desarrollo
npm start
```

---

## 🔧 Configuración de entorno

El proyecto utiliza variables de entorno para conectarse al backend y a Firebase.

Crear un archivo **`.env`** con:

```env
# Backend
VITE_API_URL=http://localhost:3000

VITE_URL_USER=/api/usuarios
VITE_URL_AUTH=/api/auth
VITE_URL_FAVORITO=/api/favoritos
VITE_URL_PUBLICACION=/api/publicaciones
VITE_URL_CHAT=/api/chat
VITE_URL_CALIFICACION=/api/calificaciones
VITE_URL_CONTACTO=/api/contacto
VITE_URL_USER_PERFIL=/api/usuarios/perfil
VITE_URL_PERFIL_HABITOS_PREFERECIAS=/api/usuarios/habitos-preferencias
VITE_URL_REPORTES=/api/reportes
VITE_URL_MODERACION=/api/moderacion

# Firebase
VITE_FIREBASE_API_KEY=AIzaSyCtJ-YKMD3u6x0askxilGqdj1XANGarU00
VITE_FIREBASE_APP_ID=1:215954685179:web:21cea17154dab69fbbc45e
VITE_FIREBASE_AUTH_DOMAIN=compartodeptoar-a6961.firebaseapp.com
VITE_FIREBASE_MEASUREMENT_ID=G-NTY8Y3X15X
VITE_FIREBASE_MESSAGING_SENDER_ID=215954685179
VITE_FIREBASE_PROJECT_ID=compartodeptoar-a6961
VITE_FIREBASE_STORAGE_BUCKET=compartodeptoar-a6961.firebasestorage.app

# Mapbox
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiY29tcGFydG9kZXB0b2FyIiwiYSI6ImNtaXc2NmdjbjBxMXYza3B5MmVhZnd0NmsifQ.q-J82Tk_rLhuDIgBCZcIlA
```

---

## 🧹 Calidad de código

Este proyecto incluye configuración completa para mantener un código limpio y consistente:

* **ESLint**
* **Prettier**
* **TypeScript-ESLint**
* Reglas actualizadas para **React 19** y **TypeScript 5**

---

## 📄 Licencia

Este proyecto es de uso **privado** para CompartoDeptoAR.

---

Si querés, también puedo preparar un **README para el backend**, o agregar badges (build, versión, licencias, etc.).
