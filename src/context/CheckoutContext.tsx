"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/products";

// =====================================================================
// Checkout context — controls the direct-buy modal (no cart).
// When the visitor clicks "شراء الآن" a modal opens with a form:
// name, phone, address. On submit the order is sent to /api/orders.
// =====================================================================

export type BuyIntent = {
  product: Product;
  color?: string;
  size?: string;
  quantity: number;
};

type Ctx = {
  intent: BuyIntent | null;
  open: (intent: BuyIntent) => void;
  close: () => void;
};

const CheckoutContext = createContext<Ctx | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<BuyIntent | null>(null);

  const open = useCallback((i: BuyIntent) => setIntent(i), []);
  const close = useCallback(() => setIntent(null), []);

  return (
    <CheckoutContext.Provider value={{ intent, open, close }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
