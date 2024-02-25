import db from "./db.js";

let accounts = [
  {
    username: "paulhal",
    role: "admin",
  },
  {
    username: "johndoe",
    role: "member",
  },
  {
    username: "sarahjane",
    role: "member",
  },
];

const seedDb = async () => {
  try {
    for (const account of accounts) {
      await db.query(
        `
        INSERT INTO
          accounts (username, role)
        VALUES
          ($1, $2)
        `,
        [account.username, account.role]
      );
    }
    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Failed to seed the database:", err);
  }
};

seedDb();
