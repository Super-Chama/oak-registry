import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import downloadTarbal from "./helper.ts";

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Welcome to dinosaur API!";
  })
  .get("/:author/:repo/:folder?", async (context) => {
    const { author, repo, folder, commit, branch } = getQuery(context, {
      mergeParams: true,
    });
    const ref = commit || branch || "main";

    if (!author || !repo || !ref) {
      context.response.status = 400;
      context.response.body = "Bad url format!";
      return context;
    }

    const fileName = `${[author, repo, folder || "", ref]
      .filter(Boolean)
      .join("-")}.tgz`;
    const repodump = `https://codeload.github.com/${author}/${repo}/tar.gz/${ref}`;

    console.log(author, repo, folder, ref);
    console.log(fileName);
    console.log(repodump);

    await downloadTarbal(repodump, folder);

    context.response.body = "ddd";
    // context.response.status = 200;
    // context.response.headers.append(
    //   "Content-Disposition",
    //   `attachment; filename="${fileName}"`
    // );
    // context.response.headers.append("Content-Type", "application/gzip");
  });
// .get("/api/:dinosaur", (context) => {
//   if (context?.params?.dinosaur) {
//     const found = data.find((item) =>
//       item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
//     );
//     if (found) {
//       context.response.body = found;
//     } else {
//       context.response.body = "No dinosaurs found.";
//     }
//   }
// });

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
