import pgPromise from "pg-promise";

const pgp = pgPromise();

export const getDbConnection = (dbConfig) => {
  return pgp(dbConfig);
};
