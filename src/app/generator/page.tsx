import GeneratorClient from "./GeneratorClient";

export const metadata = {
  title: "Générateur de nom d'association",
};

export default function GeneratorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Générateur de nom d&apos;association</h1>
        <p className="text-gray-500 text-sm max-w-md">
          Décris ton projet et laisse l&apos;IA te proposer des noms originaux pour ton association.
        </p>
      </div>
      <GeneratorClient />
    </main>
  );
}
