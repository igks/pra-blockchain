const express = require("express");
const bodyParser = require("body-parser");
const P2pServer = require("./p2p-server");
const Blockchain = require("../blockchain");
const Wallet = require("../wallet");
const TransactionPool = require("../wallet/transaction-pool");

const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);

// TODO use env
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
  return res.json(bc.chain);
});

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);
  p2pServer.syncChains();
  return res.redirect("/blocks");
});

app.get("/transactions", (req, res) => {
  return res.json(tp.transactions);
});

app.post("/transactions", (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, tp);
  p2pServer.broadcastTransaction(transaction);
  return res.redirect("/transactions");
});

app.get("/public-key", (req, res) => {
  return res.json({ publicKey: wallet.publicKey });
});

app.listen(HTTP_PORT, () =>
  console.log(`App server listening on port: ${HTTP_PORT}`)
);

p2pServer.listen();
