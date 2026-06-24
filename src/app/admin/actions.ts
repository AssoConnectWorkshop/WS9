"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAssociationTypes(): Promise<{ id: number; label: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("association_types")
    .select("id, label")
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function addAssociationType(label: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("association_types").insert({ label });
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/generator");
}

export async function deleteAssociationType(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("association_types").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/generator");
}

export async function updateAssociationType(id: number, label: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("association_types").update({ label }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/generator");
}
