import { useState } from 'react'
import './App.css'
import Admin from "./assets/Admin/Header.jsx"
import Navbar from './assets/components/Navbar.jsx'
import Home from './assets/components/Home.jsx';
import About from './assets/components/About.jsx';
import Why from './assets/components/Why.jsx';
import Slider from './assets/components/Slider.jsx';
function App() {

  return (
    <>
      <Navbar/>
      <Slider/>
      <Home/>
      <About/>
      <Why/>
    </>
  );
}

export default App
