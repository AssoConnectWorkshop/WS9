"use client";

import { useState, useTransition } from "react";
import { addAssociationType, deleteAssociationType, updateAssociationType } from "./actions";

type AssociationType = { id: number; label: string };

export default function AdminClient({ initial }: { initial: AssociationType[] }) {
  const [types, setTypes] = useState(initial);
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    startTransition(async () => {
      await addAssociationType(newLabel.trim());
      setTypes((prev) => [...prev, { id: Date.now(), label: newLabel.trim() }]);
      setNewLabel("");
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteAssociationType(id);
      setTypes((prev) => prev.filter((t) => t.id !== id));
    });
  }

  function startEdit(type: AssociationType) {
    setEditingId(type.id);
    setEditLabel(type.label);
  }

  function handleUpdate(e: React.FormEvent, id: number) {
    e.preventDefault();
    if (!editLabel.trim()) return;
    startTransition(async () => {
      await updateAssociationType(id, editLabel.trim());
      setTypes((prev) => prev.map((t) => (t.id === id ? { ...t, label: editLabel.trim() } : t)));
      setEditingId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="border rounded-xl p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-lg">Types d&apos;association</h2>
        <ul className="flex flex-col gap-2">
          {types.map((type) => (
            <li key={type.id} className="flex items-center gap-2">
              {editingId === type.id ? (
                <form onSubmit={(e) => handleUpdate(e, type.id)} className="flex gap-2 flex-1">
                  <input
                    autoFocus
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="bg-black text-white rounded-lg px-3 py-1.5 text-sm hover:bg-gray-800 disabled:opacity-50"
                  >
                    Sauver
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="border rounded-lg px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                </form>
              ) : (
                <>
                  <span className="flex-1 text-sm">{type.label}</span>
                  <button
                    onClick={() => startEdit(type)}
                    className="text-sm text-gray-500 hover:text-black px-2 py-1"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    disabled={isPending}
                    className="text-sm text-red-500 hover:text-red-700 px-2 py-1 disabled:opacity-50"
                  >
                    Supprimer
                  </button>
                </>
              )}
            </li>
          ))}
          {types.length === 0 && (
            <li className="text-sm text-gray-400">Aucun type défini.</li>
          )}
        </ul>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          placeholder="Nouveau type..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          disabled={isPending || !newLabel.trim()}
          className="bg-black text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
