type StaticFile<T = Date> = {
  name: string;
  size: number;
  date: T;
};

type DbFile<T = Date> = Omit<StaticFile<T>, "name"> & { filename: string };

export { StaticFile, DbFile };
