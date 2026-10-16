import { api } from "@/shared/api";
import type { Address, AddressValues } from "./types";

export const fetchAddresses = () =>
  api.get<{ items: Address[] }>("/addresses").then((data) => data.items);

export const createAddress = (values: AddressValues) =>
  api.post<{ address: Address }>("/addresses", values).then((data) => data.address);

export const updateAddress = (id: string, values: AddressValues) =>
  api.put<{ address: Address }>(`/addresses/${id}`, values).then((data) => data.address);

export const setDefaultAddress = (id: string) =>
  api.patch<{ address: Address }>(`/addresses/${id}/default`).then((data) => data.address);

export const deleteAddress = (id: string) => api.delete<{ message: string }>(`/addresses/${id}`);