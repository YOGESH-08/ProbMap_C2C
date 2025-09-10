import React from "react";
import "./style.css"; // keep your CSS
export default function Slider() {
  return (
    <main>
      <div className="mainimg">
        <div className="maininnerimg">
          <h1 className="maintext">Turn Doubts to Dust, with questions well-bust</h1>
          <p className="subtext">
            Upload your notes & PYQs to VITGPT and help students learn smarter!
          </p>
          <div className="mainnavbutton">
            <a href="#">
              <button className="quote-btn">Upload</button>
            </a>
          </div>
        </div>
        <div className="mobile_img">
        </div>
      </div>
    </main>
  );
}

