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
  limit,
} from "firebase/firestore";
import { Conversacion, Mensaje, MensajeUI } from "./types";
import { db } from "../../firebase/config";

class ChatService {
  private mensajesCollection = "mensajes";
  private publicacionesCollection = "publicaciones";
  private usuariosCollection = "usuarios";

  
  async enviarMensaje(
    contenido: string,
    idRemitente: string,
    idDestinatario: string,
    idPublicacion: string
  ): Promise<string> {
    const participantes = [idRemitente, idDestinatario].sort();

    const nuevoMensaje: Omit<Mensaje, "id"> = {
      contenido: contenido.trim(),
      idRemitente,
      idDestinatario,
      idPublicacion,
      fechaEnvio: Timestamp.now(),
      leido: false,
      participantes,
    };

    const docRef = await addDoc(
      collection(db, this.mensajesCollection),
      nuevoMensaje
    );
    return docRef.id;
  }


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

    return onSnapshot(
      q,
      (snapshot) => {
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
      },
      (error) => {
        console.error("Error escuchando mensajes:", error);
        callback([]);
      }
    );
  }

  
  async obtenerConversaciones(idUsuario: string): Promise<Conversacion[]> {
    try {
      console.log("📋 Obteniendo conversaciones para usuario:", idUsuario);


      const q = query(
        collection(db, this.mensajesCollection),
        where("participantes", "array-contains", idUsuario),
        orderBy("fechaEnvio", "desc") 
      );

      const snapshot = await getDocs(q);
      console.log("📨 Total de mensajes encontrados:", snapshot.size);


      const mensajesPorPublicacion = new Map<string, Mensaje[]>();

      snapshot.docs.forEach((docSnap) => {
        const mensaje = { id: docSnap.id, ...docSnap.data() } as Mensaje;
        const key = mensaje.idPublicacion;

        if (!mensajesPorPublicacion.has(key)) {
          mensajesPorPublicacion.set(key, []);
        }
        mensajesPorPublicacion.get(key)!.push(mensaje);
      });

      console.log("💬 Conversaciones agrupadas:", mensajesPorPublicacion.size);

      const conversaciones: Conversacion[] = [];

      for (const [idPublicacion, mensajes] of mensajesPorPublicacion.entries()) {
 
        const mensajesOrdenados = mensajes.sort(
          (a, b) => b.fechaEnvio.toMillis() - a.fechaEnvio.toMillis()
        );

        const ultimoMensaje = mensajesOrdenados[0];


        const idOtraPersona =
          ultimoMensaje.idRemitente === idUsuario
            ? ultimoMensaje.idDestinatario
            : ultimoMensaje.idRemitente;

        console.log("👤 Otra persona en conversación:", idOtraPersona);

        const noLeidos = mensajes.filter(
          (m) => !m.leido && m.idDestinatario === idUsuario
        ).length;

 
        const [publicacion, otraPersona] = await Promise.all([
          this.obtenerPublicacion(idPublicacion),
          this.obtenerUsuario(idOtraPersona),
        ]);

        conversaciones.push({
          idPublicacion,
          tituloPublicacion: publicacion?.titulo || "Publicación eliminada",
          idOtraPersona,
          nombreOtraPersona: otraPersona?.nombre || "Usuario",
          fotoOtraPersona: otraPersona?.fotoPerfil,
          ultimoMensaje: ultimoMensaje.contenido,
          fechaUltimoMensaje: ultimoMensaje.fechaEnvio.toDate(),
          noLeidos,
          esUltimoMensajePropio: ultimoMensaje.idRemitente === idUsuario,
        });
      }

    
      const conversacionesOrdenadas = conversaciones.sort(
        (a, b) => b.fechaUltimoMensaje.getTime() - a.fechaUltimoMensaje.getTime()
      );

      console.log("✅ Conversaciones procesadas:", conversacionesOrdenadas.length);
      return conversacionesOrdenadas;

    } catch (error) {
      console.error("❌ Error obteniendo conversaciones:", error);
      return [];
    }
  }

  escucharConversaciones(
    idUsuario: string,
    callback: (conversaciones: Conversacion[]) => void
  ): () => void {
    const q = query(
      collection(db, this.mensajesCollection),
      where("participantes", "array-contains", idUsuario)
    );

    return onSnapshot(
      q,
      async () => {
        console.log("🔄 Conversaciones actualizadas en tiempo real");
        const conversaciones = await this.obtenerConversaciones(idUsuario);
        callback(conversaciones);
      },
      (error) => {
        console.error("Error escuchando conversaciones:", error);
        callback([]);
      }
    );
  }


  async marcarComoLeidos(idsMensajes: string[]): Promise<void> {
    if (idsMensajes.length === 0) return;

    try {
      const promises = idsMensajes.map((id) =>
        updateDoc(doc(db, this.mensajesCollection, id), { leido: true })
      );
      await Promise.all(promises);
      console.log("✅ Mensajes marcados como leídos:", idsMensajes.length);
    } catch (error) {
      console.error("Error marcando mensajes como leídos:", error);
    }
  }


  async contarNoLeidos(idUsuario: string): Promise<number> {
    try {
      const q = query(
        collection(db, this.mensajesCollection),
        where("idDestinatario", "==", idUsuario),
        where("leido", "==", false)
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error("Error contando no leídos:", error);
      return 0;
    }
  }


  escucharNoLeidos(
    idUsuario: string,
    callback: (count: number) => void
  ): () => void {
    const q = query(
      collection(db, this.mensajesCollection),
      where("idDestinatario", "==", idUsuario),
      where("leido", "==", false)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.size);
      },
      (error) => {
        console.error("Error escuchando no leídos:", error);
        callback(0);
      }
    );
  }

  async iniciarConversacion(
    idRemitente: string,
    idDestinatario: string,
    idPublicacion: string,
    mensajeInicial: string
  ): Promise<string> {
    return this.enviarMensaje(
      mensajeInicial,
      idRemitente,
      idDestinatario,
      idPublicacion
    );
  }

  
  async existeConversacion(
    idUsuario: string,
    idPublicacion: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.mensajesCollection),
        where("idPublicacion", "==", idPublicacion),
        where("participantes", "array-contains", idUsuario),
        limit(1)
      );

      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error verificando conversación:", error);
      return false;
    }
  }


  private async obtenerPublicacion(
    id: string
  ): Promise<{ titulo: string } | null> {
    try {
      const docRef = doc(db, this.publicacionesCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { titulo: data.titulo };
      }
      
      return null;
    } catch (error) {
      console.error("❌ Error obteniendo publicación:", error);
      return null;
    }
  }

  private async obtenerUsuario(
    firebaseUid: string
  ): Promise<{ nombre: string; fotoPerfil?: string } | null> {
    try {
      const q = query(
        collection(db, this.usuariosCollection),
        where("firebaseUid", "==", firebaseUid)
      );

      const querySnap = await getDocs(q);

      if (querySnap.empty) {
        console.warn("⚠️ No se encontró usuario con firebaseUid:", firebaseUid);
        return null;
      }

      const doc = querySnap.docs[0];
      const data = doc.data();

      const nombre =
        data.perfil?.nombreCompleto ||
        data.nombre ||
        data.displayName ||
        data.email?.split('@')[0] ||
        "Usuario";

      return {
        nombre,
        fotoPerfil: data.perfil?.fotoPerfil || data.photoURL,
      };

    } catch (error) {
      console.error("❌ Error obteniendo usuario:", error);
      return null;
    }
  }
}

export default new ChatService();