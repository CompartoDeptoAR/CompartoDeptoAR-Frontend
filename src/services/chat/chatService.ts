import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { Conversacion, Mensaje, MensajeUI } from "./ types";
import { db } from "../../firebase/config";


class ChatService {
  private mensajesCollection = "mensajes";
  private publicacionesCollection = "publicaciones";
  private usuariosCollection = "usuarios";

  // ==================== ENVIAR MENSAJE ====================
  async enviarMensaje(
    contenido: string,
    idRemitente: string,
    idDestinatario: string,
    idPublicacion: string
  ): Promise<string> {
    const nuevoMensaje: Omit<Mensaje, "id"> = {
      contenido: contenido.trim(),
      idRemitente,
      idDestinatario,
      idPublicacion,
      fechaEnvio: Timestamp.now(),
      leido: false,
      participantes: [idRemitente, idDestinatario],
    };

    const docRef = await addDoc(collection(db, this.mensajesCollection), nuevoMensaje);
    return docRef.id;
  }

  // ==================== ESCUCHAR MENSAJES EN TIEMPO REAL ====================
  escucharMensajes(
    idPublicacion: string,
    idUsuarioActual: string,
    callback: (mensajes: MensajeUI[]) => void
  ): () => void {
    const q = query(
      collection(db, this.mensajesCollection),
      where("idPublicacion", "==", idPublicacion),
      where("participantes", "array-contains", idUsuarioActual),
      orderBy("fechaEnvio", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      const mensajes: MensajeUI[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Mensaje;
        return {
          id: doc.id,
          contenido: data.contenido,
          esPropio: data.idRemitente === idUsuarioActual,
          fechaEnvio: data.fechaEnvio.toDate(),
          leido: data.leido,
        };
      });
      callback(mensajes);
    });
  }

  // ==================== OBTENER CONVERSACIONES ====================
  async obtenerConversaciones(idUsuario: string): Promise<Conversacion[]> {
    const q = query(
      collection(db, this.mensajesCollection),
      where("participantes", "array-contains", idUsuario),
      orderBy("fechaEnvio", "desc")
    );

    const snapshot = await getDocs(q);
    const conversacionesMap = new Map<string, Conversacion>();

    for (const docSnap of snapshot.docs) {
      const mensaje = { id: docSnap.id, ...docSnap.data() } as Mensaje;
      const key = mensaje.idPublicacion;

      if (!conversacionesMap.has(key)) {
        const idOtraPersona =
          mensaje.idRemitente === idUsuario
            ? mensaje.idDestinatario
            : mensaje.idRemitente;

        // Obtener info de la publicación y usuario
        const [publicacion, otraPersona] = await Promise.all([
          this.obtenerPublicacion(mensaje.idPublicacion),
          this.obtenerUsuario(idOtraPersona),
        ]);

        conversacionesMap.set(key, {
          idPublicacion: mensaje.idPublicacion,
          tituloPublicacion: publicacion?.titulo || "Publicación",
          idOtraPersona,
          nombreOtraPersona: otraPersona?.nombre || "Usuario",
          fotoOtraPersona: otraPersona?.fotoPerfil,
          ultimoMensaje: mensaje.contenido,
          fechaUltimoMensaje: mensaje.fechaEnvio.toDate(),
          noLeidos: 0,
          esUltimoMensajePropio: mensaje.idRemitente === idUsuario,
        });
      }

      // Contar no leídos
      const conv = conversacionesMap.get(key)!;
      if (!mensaje.leido && mensaje.idDestinatario === idUsuario) {
        conv.noLeidos++;
      }

      // Actualizar último mensaje si es más reciente
      if (mensaje.fechaEnvio.toMillis() > conv.fechaUltimoMensaje.getTime()) {
        conv.ultimoMensaje = mensaje.contenido;
        conv.fechaUltimoMensaje = mensaje.fechaEnvio.toDate();
        conv.esUltimoMensajePropio = mensaje.idRemitente === idUsuario;
      }
    }

    return Array.from(conversacionesMap.values()).sort(
      (a, b) => b.fechaUltimoMensaje.getTime() - a.fechaUltimoMensaje.getTime()
    );
  }

  // ==================== ESCUCHAR CONVERSACIONES EN TIEMPO REAL ====================
  escucharConversaciones(
    idUsuario: string,
    callback: (conversaciones: Conversacion[]) => void
  ): () => void {
    const q = query(
      collection(db, this.mensajesCollection),
      where("participantes", "array-contains", idUsuario)
    );

    return onSnapshot(q, async () => {
      const conversaciones = await this.obtenerConversaciones(idUsuario);
      callback(conversaciones);
    });
  }

  // ==================== MARCAR COMO LEÍDOS ====================
  async marcarComoLeidos(idsMensajes: string[]): Promise<void> {
    const promises = idsMensajes.map((id) =>
      updateDoc(doc(db, this.mensajesCollection, id), { leido: true })
    );
    await Promise.all(promises);
  }

  // ==================== CONTAR NO LEÍDOS ====================
  async contarNoLeidos(idUsuario: string): Promise<number> {
    const q = query(
      collection(db, this.mensajesCollection),
      where("idDestinatario", "==", idUsuario),
      where("leido", "==", false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  // ==================== ESCUCHAR CONTADOR NO LEÍDOS ====================
  escucharNoLeidos(idUsuario: string, callback: (count: number) => void): () => void {
    const q = query(
      collection(db, this.mensajesCollection),
      where("idDestinatario", "==", idUsuario),
      where("leido", "==", false)
    );

    return onSnapshot(q, (snapshot) => {
      callback(snapshot.size);
    });
  }

  // ==================== HELPERS ====================
  private async obtenerPublicacion(id: string): Promise<{ titulo: string } | null> {
    try {
      const docRef = doc(db, this.publicacionesCollection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { titulo: docSnap.data().titulo };
      }
      return null;
    } catch {
      return null;
    }
  }

  private async obtenerUsuario(
    id: string
  ): Promise<{ nombre: string; fotoPerfil?: string } | null> {
    try {
      const docRef = doc(db, this.usuariosCollection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          nombre: data.perfil?.nombreCompleto || data.nombre || "Usuario",
          fotoPerfil: data.perfil?.fotoPerfil,
        };
      }
      return null;
    } catch {
      return null;
    }
  }
}

export default new ChatService();