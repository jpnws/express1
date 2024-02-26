export const createTables = async (pool) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        role VARCHAR(255)
      );
    `);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};
