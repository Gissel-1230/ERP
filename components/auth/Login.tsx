// components/auth/Login.tsx

"use client";

import { useState } from "react";

// Tipos para el estado del formulario y los errores, para máxima seguridad de tipos.
interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

type FormErrors = Partial<Record<keyof Omit<FormData, 'rememberMe'>, string>>;

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del correo es inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    // Simulación de llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Login attempt:", formData);
    alert("Login exitoso (Demo)");
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg width="24" height="24" viewBox="0 0 40 40" fill="currentColor">
                  <rect width="40" height="40" rx="8" fill="none" />
                  <path d="M12 14h16v2H12v-2zm0 4h16v2H12v-2zm0 4h12v2H12v-2z" />
                  <circle cx="30" cy="22" r="3" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-800">DataBridge</h1>
            </div>
            <p className="text-md text-slate-500">
              Accede a tu panel de control empresarial
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@empresa.com"
                className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2 
                  ${errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2 
                  ${errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="select-none text-sm text-slate-600">Recordarme</span>
              </label>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-3 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:hover:translate-y-0"
            >
              {isLoading && <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>}
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              ¿Necesitas ayuda?{' '}
              <a href="#" className="font-medium text-indigo-600 hover:underline">
                Contacta a soporte
              </a>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default Login;