import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default App;
