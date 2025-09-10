import { useState } from 'react'
import './App.css'
import Navbar from './Navbar.jsx'
import Home from './Home.jsx';
import About from './About.jsx';
import Why from './Why.jsx';

function App() {

  return (
    <>
      <Navbar/>
      <Home/>
      <About/>
      <Why/>
    </>
  );
}

export default App
