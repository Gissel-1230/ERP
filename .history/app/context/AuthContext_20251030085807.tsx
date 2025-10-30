'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'; // <-- Añade ReactNode
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

// --- 1. Definir la forma del Contexto ---
interface AuthContextType {
  user: UserPayload | null; // Tipado más específico si tienes la interfaz UserPayload
  token: string | null;     // <-- Añadimos el token al tipo
  login: (token: string, userData: UserPayload) => void;
  logout: () => void;
  isLoading: boolean;       // <-- Renombrado para claridad
}

// Interfaz para el payload del usuario (ajusta según tu payload real)
interface UserPayload {
    user_id: number; // O string si es UUID
    role_id: number;
    full_name: string; // <-- AÑADIR ESTA LÍNEA
    email: string;
}

// Creamos el contexto con un valor inicial undefined o un objeto por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 2. Modificar el AuthProvider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => { // <-- Tipado para children
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);       // <-- Estado para el token
  const [isLoading, setIsLoading] = useState(true); // <-- Renombrado
  const router = useRouter();

  useEffect(() => {
    console.log("AuthProvider useEffect: Verificando sesión...");
    // Leemos el token DE LA COOKIE
    const storedToken = Cookies.get('token');
    // Leemos los datos del usuario DE LOCALSTORAGE (como lo hacía tu login)
    const storedUserString = localStorage.getItem('user'); 
    
    //console.log("AuthProvider useEffect: Token en cookie:", storedToken);
    //console.log("AuthProvider useEffect: User en localStorage:", storedUserString);

    if (storedToken && storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        setToken(storedToken); // <-- Guardamos el token en el estado
        setUser(storedUser);   // <-- Guardamos el user en el estado
        console.log("AuthProvider useEffect: Sesión restaurada.");
      } catch (e) {
        console.error("AuthProvider useEffect: Error al parsear datos de usuario", e);
        // Si hay error, limpiamos todo
        Cookies.remove("token", { path: "/" });
        localStorage.removeItem("user");
      }
    } else {
        console.log("AuthProvider useEffect: No se encontró sesión guardada.");
    }
    setIsLoading(false); // <-- Indicamos que terminó de cargar
  }, []);

  const login = (newToken: string, userData: UserPayload) => {
    console.log("AuthProvider login: Guardando sesión...");
    // Guardamos token en COOKIE (consistente con tu login page)
    Cookies.set("token", newToken, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: 8 / 24 // 8 horas
    });
    // Guardamos user data en LOCALSTORAGE (consistente con tu login page)
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(newToken); // <-- Actualizamos estado del token
    setUser(userData);  // <-- Actualizamos estado del user
    console.log("AuthProvider login: Sesión guardada, redirigiendo...");
    router.push('/dashboard'); // Redirige después de guardar
  };

  const logout = () => {
    console.log("AuthProvider logout: Cerrando sesión...");
    Cookies.remove("token", { path: "/" });      // <-- Elimina cookie
    localStorage.removeItem("user");          // <-- Elimina localStorage
    setToken(null);                           // <-- Limpia estado del token
    setUser(null);                            // <-- Limpia estado del user
    console.log("AuthProvider logout: Sesión cerrada, redirigiendo...");
    router.push("/");                         // Redirige al login
  };

  // --- 3. Proveer el token y isLoading en el value ---
  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 4. Hook useAuth (con verificación) ---
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};