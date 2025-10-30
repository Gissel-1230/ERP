"use client";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface AlertOptions {
  title?: string;
  text?: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
  confirmButtonText?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  // Añade aquí más configuraciones de Swal que necesites
  confirmButtonColor?: string,
  cancelButtonColor?: string, 
}

export function showAlert(options: AlertOptions) {
 return MySwal.fire({
    title: options.title ?? "Aviso",
    text: options.text,
    icon: options.icon ?? "info",
    confirmButtonText: options.confirmButtonText ?? "Aceptar",
    confirmButtonColor: options.confirmButtonColor ?? undefined,
    showCancelButton: options.showCancelButton ?? false,
    cancelButtonText: options.cancelButtonText ?? "Cancelar",
    cancelButtonColor: options.cancelButtonColor ?? undefined,
  });
}
