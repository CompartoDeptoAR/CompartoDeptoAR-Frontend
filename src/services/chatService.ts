import {
  collection,
  query,
  where,
  addDoc,
  onSnapshot,
  orderBy,
  doc,
  serverTimestamp,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Obtener conversación existente entre dos usuarios o crearla
export const obtenerOCrearConversacion = async (uid1: string, uid2: string) => {
  const ref = collection(db, "conversaciones");

  const q = query(ref, where("participantes", "array-contains", uid1));
  const snap = await getDocs(q);

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (data.participantes.includes(uid2)) {
      return docSnap.id;
    }
  }

  const nueva = await addDoc(ref, {
    participantes: [uid1, uid2],
    ultimaActualizacion: serverTimestamp(),
  });

  return nueva.id;
};

// Enviar un mensaje
export const enviarMensaje = async (conversacionId: string, emisorId: string, texto: string) => {
  const ref = collection(db, `conversaciones/${conversacionId}/mensajes`);

  await addDoc(ref, {
    emisorId,
    texto,
    timestamp: serverTimestamp(),
  });

  await updateDoc(doc(db, "conversaciones", conversacionId), {
    ultimaActualizacion: serverTimestamp(),
  });
};

// Listener de mensajes
export const escucharMensajes = (conversacionId: string, callback: (msgs: any[]) => void) => {
  const ref = collection(db, `conversaciones/${conversacionId}/mensajes`);
  const q = query(ref, orderBy("timestamp"));

  return onSnapshot(q, (snap) => {
    const mensajes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(mensajes);
  });
};

// Listener de conversaciones del usuario
export const escucharConversacionesUsuario = (uid: string, callback: (chats: any[]) => void) => {
  const ref = collection(db, "conversaciones");

  const q = query(ref, where("participantes", "array-contains", uid));

  return onSnapshot(q, (snap) => {
    const convos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(convos);
  });
};
