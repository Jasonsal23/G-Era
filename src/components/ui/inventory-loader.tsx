'use client';

import { useEffect } from 'react';
import { useInventoryStore } from '@/store/inventory';

// Fetches inventory once on app load and keeps it in the store.
// Add this inside the layout so it runs on every page.
export const InventoryLoader = () => {
  const fetchInventory = useInventoryStore((state) => state.fetchInventory);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return null;
};
