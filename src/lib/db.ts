import { Database } from "bun:sqlite";

const DB = new Database(Bun.env.DB_FILE, {
  create: true,
  readwrite: true,
});

DB.exec(`
CREATE TABLE IF NOT EXISTS customer (
  id integer NOT NULL PRIMARY KEY,
  name text,
  username text UNIQUE
);


CREATE TABLE IF NOT EXISTS export (
  id integer NOT NULL PRIMARY KEY,
  date datetime,
  filename text,
  customerId integer,
  CONSTRAINT export_customerId_fk FOREIGN KEY (customerId) REFERENCES customer (id)
);
`);

export default DB;
