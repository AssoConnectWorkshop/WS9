"use server";

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function generateNames(
  theme: string,
  domain: string,
  keywords: string
): Promise<{ names: string[]; error?: string }> {
  try {
    const prompt = `Tu es un expert en création d'associations françaises. Génère 5 noms originaux et mémorables pour une association avec les caractéristiques suivantes :
- Thème : ${theme || "général"}
- Domaine d'activité : ${domain || "non précisé"}
- Mots-clés : ${keywords || "aucun"}

Pour chaque nom, propose quelque chose de créatif, facile à retenir et adapté à une association française (peut être en français, anglais ou un mélange). Réponds uniquement avec la liste des 5 noms, un par ligne, sans numérotation ni explication.`;

    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 500,
      thinking: { type: "adaptive" },
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("");

    const names = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return { names };
  } catch (err) {
    return { names: [], error: String(err) };
  }
}
