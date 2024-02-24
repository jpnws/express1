import express from "express";
const app = express();
const port = 8080;

let accounts = [
  {
    id: 1,
    username: "paulhal",
    role: "admin",
  },
  {
    id: 2,
    username: "johndoe",
    role: "guest",
  },
  {
    id: 3,
    username: "sarahjane",
    role: "guest",
  },
];

app.get("/accounts", (req, res) => {
  res.json(accounts);
});

app.get("/accounts/:id", (req, res) => {
  const accountId = Number(req.params.id);
  const getAccount = accounts.find((account) => account.id === accountId);
  if (!getAccount) {
    res.status(500).send("Account not found.");
  } else {
    res.json(getAccount);
  }
});

app.post("/accounts", (req, res) => {
  const incomingAccount = request.body;
  accounts.push(incomingAccount);
  res.json(accounts);
});

app.get("/health_check", (_, res) => {
  res.status(200).end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
