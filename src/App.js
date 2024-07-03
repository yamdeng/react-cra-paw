import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import List from "./List";
import Form from "./Form";

function App() {
  return (
    <div className="App">
      test1
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
