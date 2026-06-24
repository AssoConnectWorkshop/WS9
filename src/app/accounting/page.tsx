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
  return new Intl.DateTimeFormat("fr-FR").format(new Date(dateStr));
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
    <main className="flex min-h-screen flex-col items-center gap-8 p-8 pt-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Écritures comptables</h1>
        {entries && (
          <p className="text-sm text-gray-500">
            {entries["hydra:totalItems"]} écriture{entries["hydra:totalItems"] !== 1 ? "s" : ""} au total
          </p>
        )}
      </div>

      {error && (
        <div className="w-full max-w-5xl border border-red-200 bg-red-50 rounded-xl p-4 text-sm text-red-600">
          Erreur lors du chargement : {error}
        </div>
      )}

      {entries && entries["hydra:member"].length === 0 && (
        <p className="text-gray-400 text-sm">Aucune écriture trouvée.</p>
      )}

      {entries && entries["hydra:member"].length > 0 && (
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 font-medium">Libellé</th>
                <th className="pb-3 pr-4 font-medium">Type</th>
                <th className="pb-3 font-medium text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {entries["hydra:member"].map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                    {formatDate(entry.date)}
                  </td>
                  <td className="py-3 pr-4 font-medium">{entry.name}</td>
                  <td className="py-3 pr-4">
                    <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs text-gray-600">
                      {entry.type}
                    </span>
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {entry.amount != null ? formatAmount(entry.amount, entry.currency) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
