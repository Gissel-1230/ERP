// components/traspasos/EditTraspasoModal.tsx
"use client";
import { useState, useEffect } from 'react';
import { type Traspaso } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { updateTraspaso } from '@/lib/traspasos-store';
import { useAuth } from '@/app/context/AuthContext';

interface EditTraspasoModalProps {
  isOpen: boolean;
  onClose: () => void;
  traspaso: Traspaso | null;
  onSave: () => void; // Para refrescar la tabla
}

export default function EditTraspasoModal({ isOpen, onClose, traspaso, onSave }: EditTraspasoModalProps) {
  const { token } = useAuth();
  const [cantidad, setCantidad] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usamos 'status' (minúsculas) como viene del store
  const isPending = traspaso?.status === 'pending'; 

  useEffect(() => {
    if (isOpen && traspaso) {
      // Usamos los nombres de propiedad correctos
      setCantidad(String(traspaso.quantity)); 
      setObservaciones(traspaso.observations || ''); 
      setError(null);
    } else if (!isOpen) {
      setIsSaving(false);
    }
  }, [isOpen, traspaso]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!traspaso) return;
 
    setIsSaving(true);
    setError(null);

    try {
      await updateTraspaso(
        traspaso.id,
        { 
          quantity: isPending ? parseInt(cantidad, 10) : undefined, 
          observations: observaciones 
        },
        token
      );
      onSave(); // Refresca la tabla
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !traspaso) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold">Editar Traspaso - {traspaso.folio}</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label>Producto</label>
            <input type="text" value={traspaso.product_name} disabled className="mt-1 w-full rounded-lg bg-slate-100 dark:bg-slate-700" />
          </div>
          <div>
            <label>Cantidad</label>
            <input 
              type="number" 
              value={cantidad} 
              onChange={(e) => setCantidad(e.target.value)} 
              required 
              disabled={!isPending || isSaving}
              className={`mt-1 w-full rounded-lg ${!isPending ? 'bg-slate-100 dark:bg-slate-700' : ''}`}
          />
            {!isPending && <p className="text-xs text-orange-500 mt-1">La cantidad no se puede editar en un traspaso ya procesado.</p>}
          </div>
          <div>
            <label>Observaciones</label>
            <textarea 
              value={observaciones} 
              onChange={(e) => setObservaciones(e.target.value)} 
              disabled={isSaving}
              rows={4} 
              className="mt-1 w-full rounded-lg" 
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}