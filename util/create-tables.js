export const createTables = async (db) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        role VARCHAR(255)
      );
    `);
    console.log("Database created successfully.");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};
