import React, { useEffect, useState } from "react";
import "./App.css";
import OffLineApp from "./OffLineApp";
import OnlineApp from "./OnlineApp";

const isFirstOnline = navigator.onLine;

function App() {
  const [isNetworkOnline, setIsNetworkOnline] = useState(isFirstOnline);
  window.addEventListener("online", (event) => {});

  let AppComponent = <OnlineApp />;
  if (!isNetworkOnline) {
    AppComponent = <OffLineApp />;
  }

  useEffect(() => {
    window.addEventListener("online", (event) => {
      setIsNetworkOnline(true);
    });
    window.addEventListener("offline", (event) => {
      setIsNetworkOnline(false);
    });
  }, []);

  return (
    <div className="App">
      App Root
      {AppComponent}
    </div>
  );
}

export default App;
