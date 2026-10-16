export const ADDRESS_LABELS = ["home", "work", "other"] as const;
export type AddressLabel = (typeof ADDRESS_LABELS)[number];

export type AddressValues = {
  label: AddressLabel;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export type Address = AddressValues & { id: string };