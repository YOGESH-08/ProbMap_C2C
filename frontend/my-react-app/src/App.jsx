import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./assets/components/Navbar";
import Upload from "./assets/components/Upload";
import Slider from "./assets/components/Slider";
import Home from "./assets/components/Home";
import Why from "./assets/components/Why";
import Acard from "./assets/components/Acard";
import AuthForms from "./assets/components/Authforms";
import { auth } from "../src/assets/components/firebase/firebase"; 
import { onAuthStateChanged } from "firebase/auth";

function Home1() {
  return (
    <>
      <Slider />
      <Home />
      <Why />
    </>
  );
}

function History() {
  const sampleDetails = {
    name: "City Sports Arena",
    location: "Coimbatore, India",
    rating: 4.5,
    description:
      "A modern sports arena with facilities for football, basketball, and indoor games. Spacious and well-maintained grounds with professional coaches.",
    pricePerHour: 500,
    sports: ["Football", "Basketball", "Tennis"],
    openTime: "6:00 AM",
    closeTime: "10:00 PM",
  };

  return <Acard details={sampleDetails} />;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
  }, []);

  if (!user) {
    return <AuthForms />;
  }

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
