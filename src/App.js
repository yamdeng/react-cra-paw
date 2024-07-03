import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const search = async () => {
    const url = "https://api.github.com/repos/yamdeng/learn-react";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    search();
  }, []);
  return (
    <div className="App">
      <p>server data display3</p>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}

export default App;
