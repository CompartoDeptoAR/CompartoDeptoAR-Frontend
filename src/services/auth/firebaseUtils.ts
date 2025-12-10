import { getAuth, signOut } from "firebase/auth";

export const limpiarSesionFirebase = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);  
    localStorage.clear();      
    sessionStorage.clear();     
  } catch (error) {
    console.error("Error limpiando sesión Firebase:", error);
  }
};
