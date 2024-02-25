import express, { query } from "express";
import db from "./db.js";

const app = express();

app.use(express.json());

app.get("/accounts", async (_, res) => {
  try {
    const accounts = await db.query(
      `
      SELECT
        *
      FROM
        accounts;
      `
    );
    res.json(accounts);
  } catch (err) {
    console.error("Failed to fetch all accounts:", err);
  }
});

app.get("/accounts/:id", async (req, res) => {
  try {
    const accountId = Number(req.params.id);
    const accountResult = await db.query(
      `
      SELECT
        *
      FROM
        accounts
      WHERE
        id = $1;
      `,
      [accountId]
    );
    if (!accountResult) {
      res.status(500).send("Account not found.");
    } else {
      res.json(accountResult);
    }
  } catch (err) {
    console.error("Failed to retrieve account:", err);
  }
});

app.post("/accounts", (req, res) => {
  const account = req.body;
  try {
    db.query(
      `
      INSERT INTO
        accounts (username, role)
      VALUES
        ($1, $2)
      `,
      [account.username, account.role]
    );
    res.status(201).json({ message: "Account created." });
  } catch (error) {
    console.error("Failed to insert account:", error);
    res.status(500).send("Failed to create account.");
  }
});

app.get("/health_check", (_, res) => {
  res.status(200).end();
});

export default app;