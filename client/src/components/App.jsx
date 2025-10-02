import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../../public/styles.css";
import axios from "axios";
import Login from "./Login";

const port = 3000;

export default function App() {
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:" + {port} + "/api");
    console.log();
  }

  /*useEffect(() => {
    fetchAPI();
  
  }, {});*/

  return (
    <div>
      <Header />
      <Login />
      <Footer />
    </div>
  );
}
