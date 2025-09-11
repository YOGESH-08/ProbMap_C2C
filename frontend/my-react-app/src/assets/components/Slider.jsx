import React from "react";
import "./Slider.css"; // keep your CSS
import { Link } from "react-router-dom";
import Img from "../photo/report2.png"
export default function Slider() {
  return (
    <main>
      <div className="mainimg">
        <div className="maininnerimg">
          <h1 className="maintext">Turn Problems to Dust, with questions well-bust</h1>
          <p className="subtext">
            Upload the public problems and gain rewards!<br></br> for your humble social work which could help puplic resource
          </p>
          <div className="mainnavbutton">
          <Link to="/report">
              <button className="quote-btn">Upload</button>
            </Link>
          </div>
        </div>
        <div className="mobile_img">
            <img src={Img} className="quotesimg" alt="VITGPT AI" />
        </div>
      </div>
    </main>
  );
}

