"use client";

import { wpPublicUrl } from "./config";
import type { StoreCart } from "./types";

const CART_TOKEN_KEY = "wc_cart_token";
const STORE_BASE = `${wpPublicUrl}/wp-json/wc/store/v1`;

export function getCartToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_TOKEN_KEY);
}

export function setCartToken(token: string): void {
  localStorage.setItem(CART_TOKEN_KEY, token);
}

function storeHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const cartToken = token ?? getCartToken();
  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }
  return headers;
}

async function parseStoreResponse(res: Response): Promise<StoreCart> {
  const newToken = res.headers.get("Cart-Token");
  if (newToken) {
    setCartToken(newToken);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Store API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<StoreCart>;
}

export async function fetchCart(): Promise<StoreCart> {
  const res = await fetch(`${STORE_BASE}/cart`, {
    credentials: "include",
    headers: storeHeaders(),
  });
  return parseStoreResponse(res);
}

export async function addToCart(
  productId: number,
  quantity = 1,
): Promise<StoreCart> {
  const res = await fetch(`${STORE_BASE}/cart/add-item`, {
    method: "POST",
    credentials: "include",
    headers: storeHeaders(),
    body: JSON.stringify({ id: productId, quantity }),
  });
  return parseStoreResponse(res);
}

export async function updateCartItem(
  key: string,
  quantity: number,
): Promise<StoreCart> {
  const res = await fetch(`${STORE_BASE}/cart/update-item`, {
    method: "POST",
    credentials: "include",
    headers: storeHeaders(),
    body: JSON.stringify({ key, quantity }),
  });
  return parseStoreResponse(res);
}

export async function removeCartItem(key: string): Promise<StoreCart> {
  const res = await fetch(`${STORE_BASE}/cart/remove-item`, {
    method: "POST",
    credentials: "include",
    headers: storeHeaders(),
    body: JSON.stringify({ key }),
  });
  return parseStoreResponse(res);
}

export async function checkoutHandoff(): Promise<string> {
  const token = getCartToken();
  if (!token) {
    throw new Error("Giỏ hàng trống.");
  }

  const res = await fetch(`${wpPublicUrl}/wp-json/sos/v1/checkout-handoff`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Cart-Token": token,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Checkout handoff failed: ${body}`);
  }

  const data = (await res.json()) as { redirect_url: string };
  return data.redirect_url;
}
