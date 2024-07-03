import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const search = async () => {
    const url = "http://10.111.158.205:18080/api/v1/airplanes";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      const data = json.data;
      setData(data);
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    search();
  }, []);
  return (
    <div className="App">
      <p>server data display</p>
      {/* <div>{JSON.stringify(data)}</div> */}
    </div>
  );
}

export default App;
