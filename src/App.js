import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import { useEffect, useState } from "react";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");

  useEffect(() => {
    initManager();
  }, []);

  const initManager = async () => {
    const manager = await lottery.methods.manager().call();
    setManager(manager);
  };

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
    </div>
  );
}

export default App;
