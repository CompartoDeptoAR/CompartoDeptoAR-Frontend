
export const getUserRole = () => localStorage.getItem("role");
export const isLoggedIn = () => !!localStorage.getItem("token");
