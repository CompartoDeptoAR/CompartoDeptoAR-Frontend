# Carpeta: paginas/

### ¿Qué contiene?
Representa las páginas o vistas completas del sitio. Cada página puede usar múltiples componentes y representar una ruta específica (`/login`, `/dashboard`, etc.).

### ¿Qué va aquí?
- Archivos como `LoginPage.jsx`, `DashboardPage.jsx`.
- Subcarpetas para agrupar por funcionalidad si es necesario.

### ¿Por qué es útil esta separación?
- Clarifica la estructura de rutas.
- Separa la vista de alto nivel de la lógica de componentes reutilizables.
- Hace más fácil implementar navegación y enrutamiento.

### Buenas prácticas
- Mantener las páginas ligeras delegando a componentes.
- Incluir lógica específica de la página, no lógica global.
