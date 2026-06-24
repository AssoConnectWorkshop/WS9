"use client";

import { useState } from "react";
import { generateNames } from "./actions";

type AssociationType = { id: number; label: string };

export default function GeneratorClient({ types }: { types: AssociationType[] }) {
  const [theme, setTheme] = useState("");
  const [domain, setDomain] = useState("");
  const [keywords, setKeywords] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNames([]);
    const result = await generateNames(theme, domain, keywords);
    if (result.error) {
      setError(result.error);
    } else {
      setNames(result.names);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Thème</label>
          <input
            type="text"
            placeholder="ex: environnement, jeunesse, culture..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Domaine d&apos;activité</label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
          >
            <option value="">-- Choisir un domaine --</option>
            {types.map((t) => (
              <option key={t.id} value={t.label}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Mots-clés</label>
          <input
            type="text"
            placeholder="ex: local, innovant, inclusif..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Génération en cours..." : "Générer des noms"}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-sm">Erreur : {error}</p>
      )}

      {names.length > 0 && (
        <div className="border rounded-xl p-6 flex flex-col gap-3">
          <h2 className="font-semibold text-lg">Suggestions de noms</h2>
          <ul className="flex flex-col gap-2">
            {names.map((name, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-gray-400 text-sm w-4">{i + 1}.</span>
                <span className="font-medium">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
