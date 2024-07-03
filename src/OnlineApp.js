import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import List from "./List";
import Form from "./Form";

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
