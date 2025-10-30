// components/almacenes/RegisterInitialStockModal.tsx
"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
// Importamos los tipos y stores necesarios
import { getProducts } from "@/lib/product-store";
import { GlobalProduct, CategoryItem } from "@/lib/data";
import { getCategories } from "@/lib/category-store";
import { useAuth } from "@/app/context/AuthContext";
import { showAlert } from "../common/sweetAlert";
// Definición de las propiedades del modal
interface RegisterInitialStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  // La función onSave ahora recibe los 4 datos clave para el movimiento.
  onSave: (data: {
    product_id: number;
    warehouse_id: number; // Añadido para consistencia con el controlador
    quantity: number;
    description: string;
    movement_type: "IN";
  }) => Promise<void>;
  warehouseId: string; // El ID del almacén actual (formato ALM-X)
  isSaving: boolean;
  saveError: string | null;
}

export default function RegisterInitialStockModal({
  isOpen,
  onClose,
  onSave,
  warehouseId,
  isSaving,
  saveError,
}: RegisterInitialStockModalProps) {
  const { token } = useAuth();

  // Estados para los selects y la cantidad
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<GlobalProduct[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>(
    ""
  );
  const [selectedProductId, setSelectedProductId] = useState<string | number>(
    ""
  );
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [isLoadingSelects, setIsLoadingSelects] = useState(true);

  // --- 1. CARGA INICIAL: Obtener Categorías y Productos Globales ---
  useEffect(() => {
    if (!isOpen || !token) {
      setIsLoadingSelects(false);
      return;
    }

    const loadData = async () => {
      try {
        // Carga paralela de categorías y productos
        const [categoryData, productData] = await Promise.all([
          getCategories(token),
          getProducts(token),
        ]);

        setCategories(categoryData);
        setProducts(productData);

        // Establecer la primera categoría como seleccionada por defecto
        if (categoryData.length > 0) {
          setSelectedCategoryId(categoryData[0].id);
        }
      } catch (error) {
        console.error("Error al cargar selects:", error);
      } finally {
        setIsLoadingSelects(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token]);

  // --- 2. LÓGICA DE FILTRADO (Productos dependen de la Categoría seleccionada) ---
  const filteredProducts = products.filter((p) => {
    // Obtenemos el ID numérico de la categoría seleccionada (ej: 'INV-4' -> 4)
    const numericCategoryId =
      String(selectedCategoryId).split("-")[1] || selectedCategoryId;

    // El product.category_id es numérico, por eso solo comparamos los números
    return String(p.category_id) === String(numericCategoryId);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || isLoadingSelects) return;

    const quantityValue = parseInt(quantity, 10);
    const rawProductId = String(selectedProductId).split("-")[1]; // Limpiamos el prefijo PROD-
    const rawWarehouseId = warehouseId.split("-")[1]; // Limpiamos el prefijo ALM-

    if (!rawProductId || quantityValue <= 0) {
      //alert("Por favor, selecciona un producto y una cantidad mayor a cero.");
      showAlert({
        title: "Información incompleta",
        text: "La descripción (razón del ajuste) es obligatoria.",
        icon: "warning",
      });
      return;
    }

    // Llamada a la función onSave (que llama al POST /inventory/movement)
    onSave({
      product_id: parseInt(rawProductId, 10),
      warehouse_id: parseInt(rawWarehouseId, 10), // <-- ID Numérico del almacén actual
      quantity: quantityValue,
      description:
        description || `Entrada inicial de stock al Almacén ${rawWarehouseId}.`,
      movement_type: "IN",
    });
  };

  if (!isOpen) return null;

  // --- Renderizado JSX ---
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Registrar Stock Inicial
        </h2>
        <p className="text-sm text-slate-500 mb-4">Almacén ID: {warehouseId}</p>

        {saveError && (
          <p className="text-sm text-red-600 text-center py-2">{saveError}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Select de Categoría */}
          <div>
            <label htmlFor="select-category">Categoría del Producto</label>
            <select
              id="select-category"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              disabled={isLoadingSelects || isSaving}
              className="mt-1 w-full rounded-lg border-slate-300 dark:bg-slate-700 disabled:opacity-50"
            >
              {isLoadingSelects && <option value="">Cargando...</option>}
              {!isLoadingSelects && (
                <option value="" disabled>
                  Seleccionar Categoría
                </option>
              )}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Select de Producto (Dependiente de Categoría) */}
          <div>
            <label htmlFor="select-product">Producto</label>
            <select
              id="select-product"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              disabled={
                isLoadingSelects ||
                isSaving ||
                !selectedCategoryId ||
                filteredProducts.length === 0
              }
              required
              className="mt-1 w-full rounded-lg border-slate-300 dark:bg-slate-700 disabled:opacity-50"
            >
              <option value="">Seleccionar Producto</option>
              {filteredProducts.map((prod) => (
                <option key={prod.product_id} value={prod.product_id}>
                  {prod.product_name} (${prod.unit_price.toFixed(2)})
                </option>
              ))}
            </select>
            {filteredProducts.length === 0 &&
              !isLoadingSelects &&
              selectedCategoryId && (
                <p className="text-xs text-orange-500 mt-1">
                  No hay productos en esta categoría.
                </p>
              )}
          </div>

          {/* Cantidad de Entrada */}
          <div>
            <label htmlFor="input-quantity">Cantidad de Entrada</label>
            <input
              id="input-quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              disabled={isSaving}
              min="1"
              className="mt-1 w-full rounded-lg disabled:opacity-50"
            />
          </div>

          {/* Descripción del Movimiento */}
          <div>
            <label htmlFor="input-description">Razón del Movimiento</label>
            <textarea
              id="input-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              disabled={isSaving}
              className="mt-1 w-full rounded-lg disabled:opacity-50"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white flex items-center"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Registrar Entrada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
