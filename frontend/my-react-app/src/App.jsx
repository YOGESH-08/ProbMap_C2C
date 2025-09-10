import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./assets/components/Navbar";
import Upload from "./assets/components/Upload";
import Slider from "./assets/components/Slider";
import Home from "./assets/components/Home";
import Why from "./assets/components/Why";


function Home1() {
  return (
    <>
    <Slider/>
    <Home/>
    <Why/>

    </>
  );
}

function History() {
  return <div>History Page</div>;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home1 />} />
        <Route path="/report" element={<Upload />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
