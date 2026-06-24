import { getAssociationTypes } from "./actions";
import AdminClient from "./AdminClient";

export const metadata = {
  title: "Admin — Types d'association",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const types = await getAssociationTypes();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-gray-500 text-sm">Gérez les types d&apos;association disponibles dans le générateur.</p>
      </div>
      <AdminClient initial={types} />
    </main>
  );
}
