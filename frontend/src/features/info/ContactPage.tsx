import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

const CONTACT = {
  email: "support@shopora.com",
  phone: "+91 98765 43210",
  hours: "Mon to Sat, 10:00 AM to 7:00 PM",
  address: "Shopora Retail, Sujangarh, Rajasthan, India",
};

const TOPICS = [
  "Order related",
  "Return or refund",
  "Payment issue",
  "Product question",
  "Other",
];

const QUICK_LINKS = [
  { label: "Track your order", to: "/help/track-order" },
  { label: "Returns & refunds", to: "/help/returns" },
  { label: "Shipping information", to: "/help/shipping" },
  { label: "FAQs", to: "/help/faqs" },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  topic: string;
  orderId: string;
  message: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  topic: TOPICS[0],
  orderId: "",
  message: "",
};

const inputCls =
  "w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600";

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "Contact Us | Shopora";
  }, []);

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Enter a valid 10 digit mobile number";
    if (form.message.trim().length < 10)
      e.message = "Please write at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

        const lines = [`Name: ${form.name}`, `Email: ${form.email}`];
    if (form.phone) lines.push(`Phone: ${form.phone}`);
    if (form.orderId) lines.push(`Order ID: ${form.orderId}`);
    lines.push("", form.message);
    const body = lines.join("\n");

    const subject = `[${form.topic}] Message from ${form.name}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div className="bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
            <Link to="/" className="hover:text-red-600">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="font-medium text-gray-900">Contact Us</span>
          </nav>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Koi sawal ya problem hai? Hamari team aapki madad ke liye hai.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
        <section className="rounded-xl border bg-white p-6 sm:p-8">
          <h2 className="border-l-4 border-red-600 pl-3 text-lg font-semibold text-gray-900">
            Send us a message
          </h2>

          {sent && (
            <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              Aapka email app khul gaya hoga. Wahan Send dabate hi message hum tak
              pahunch jayega. Email app na khule to seedha{" "}
              <a className="font-semibold underline" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>{" "}
              par likh do.
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full name *
              </label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                className={inputCls}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Mobile (optional)
              </label>
              <input
                inputMode="numeric"
                maxLength={10}
                className={inputCls}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                placeholder="10 digit number"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Topic</label>
              <select
                className={inputCls}
                value={form.topic}
                onChange={(e) => set("topic", e.target.value)}
              >
                {TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Order ID (optional)
              </label>
              <input
                className={inputCls}
                value={form.orderId}
                onChange={(e) => set("orderId", e.target.value)}
                placeholder="Agar order ke baare mein hai"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Message *
              </label>
              <textarea
                rows={5}
                className={inputCls}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Apni problem ya sawal likho"
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-md bg-red-600 px-8 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                SEND MESSAGE
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Get in touch</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-gray-900">Email</dt>
                <dd>
                  <a className="text-gray-600 hover:text-red-600" href={`mailto:${CONTACT.email}`}>
                    {CONTACT.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Phone</dt>
                <dd>
                  <a
                    className="text-gray-600 hover:text-red-600"
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  >
                    {CONTACT.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Support hours</dt>
                <dd className="text-gray-600">{CONTACT.hours}</dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Address</dt>
                <dd className="text-gray-600">{CONTACT.address}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Quick help</h2>
            <ul className="mt-3 space-y-1">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-red-600"
                  >
                    {l.label}
                    <span aria-hidden>›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}