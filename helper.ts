import {
  copy,
  readerFromStreamReader,
} from "https://deno.land/std@0.191.0/streams/mod.ts";
import { Buffer } from "https://deno.land/std@0.191.0/io/mod.ts";
import { Untar, Tar } from "https://deno.land/std@0.191.0/archive/mod.ts";
import { ensureFile, ensureDir } from "https://deno.land/std@0.191.0/fs/mod.ts";

export default async function downloadTarbal(
  url: string,
  folder?: string
): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok || !response.body)
      throw new Error(`Response not OK (${response.status})`);

    const streamReader = response.body
      .pipeThrough(new DecompressionStream("gzip"))
      .getReader();
    const reader = readerFromStreamReader(streamReader);
    // const tar = new Tar();
    const untar = new Untar(reader);

    for await (const entry of untar) {
      if (entry.type === "directory") continue;
      entry.fileName = entry.fileName.replace(/^[^\/]*./, ""); // strip the hashname
      const fileName = entry.fileName.match(/^[^\/]*/);
      if (fileName && fileName.length > 0 && fileName[0] === folder) {
        console.log(entry.fileName);
      } else {
        await entry.discard();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

//   console.log(entry); // metadata
//   /*
//       fileName: "archive/deno.txt",
//       fileMode: 33204,
//       mtime: 1591657305,
//       uid: 0,
//       gid: 0,
//       size: 24400,
//       type: 'file'
//     */
