import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import { useEffect, useState } from "react";
import lottery from "./lottery";
import "./index.css";
import beige from "./img/beige-ball.png";
import purple from "./img/purple-ball.png";
import green from "./img/green-ball.png";

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


    const [show, setShow] = useState(false);
    const [showWinner, setShowWinner] = useState(false);
    let connectedAccount = 0;

    (async () => {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);
      connectedAccount = accounts[0];
      if(accounts != "0xa18736ED3c74D61777750399E716644db69F44D8") {
        console.log('not manager');
        setShowWinner(false);
      } else {
        console.log('manager');
        setShowWinner(true);
      }

      if(connectedAccount!== undefined) {

        setShow(true);
  
      }else {
        setShow(false);
      }
    
    })();

  const Button = () => (
    <>
    <a class="buy" target="_blank" href={"https://staging-global.transak.com/?apiKey=f9c0675d-eda3-47b7-8a72-f8762f9a5c03&redirectURL=https://abc.com&cryptoCurrencyCode=MATIC&defaultCryptoCurrency=MATIC&cryptoCurrencyList=MATIC&defaultNetwork=polygon&networks=polygon&network=polygon&walletAddress="+ connectedAccount + "&disableWalletAddressForm=true&exchangeScreenTitle=LotteryDapp&isFeeCalculationHidden=true&fiatAmount=100"}>Buy Matic</a>
    </>
  )
  return (
    
    <div className="App">
      <h2 class="page-title">Lottery Game</h2>
      <Button show={show} onHide={()=> setShow(false)}/>
      <section class="section-wrapper what">
        <div class="container">
          <div class="text">
            <p>Powered By Transak</p>
            <p>This contract is managed by {manager}</p>
            <h2>1 MATIC for 1 entry.</h2>
            <h3>Max 100 entries in 1 transaction.</h3>
            <p class="description">
            There are currently {players} entries competing to win&nbsp;
            {web3.utils.fromWei(balance, "ether")} MATIC
          </p>
          </div>
          <div class="beige ball">
            <img src={beige}/>
          </div>
          <div class="purple ball">
            <img src={purple}/>
          </div>
          <div class="purple ball"></div>
        </div>
      </section>

      <section class="section-wrapper try">
        <div class="container">
          <div class="left">
            <h3>Try your luck</h3>
          </div>
          <div class="right">
            <form onSubmit={onSubmit}>
              <div>
                <label>Amount of MATIC to enter</label>
                <input
                  onChange={(event) => setValue(event.target.value)}
                  value={value}
                />
                <button>Enter</button>
              </div>
            </form>
          </div>
          <h1>{message}</h1>
        </div>
      </section>
      <section class="winner section-wrapper" showWinner={false}>
        <div class="container">
          <div class="description">
            <h2>Ready to pick a</h2>
            <h2 class="black">Winner?</h2>
            <button class="winner-buy" onClick={pickWinner}>Pick a winner</button>
            </div>
          <div class="green ball">
            <img src={green}/>
          </div>
          <div class="pink ball">
            <img src={beige}/>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
