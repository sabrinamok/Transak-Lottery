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
    const players = await lottery.methods.numPlayers().call();
    setPlayers(players);
  };

  const initBalance = async () => {
    const balance = await web3.eth.getBalance(lottery.options.address);
    setBalance(balance);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting for Transaction to Complete");
    await lottery.methods.joinRaffle().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });
    initPlayers();
    initBalance();
    setMessage("Your Entry is Confirmed");
  };

  const requestAccess = async () => {
    await web3.eth.requestAccounts();
  };

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage("Loading");
    await lottery.methods.selectWinnerRestricted().send({
      from: accounts[0],
    });
    setMessage("The Winner has been selected and transferred winnings.");
  };
/*const [show, setShow] = useState(false)
  

    useEffect(() => {
      if(!web3.isConnected()) {

        // show some dialog to ask the user to start a node

    }else {
      setShow(true);
    }
    });*/

    const walletAddress = async () => {
      await web3.eth.getAccounts();
      console.log(walletAddress);
    };

    if(walletAddress != "0xa18736ED3c74D61777750399E716644db69F44D8") {
      console.log('no');
      
    } else {
      console.log('hi');
    }

  const Button = () => (
    <>
    <a target="_blank" href={"https://staging-global.transak.com/?apiKey=f9c0675d-eda3-47b7-8a72-f8762f9a5c03&redirectURL=https://abc.com&cryptoCurrencyCode=MATIC&defaultCryptoCurrency=MATIC&cryptoCurrencyList=MATIC&defaultNetwork=polygon&networks=polygon&network=polygon&walletAddress="+ walletAddress + "&disableWalletAddressForm=true&exchangeScreenTitle=LotteryDapp&isFeeCalculationHidden=true&fiatAmount=100"}>Buy Matic</a>
    </>
  )

  const Winner = () => (
    <>
    <h4>Ready to pick a winner ?</h4>
      <button onClick={pickWinner}>Pick a winner</button>
    </>
  )

  return (
    <div className="App">
      <h2>Lottery Game</h2>
      <p>Powered By Transak</p>
      <p>This contract is managed by {manager}</p>
      <Button/>
      <p>
        There are currently {players} entries competing to win&nbsp;
        {web3.utils.fromWei(balance, "ether")} MATIC
      </p>
      <p>
        1 MATIC for 1 entry. Max 100 entries in 1 transaction.<br/>
        Contract automatically picks a winner when we hit 200 entries.
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Try your luck</h4>
        <div>
          <label>Amount of MATIC to enter</label>
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
      <Winner/>
    </div>
  );
}

export default App;
