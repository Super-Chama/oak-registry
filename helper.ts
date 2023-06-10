
import { Untar } from "https://deno.land/std@0.191.0/archive/mod.ts";

export default async function downloadTarbal(
  url: string,
  fileName: string
): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response not OK (${response.status})`);
    const file = await Deno.open(`./tmp/${fileName}`, {
      append: true,
      create: true,
    });
    await response.body?.pipeTo(file.writable);
  } catch (error) {
    console.log(error);
  }
}
