# Carpeta: utils/

### ¿Qué contiene?
Funciones utilitarias o helpers generales que no dependen de componentes específicos. Se usan para tareas comunes o repetitivas.

### ¿Qué va aquí?
- Formateadores (`formatFecha.js`, `formatMoneda.js`)
- Validadores (`isEmail.js`, `isPasswordStrong.js`)
- Helpers de lógica (`calcularDescuento.js`, `ordenarArray.js`)
- Cualquier función reutilizable no ligada a UI

### ¿Por qué es útil esta separación?
- Evita duplicación de lógica en diferentes partes del código.
- Mejora la legibilidad y testeo del código.
- Favorece el principio de responsabilidad única.

### Buenas prácticas
- Agrupar funciones por tipo si la carpeta crece mucho.
- Escribir tests unitarios para estos helpers.
- Mantener funciones puras, sin efectos secundarios.
