import { create } from 'zustand';

interface InventoryEntry {
  product_id: string;
  variant_label: string;
  quantity: number;
}

interface InventoryStore {
  inventory: InventoryEntry[];
  loading: boolean;
  fetchInventory: () => Promise<void>;
  getStock: (productId: string, variantLabel: string) => number;
  isInStock: (productId: string, variantLabel: string) => boolean;
  // For products without variants (checks all sizes > 0)
  hasAnyStock: (productId: string) => boolean;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventory: [],
  loading: true,

  fetchInventory: async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      set({ inventory: data.inventory ?? [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getStock: (productId, variantLabel) => {
    const entry = get().inventory.find(
      (row) => row.product_id === productId && row.variant_label === variantLabel
    );
    return entry?.quantity ?? 0;
  },

  isInStock: (productId, variantLabel) => {
    return get().getStock(productId, variantLabel) > 0;
  },

  hasAnyStock: (productId) => {
    return get().inventory.some(
      (row) => row.product_id === productId && row.quantity > 0
    );
  },
}));
