import server from "./server";

const accounts = [
  {
    private: '2a169f20b8ce85b9fb53fc8119a0ecb151d38b85fb4e5dc27f70d00bb996e6c1',
    public: '03dc46c9092b2149cd42879173c625f334e1f82eac129c73177d38973690bb7747'
  },
  {
    private: 'a69d80a6656a7ab87b453457d8a48d0829774d4c9610c2ebfca2cc593f81a6fe',
    public: '03b99b6cfaf85a1c514eadff1208e22086a16e3774e528494966a3a163c17af6af'
  },
  {
    private: 'ff5efc2a5bdb5fd4f2772e86b3e32821cb1936387a7eb890b992863c8b5bc7cf',
    public: '039bcc79083001ba24327f8439c60e06c5f1b4a82ff62c4c38055db660a71e5ff5'
  }
];

function Wallet({ account, setAccount, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    const account = accounts.find(account => account.public === address);
    setAccount(account ?? { public: address });
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 03dc46c9092b2149cd42879173c625f334e1f82eac129c73177d38973690bb7747" value={account.public} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
