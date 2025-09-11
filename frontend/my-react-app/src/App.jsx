import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./assets/components/Navbar";
import Upload from "./assets/components/Upload";
import Slider from "./assets/components/Slider";
import Home from "./assets/components/Home";
import Why from "./assets/components/Why";
import Acard from "./assets/components/Acard";
import AuthForms from "./assets/components/Authforms";
import Footer from "./assets/components/Footer";
import { auth } from "../src/assets/components/firebase/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import UserIssues from "./assets/components/UserIssues";

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
function Pending(){
  const sampleDetails1 = {
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
  return(
    <Acard details={sampleDetails1} />
  );
}
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
  }, []);

  // if (!user) {
  //   return <AuthForms />;
  // }

  return (
    // <AuthForms/>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home1 />} />
        <Route path="/report" element={<Upload />} />
        <Route path="/pending" element={<Pending/>}/>
        <Route path="/history" element={<UserIssues />} />
      </Routes>
    </Router>
  );
}

export default App;
