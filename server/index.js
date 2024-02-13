import { secp256k1 } from "ethereum-cryptography/secp256k1.js"
import { default as express } from "express";
import { default as cors } from "cors";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "03dc46c9092b2149cd42879173c625f334e1f82eac129c73177d38973690bb7747": 100,
  "03b99b6cfaf85a1c514eadff1208e22086a16e3774e528494966a3a163c17af6af": 50,
  "039bcc79083001ba24327f8439c60e06c5f1b4a82ff62c4c38055db660a71e5ff5": 75,
};

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, hash, signature } = req.body;
  const { hex } = signature;
  if (!secp256k1.verify(hex, hash, sender)) {
    return res.status(401).send({ message: "Invalid signature!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
