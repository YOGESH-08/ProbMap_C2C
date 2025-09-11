import React from "react";
import "./Why.css"
import img from "../photo/report2.png"

function Why(){
  return (
    <>
      <div className="section-container">
        {/* Left Side (Scrollable Text) */}
        <div className="scrollable-content">
          <div className="content-block">
            <h2>Why ProbMap?</h2>
            <h1>Public Problems are our Priority</h1>
            <p>
              At ProbMap, we believe that every voice matters. Our platform empowers you to report local issues directly to the authorities, ensuring that your concerns are heard and addressed. By bridging the gap between citizens and officials, we create a more responsive and accountable community.
            </p>
          </div>

          <div className="content-block">
            <h2>01 Smarter, Faster Solutions</h2>
            <p>
              Your reports help us spot patterns and recurring issues. This way, authorities can prioritize what matters most, and you'll see quicker, more meaningful results.
            </p>
          </div>

          <div className="content-block">
            <h2>02 Be Part of a Stronger Community</h2>
            <p>
              ProbMap connects you with your city. By reporting problems, you're joining a community that works together to make neighborhoods safer, cleaner, and better for everyone.
            </p>
          </div>

          <div className="content-block">
            <h2>03 Stay Updated in Real-Time</h2>
            <p>
              No more wondering what happened after you reported. With ProbMap, you can track the live status of your issue — from submission to resolution — right on the map.
            </p>
          </div>

          <div className="content-block">
            <h2>04 Get Rewarded for Your Impact</h2>
            <p>
              Your efforts matter! Every time you report an issue and it gets resolved, you'll earn rewards and recognition for helping improve your community.
            </p>
          </div>
        </div>

        {/* Right Side (Sticky Image) */}
        <div className="sticky-image">
          <img src={img} alt="ProbMap reporting interface" />
        </div>
      </div>

      <div className="belowsection-container">
        <section className="always-connected">
          <h2 className="section-title">ALWAYS CONNECTED</h2>
          <div className="features">
            <div className="feature-item">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="#85868b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="M9 12l2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="feature-title">Two-factor</h3>
              <p className="feature-desc">
                This is the space to introduce the Services. Briefly describe the types of services offered.
              </p>
            </div>

            <div className="feature-item">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="#85868b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className="feature-title">Data encryption</h3>
              <p className="feature-desc">
                This is the space to introduce the Services. Briefly describe the types of services offered.
              </p>
            </div>

            <div className="feature-item">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="#85868b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6A8.38 8.38 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8v.5z"></path>
                  <circle cx="12" cy="12" r="1"></circle>
                </svg>
              </div>
              <h3 className="feature-title">Text alerts</h3>
              <p className="feature-desc">
                This is the space to introduce the Services. Briefly describe the types of services offered.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
export default Why;