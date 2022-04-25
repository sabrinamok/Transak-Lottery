import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import { useEffect, useState } from "react";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    requestAccess();
    initManager();
    initPlayers();
    initBalance();
  }, []);

  const initManager = async () => {
    const manager = await lottery.methods.manager().call();
    setManager(manager);
  };

  const initPlayers = async () => {
    const players = await lottery.methods.getPlayers().call();
    setPlayers(players);
  };

  const initBalance = async () => {
    const balance = await web3.eth.getBalance(lottery.options.address);
    setBalance(balance);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on the transaction success...");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setMessage("You have been entered...");
  };

  const requestAccess = async () => {
    await web3.eth.requestAccounts();
  };

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage("Loading");
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setMessage("The winner have been picked.");
  };

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>
        There are currently {players.length} people entered competing to win
        {web3.utils.fromWei(balance, "ether")}
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck ?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            onChange={(event) => setValue(event.target.value)}
            value={value}
          />
          <button>Enter</button>
        </div>
      </form>

      <hr />
      <h1>{message}</h1>

      <hr />
      <h4>Ready to pick a winner ?</h4>
      <button onClick={pickWinner}>Pick a winner</button>
    </div>
  );
}

export default App;
