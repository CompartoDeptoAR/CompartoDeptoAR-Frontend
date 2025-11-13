import type { PreferenciasUsuario } from "./Usuario";


export interface Publicacion{
    titulo:string;
    ubicacion:string;
    precio:number;
    descripcion:string;
    foto:string;
    reglas: string;
    preferencia: PreferenciasUsuario;
}


/*
El formulario de publicación debe incluir los siguientes campos obligatorios:
Título del anuncio
Ubicación (dirección o ciudad)
Precio del alquiler
Descripción de la vivienda
El usuario debe poder agregar información adicional opcional:
Fotos de la vivienda
Reglas o condiciones del hogar
Preferencias del compañero (ej. no fumador, sin mascotas)
Todos los campos obligatorios deben validarse antes de enviar la publicación.
Si algún campo obligatorio está vacío, el sistema debe mostrar un mensaje de error claro.
Tras enviar el formulario correctamente, la publicación debe guardarse y mostrarse en la lista de anuncios activos.
El sistema debe mostrar un mensaje de confirmación cuando la publicación se cree exitosamente.
*/