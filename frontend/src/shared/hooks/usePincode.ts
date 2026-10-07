import { usePersistentState } from "./usePersistentState";

export const DEFAULT_PINCODE = "110001";

export const isValidPincode = (value: string): boolean => /^\d{6}$/.test(value);

export function usePincode() {
  return usePersistentState<string>("shopora-pincode", DEFAULT_PINCODE);
}