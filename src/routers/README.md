# Carpeta: routers/

### ¿Qué contiene?
Configuración del sistema de rutas del frontend, generalmente usando React Router u otra librería de enrutamiento.

### ¿Qué va aquí?
- `AppRouter.jsx`: archivo principal de rutas.
- Subrutas protegidas, públicas, o por rol (si aplica).
- Helpers de navegación si los hay.

### ¿Por qué es útil esta separación?
- Centraliza el enrutamiento, haciendo el código más limpio.
- Facilita la protección de rutas (auth, permisos).
- Mejora la escalabilidad del proyecto.

### Buenas prácticas
- Usar componentes `Route` bien organizados.
- Separar rutas públicas y privadas si es necesario.
- Evitar lógica de negocio en las rutas.
