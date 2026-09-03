import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  let files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

test("server files export only async functions", () => {
  const appDir = path.join(process.cwd(), "app");
  const files = walk(appDir).filter(
    (f) => f.endsWith(".ts") || f.endsWith(".tsx"),
  );
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    if (
      !/^[ \t]*["']use server["']/.test(content) &&
      !/\n[ \t]*["']use server["']/.test(content)
    )
      continue;
    // disallow exporting const/let/var/type/interface/class
    const badExport = /export\s+(?:const|let|var|type|interface|class)\b/;
    assert.equal(
      badExport.test(content),
      false,
      `${file} contains non-function exports while using "use server"`,
    );
    // disallow exported non-async functions
    const nonAsyncFunc = /export\s+function\s+\w+/;
    if (nonAsyncFunc.test(content)) {
      const asyncFunc = /export\s+async\s+function\s+\w+/;
      assert.equal(
        asyncFunc.test(content),
        true,
        `${file} exports a non-async function while using "use server"`,
      );
    }
  }
});
