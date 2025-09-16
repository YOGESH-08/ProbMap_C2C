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
import VolunteerIssues from "./assets/components/VolunteerIssues";

function Home1() {
  return (
    <>
      <Slider />
      <Home />
      <Why />
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && !localStorage.getItem("popupClosed")) {
        setShowPopup(true);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("popupClosed", "true");
  };

  if (!user) {
    return <AuthForms />;
  }

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home1 />} />
          <Route path="/report" element={<Upload />} />
          <Route
            path="/pending"
            element={<UserIssues filterStatus="pending" />}
          />
          <Route
            path="/history"
            element={<UserIssues filterStatus="history" />}
          />
          <Route path="/volunteer" element={<VolunteerIssues />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
