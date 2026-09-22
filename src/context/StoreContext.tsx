"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/products";

// =====================================================================
// Store Context — manages Cart + Wishlist persisted in localStorage
// =====================================================================

export type CartItem = {
  id: number;
  qty: number;
  color?: string;
  size?: string;
};

type StoreContextValue = {
  cart: CartItem[];
  wishlist: number[];
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (p: Product, qty?: number, color?: string, size?: string) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  cartCount: number;
  cartTotal: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "vior_cart_v1";
const WISH_KEY = "vior_wish_v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on client
  useEffect(() => {
    setCart(safeParse<CartItem[]>(localStorage.getItem(CART_KEY), []));
    setWishlist(safeParse<number[]>(localStorage.getItem(WISH_KEY), []));
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback(
    (p: Product, qty = 1, color?: string, size?: string) => {
      setCart((prev) => {
        const key = `${p.id}-${color ?? ""}-${size ?? ""}`;
        const existing = prev.find(
          (x) => `${x.id}-${x.color ?? ""}-${x.size ?? ""}` === key,
        );
        if (existing) {
          return prev.map((x) =>
            x === existing ? { ...x, qty: x.qty + qty } : x,
          );
        }
        return [...prev, { id: p.id, qty, color, size }];
      });
      setCartOpen(true);
    },
    [],
  );

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))
        .filter((x) => x.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const isWishlisted = useCallback(
    (id: number) => wishlist.includes(id),
    [wishlist],
  );

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  // Compute totals using the products data lazily
  const { cartCount, cartTotal } = useMemo(() => {
    let count = 0;
    let total = 0;
    // dynamic import-free lookup via global cache
    const lookup = (globalThis as any).__VIOR_PRODUCTS__;
    for (const item of cart) {
      count += item.qty;
      const p = lookup?.[item.id];
      if (p) total += p.price * item.qty;
    }
    return { cartCount: count, cartTotal: total };
  }, [cart]);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        cartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleWishlist,
        isWishlisted,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

// Register products lookup for totals calculation without circular imports.
// Called from a client module that imports products.
export function registerProductsLookup(map: Record<number, { price: number }>) {
  (globalThis as any).__VIOR_PRODUCTS__ = map;
}
