// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  // 1. Rutas de contenido actualizadas para tu estructura de Next.js App Router
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  
  theme: {
    extend: {
      // Aquí puedes extender la paleta de colores, fuentes, etc. si lo necesitas
    },
  },

  // 2. Plugin de formularios agregado
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;