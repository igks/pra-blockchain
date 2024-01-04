const express = require("express");
const bodyParser = require("body-parser");

const Blockchain = require("../blockchain");

// TODO use env
const HTTP_PORT = 3001;

const app = express();
app.use(bodyParser.json());

const bc = new Blockchain();

app.get("/blocks", (req, res) => {
  return res.json(bc.chain);
});

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);
  return res.redirect("/blocks");
});

app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));
