import { mkdir, rmdir, stat, unlink, copyFile } from "node:fs/promises";
import { env } from "hono/adapter";
import { Hono } from "hono";
import { Id } from "~/types/id";
import Dockerode = require("dockerode");
import JSZip = require("jszip");
import archiver = require("archiver");
import db from "~/lib/db";
import { createWriteStream } from "node:fs";
import { getStaticFiles } from "~/lib/utils";
import { DbFile, StaticFile } from "~/types/files";

const exportRoute = new Hono();

export const docker = new Dockerode({
  socketPath: "/var/run/docker.sock",
});

exportRoute.post("/run", async (c) => {
  const { username, password } = await c.req.json<Id>();

  if (!username || !password) return c.json({ message: "Missing username or password" }, 400);

  const { TMP_DIR } = env<{
    TMP_DIR: string;
  }>(c);

  const container = await docker.createContainer({
    Image: "logizip:latest",
    name: `logizip-export-${username}`,
    Env: [`USERNAME=${username}`, `PASSWORD=${password}`],
    HostConfig: {
      ShmSize: 128 * 1024 * 1024, // 128MB,
      Mounts: [
        {
          Source: TMP_DIR,
          Target: "/tmp/export",
          Type: "bind",
        },
      ],
    },
  });

  await container.start();

  await container.attach({
    logs: true,
  });

  await container.wait({
    condition: "not-running",
  });

  await container.remove();

  return c.json({ message: "Export finished" });
});

exportRoute.get("/list", async (c) => c.json(await getStaticFiles()));

exportRoute.get("/history", async (c) => {
  const files = await getStaticFiles();

  let res = db
    .query<DbFile, any>(
      `
    SELECT export.*, customer.username AS customerUsername
    FROM export
    JOIN customer ON export.customerId = customer.id
    `,
    )
    .all();

  res = res.filter((file) => files.some((f) => f.name === file.filename));

  return c.json(res);
});

exportRoute.post("/test", async (c) => {
  return c.json({ message: "Test" });
});

exportRoute.post("/links", async (c) => {
  const { links, username } = await c.req.json<
    {
      links: string[];
    } & Omit<Id, "password">
  >();

  if (
    !links.every((link) =>
      link.startsWith("https://portail.e-facture.net/WebService/SOCLE/download.php"),
    )
  )
    return c.json({ message: "Forbidden" }, 403);

  const currentDate = new Date();

  const folder = await new Bun.CryptoHasher("md5")
    .update(`${username}_${currentDate.getTime()}`)
    .digest("hex");
  console.log(folder);
  let filesName: string[] = [];

  await mkdir(`./tmp/${folder}`, { recursive: true });

  for (const link of links) {
    await fetch(link).then(async (res) => {
      let filename: string | undefined;

      if (res.status !== 200) return console.log(`Failed to fetch ${link}: ${res.status}`);

      const contentDisposition = res.headers.get("Content-Disposition");

      if (contentDisposition) {
        filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
      } else {
        const url = new URL(link);
        filename = url.pathname.split("/").pop() || "file";
      }

      filesName.push(filename || "file");

      await res.blob().then(async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await Bun.write(`./tmp/${folder}/${filename}`, buffer);
      });
    });
  }

  const zip = archiver("zip", { encoding: "utf-8", zlib: { level: 9 } });

  zip.pipe(createWriteStream(`./static/${folder}.zip`));

  zip.directory(`./tmp/${folder}/`, false).finalize();

  db.exec(`INSERT OR IGNORE INTO customer (username) VALUES (?)`, [username]);

  const customerId = db.query("SELECT id FROM customer WHERE username = ?;").get(username) as {
    id: number;
  };

  db.exec(`INSERT INTO export (date, filename, customerId) VALUES (?, ?, ?);`, [
    currentDate.toISOString(),
    `${folder}.zip`,
    customerId.id,
  ]);

  await rmdir(`./tmp/${folder}`, { recursive: true });

  return c.json({ message: "Links processed" });
});

export default exportRoute;
