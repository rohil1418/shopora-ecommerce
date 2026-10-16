import type { Address } from "../types";

type Props = {
  address: Pick<
    Address,
    "fullName" | "phone" | "addressLine1" | "addressLine2" | "city" | "state" | "pincode"
  >;
};

export default function AddressLines({ address }: Props) {
  return (
    <div className="space-y-0.5 text-sm text-gray-600">
      <p className="font-bold text-gray-900">{address.fullName}</p>
      <p>
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ""}
      </p>
      <p>
        {address.city}, {address.state} - {address.pincode}
      </p>
      <p>
        Mobile: <span className="font-semibold text-gray-800">{address.phone}</span>
      </p>
    </div>
  );
}