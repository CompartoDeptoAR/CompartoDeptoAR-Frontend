# Carpeta: contexts/

### ¿Qué contiene?
Contextos de React para manejo de estado global (auth, usuario, tema, etc.).

### ¿Qué va aquí? 
- `AuthContext.js`, `ThemeContext.js`, etc.
- Providers y custom hooks como `useAuth()`.

### ¿Por qué es útil esta separación?
- Centraliza el estado compartido de la app.
- Mejora la estructura al evitar prop drilling excesivo.
- Hace más sencillo el testing y mantenimiento.

### Buenas prácticas
- Separar el contexto y el provider en archivos distintos si es necesario.
- No abusar del contexto para cada cosa (evaluar usar Zustand, Redux, etc.).
