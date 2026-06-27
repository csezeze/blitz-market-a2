"use client";

import { isAddress } from "viem";

const KEY = "blitzmarket.activeAddress.v1";

export function getStoredAddress(): `0x${string}` | "" {
  if (typeof window === "undefined") return "";
  const value = window.localStorage.getItem(KEY);
  return value && isAddress(value) ? (value as `0x${string}`) : "";
}

export function storeAddress(value: string): `0x${string}` | "" {
  if (!isAddress(value)) return "";
  const address = value as `0x${string}`;
  window.localStorage.setItem(KEY, address);
  return address;
}

export function clearAddress() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}
