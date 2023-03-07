import type { Dir, Dirent } from "node:fs";
import { opendirSync, readdir } from "node:fs";
import { opendir as asyncOpendir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pipeline, Readable, Transform } from "node:stream";

async function* walkDir(root: string): AsyncGenerator<string> {
  const dirs = [resolve(root)];
  for (const path of dirs) {
    const dir = await asyncOpendir(path, { encoding: "utf8" });
    for await (const entry of dir) {
      if (entry.isDirectory()) {
        dirs.push(join(path, entry.name));
        continue;
      }
      if (entry.isFile()) yield join(path, entry.name);
    }
  }
}

function createSyncStream(root: string) {
  const dirs = [resolve(root)];
  let currentDir: Dir | null = null;

  const rs = new Readable({
    objectMode: true,
    read() {
      let entry: Dirent | null = null;
      while (entry === null) {
        if (currentDir === null) {
          const path = dirs.pop();
          if (path === undefined) break;
          currentDir = opendirSync(path, { encoding: "utf8" });
        }
        entry = currentDir.readSync();
        if (entry === null) {
          currentDir.closeSync();
          currentDir = null;
          continue;
        }
        if (entry.isDirectory()) {
          dirs.push(join(currentDir.path, entry.name));
          entry = null;
          continue;
        }
        if (entry.isFile()) {
          this.push(join(currentDir.path, entry.name));
          return;
        }
        entry = null;
      }
      this.push(null);
    },
  });
  return rs;
}

function createStream(root: string) {
  const dirs = [resolve(root)];

  const rs = new Readable({
    objectMode: true,
    read() {
      const path = dirs.pop();
      if (path === undefined) {
        this.push(null);
        return;
      }
      readdir(
        path,
        { withFileTypes: true, encoding: "utf8" },
        (err, entries) => {
          if (err !== null) {
            this.destroy();
            return;
          }
          const files: string[] = [];
          for (const entry of entries) {
            if (entry.isDirectory()) {
              dirs.push(join(path, entry.name));
              continue;
            }
            if (entry.isFile()) {
              files.push(join(path, entry.name));
            }
          }
          this.push(files);
        }
      );
    },
  });

  const out = new Transform({
    objectMode: true,
    transform(files: string[], encoding, done) {
      for (const file of files) {
        this.push(file);
      }
      done();
    },
  });

  return pipeline(rs, out, () => void 0);
}

const root = "../../";

let t0 = performance.now();
const dirStream = createSyncStream(root);
for await (const file of dirStream) {
  console.log(file);
}
let t1 = performance.now();
const stream_sync = t1 - t0;

t0 = performance.now();
for await (const file of walkDir(root)) {
  console.log(file);
}
t1 = performance.now();
const async_generator = t1 - t0;

const dirStream2 = createStream(root);
t0 = performance.now();
for await (const file of dirStream2) {
  console.log(file);
}
t1 = performance.now();
const stream = t1 - t0;
console.log("stream (sync): ", stream_sync);
console.log("async generator", async_generator);
console.log("stream: ", stream);
