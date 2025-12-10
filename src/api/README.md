# Carpeta: api/

### ¿Qué contiene?
Esta carpeta centraliza toda la lógica de comunicación con el backend (API REST, GraphQL, etc.). Aquí se definen las funciones que hacen peticiones HTTP, usualmente utilizando `fetch`, `axios` u otra librería.

### ¿Qué va aquí?
- `httpClient.js`: configuración global de axios (baseURL, interceptores, headers).
- Archivos como `userApi.js`, `productApi.js`, etc., que agrupan las llamadas según recurso o entidad.

### ¿Por qué es útil esta separación?
- Mantiene el código desacoplado de los componentes y páginas.
- Permite cambiar la implementación del cliente HTTP sin afectar el resto del sistema.
- Facilita pruebas unitarias de las funciones de red.

### Buenas prácticas
- Agrupar funciones por dominio (`userApi.js`, `authApi.js`).
- No mezclar lógica de UI aquí.
