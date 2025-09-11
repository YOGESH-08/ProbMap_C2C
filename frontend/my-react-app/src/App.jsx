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

function App() {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Show popup after 3 seconds
    const timer = setTimeout(() => setShowPopup(true), 3000);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (!user) {
    return <AuthForms />;
  }

  return (
    <>
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home1 />} />
          <Route path="/report" element={<Upload />} />
          <Route path="/pending" element={<UserIssues filterStatus="pending" />} />
          <Route path="/history" element={<UserIssues filterStatus="history" />} />
        </Routes>
      </Router>
    </>
  );
}

import Popup from "./popup";
export default App;
