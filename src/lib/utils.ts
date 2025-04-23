import { stat } from "node:fs/promises";
import { StaticFile } from "~/types/files";

/**
 * Retrieves a list of static files with their metadata from the `./static` directory.
 *
 * This function scans for `.zip` files in the specified directory and gathers
 * information about each file, including its name, size, and last modified date.
 *
 * @returns {Promise<StaticFile[]>} A promise that resolves to an array of `StaticFile` objects,
 * each containing the file's name, size, and modification date.
 */
const getStaticFiles = async (): Promise<StaticFile[]> => {
  const files: StaticFile[] = [];

  const glob = new Bun.Glob(`./static/*.{zip}`);

  for await (const file of glob.scanSync(".")) {
    const stats = await stat(file);

    files.push({
      name: file.replace(/\\/g, "/").split("/").at(-1)!,
      size: stats.size,
      date: stats.mtime,
    });
  }

  return files;
};

const uptime = () => {
  return {
    days: Math.floor(process.uptime() / 86400),
    hours: Math.floor((process.uptime() % 86400) / 3600),
    minutes: Math.floor((process.uptime() % 3600) / 60),
    seconds: Math.floor(process.uptime() % 60),
  };
};

export { uptime, getStaticFiles };
