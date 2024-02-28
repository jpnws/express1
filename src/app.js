import express from "express";

export const createApp = (prisma) => {
  const app = express();
  app.use(express.json());

  app.get("/accounts", async (_, res) => {
    try {
      const accounts = await prisma.account.findMany();
      res.json(accounts);
    } catch (err) {
      console.error("Failed to fetch all accounts:", err);
      res.status(500).send("Failed to fetch all accounts.");
    }
  });

  app.get("/accounts/:id", async (req, res) => {
    try {
      const accountId = Number(req.params.id);
      const accountResult = await prisma.account.findUnique({
        where: {
          id: accountId,
        },
      });
      if (!accountResult) {
        res.status(500).send("Account not found.");
      } else {
        res.json(accountResult);
      }
    } catch (err) {
      console.error("Failed to retrieve account:", err);
      res.status(500).send("Failed to retrieve account.");
    }
  });

  app.post("/accounts", async (req, res) => {
    const account = req.body;
    try {
      await prisma.account.create({
        data: {
          username: account.username,
          role: account.role,
        },
      });
      res.status(201).json({ message: "Account created." });
    } catch (error) {
      console.error("Failed to insert account:", error);
      res.status(500).send("Failed to create account.");
    }
  });

  app.get("/health_check", (_, res) => {
    res.status(200).end();
  });

  return app;
};
