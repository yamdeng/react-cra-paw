import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Form from "./Form";
import Home from "./Home";
import List from "./List";

function OnlineApp() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </div>
  );
}

export default OnlineApp;
