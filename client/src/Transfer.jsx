import { useState } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js"
import { sha256 } from "ethereum-cryptography/sha256.js";
import { bytesToHex as toHex, utf8ToBytes} from "ethereum-cryptography/utils.js";
import server from "./server";

function Transfer({ account, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const transaction = {
        sender: account.public,
        recipient,
        amount: parseInt(sendAmount),
      };
      const hash = toHex(sha256(utf8ToBytes(JSON.stringify(transaction))));
      transaction.hash = hash;
      const { r, s, recovery } = secp256k1.sign(hash, account.private);
      const signatureHex = r.toString(16) + s.toString(16);
      transaction.signature = {
        hex: signatureHex,
        recovery,
      };
      const {
        data: { balance },
      } = await server.post(`send`, transaction);
      setBalance(balance);
    } catch (ex) {
      alert(ex);
      console.log(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
