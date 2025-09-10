import React from "react";
import './Navbar.css'

function Navbar(){
    return(
        <>
        <div className="container-nav">
            <div className="left-nav">
                ProbMap
            </div>
            <div className="mid-nav">
                <div className="home">Home</div>
                <div className="report">Report</div>
                <div className="solution">History</div>
            </div>

            <div className="contact-button" id="Login">Logout</div>
        </div>
            
        </>
    );
}

export default Navbar