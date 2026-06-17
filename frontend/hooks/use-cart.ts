"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import {
  addToCart,
  checkoutHandoff,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/store-api";
import type { StoreCart } from "@/lib/types";

const emptyCart = (): StoreCart => ({
  items: [],
  items_count: 0,
  totals: {
    total_items: "0",
    total_price: "0",
    currency_minor_unit: 0,
  },
});

export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: fetchCart,
    retry: 1,
    staleTime: 30_000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity = 1,
    }: {
      productId: number;
      quantity?: number;
    }) => addToCart(productId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data);
      toast.success("Đã thêm vào giỏ");
    },
    onError: () => {
      toast.error("Không thể thêm vào giỏ. Vui lòng thử lại.");
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, quantity }: { key: string; quantity: number }) =>
      updateCartItem(key, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data);
    },
    onError: () => {
      toast.error("Không thể cập nhật số lượng.");
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => removeCartItem(key),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data);
      toast.success("Đã xóa sản phẩm");
    },
    onError: () => {
      toast.error("Không thể xóa sản phẩm.");
    },
  });
}

export function useCheckoutHandoff() {
  return useMutation({
    mutationFn: checkoutHandoff,
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Checkout thất bại.",
      );
    },
  });
}

export { emptyCart };
