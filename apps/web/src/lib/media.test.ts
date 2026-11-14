import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { projects } from "@portfolio/content";

const publicDir = fileURLToPath(new URL("../../public", import.meta.url));

// A typo in a media path would otherwise only show up as a broken frame.
it("every project media file exists in public/", () => {
  const missing = projects.flatMap((project) =>
    project.media
      .flatMap((m) => [m.src, ...(m.poster ? [m.poster] : [])])
      .filter((file) => !existsSync(publicDir + file))
      .map((file) => `${project.slug}: ${file}`),
  );
  expect(missing).toEqual([]);
});
