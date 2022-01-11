import React from "react";
import Product from "./components/Product";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";

function HomeBackground() {
  return (
    <div className="cont">
      <Navbar />
      <h1 class="adv1"> Your Story Begins Here </h1>
      <h2 class="adv2"> Shop our collection of Books </h2>
      <h2 class="adv3"> Click shop to buy books </h2>
      <p class = "copyright">&copy; books2go</p>
    </div>
  );
}

function SearchBar() {
  return (
    <div class="form-outline searchbar">
      <input
        type="search"
        id="form1"
        class="form-control"
        placeholder="Search for book title"
        aria-label="Search"
      />
    </div>
  );
}

export default function App() {
  return (
    <div class="body">
      <HomeBackground />
      <Product />
    </div>
  );
}
