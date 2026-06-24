import { getAccountingEntries } from "@/lib/assoconnect";

export const metadata = {
  title: "Écritures comptables",
};

export const dynamic = "force-dynamic";

function formatAmount(amount: { amount: number; currency: string } | number, currency?: string) {
  const value = typeof amount === "object" ? amount.amount / 100 : amount / 100;
  const curr = typeof amount === "object" ? amount.currency : (currency ?? "EUR");
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: curr }).format(value);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(dateStr));
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  CASH_IN: { label: "Encaissement", color: "#dcfce7 #16a34a" },
  CASH_OUT: { label: "Décaissement", color: "#fee2e2 #dc2626" },
  TRANSFER: { label: "Virement", color: "#eff6ff #3b5bf6" },
  PURCHASE: { label: "Achat", color: "#fff7ed #ea580c" },
  SALE: { label: "Vente", color: "#f0fdf4 #15803d" },
};

function TypeBadge({ type }: { type: string }) {
  const config = TYPE_LABELS[type];
  const [bg, text] = config ? config.color.split(" ") : ["#f3f4f6", "#6b7280"];
  return (
    <span
      style={{ backgroundColor: bg, color: text }}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    >
      {config?.label ?? type}
    </span>
  );
}

export default async function AccountingPage() {
  let entries = null;
  let error = null;

  try {
    entries = await getAccountingEntries(1, 50);
  } catch (e) {
    error = String(e);
  }

  return (
    <div style={{ fontFamily: "'Figtree', 'Inter', sans-serif", backgroundColor: "#f8f9ff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#3b5bf6" }} className="px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium mb-1" style={{ color: "#a5b4fd" }}>Comptabilité</p>
          <h1 className="text-3xl font-bold text-white">Écritures comptables</h1>
          {entries && (
            <p className="mt-1 text-sm" style={{ color: "#c7d2fe" }}>
              {entries["hydra:totalItems"].toLocaleString("fr-FR")} écriture{entries["hydra:totalItems"] !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {error && (
          <div className="rounded-xl p-4 mb-6 text-sm font-medium" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}>
            Erreur lors du chargement : {error}
          </div>
        )}

        {entries && entries["hydra:member"].length === 0 && (
          <div className="rounded-xl p-12 text-center" style={{ backgroundColor: "#fff" }}>
            <p className="text-gray-400">Aucune écriture trouvée.</p>
          </div>
        )}

        {entries && entries["hydra:member"].length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(59,91,246,0.06)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #eef1ff" }}>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b95b0" }}>Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b95b0" }}>Libellé</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b95b0" }}>Type</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b95b0" }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {entries["hydra:member"].map((entry, i) => (
                  <tr
                    key={entry.id}
                    style={{
                      borderBottom: i < entries["hydra:member"].length - 1 ? "1px solid #f3f4f8" : "none",
                    }}
                    className="transition-colors duration-150 hover:bg-[#f8f9ff]"
                  >
                    <td className="px-6 py-4 text-sm whitespace-nowrap" style={{ color: "#8b95b0" }}>
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium" style={{ color: "#0f1b35" }}>{entry.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <TypeBadge type={entry.type} />
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-sm font-semibold" style={{ color: "#0f1b35" }}>
                      {entry.amount != null ? formatAmount(entry.amount, entry.currency) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
