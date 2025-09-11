import React from "react";
import './Home.css'
import zoro from '../photo/construction2.jpeg'

function Home(){
    return(
    <>
        
        <div className="home-section">
            {/* Left Content */}
            <div className="home-left">
                <h4 className="sub-heading">PROBLEM MAP</h4>
                <h1 className="main-heading">Solve the Problem</h1>
                <p className="description">
                This is the space to introduce the Services section. <br className="desktop-only" />
                Briefly describe the types of services offered and <br className="desktop-only" />
                highlight any special benefits or features.
                </p>
            </div>

            {/* Right Card */}
            <div className="home-right">
                <div className="service-card card1">
                <span className="card-number">01</span>
                <h2 className="card-title">Public Click Pic</h2>
                <p className="card-text">
                    This is the site where people can share public problems. <br className="desktop-only" />
                    Most often people see problem but they couldn't report  <br className="desktop-only" />
                    hurry so,we bridge the gap.
                </p>
                </div>
                <div className="service-card card2">
                <span className="card-number">02</span>
                <h2 className="card-title">Updating Problem</h2>
                <p className="card-text">
                    We take the Responsiblilty to share the problem <br className="desktop-only" />
                    with the concerned authorities. <br className="desktop-only" />
                    This way we can help public reach solutions to problem.
                </p>
                </div>
                <div className="service-card card3">
                <span className="card-number">03</span>
                <h2 className="card-title">Authorities Recieves</h2>
                <p className="card-text">
                    We take the problem to concerned authorities. <br className="desktop-only" />
                    Authorities can see the problem and  <br className="desktop-only" />
                    catogeraies them and see what is cause and solution for it.
                </p>
                </div>
                <div className="service-card card4">
                <span className="card-number">04</span>
                <h2 className="card-title">Update Solution</h2>
                <p className="card-text">
                    After the Problem is solved Admin can update it. <br className="desktop-only" />
                    Once the solution is updated public can see <br className="desktop-only" />
                    solution for those.People can have separate points for them.
                </p>
                </div>
            </div>

        </div>
        <div className="home-img">
                <img src={zoro} alt="Construction site" />
        </div>
    </>
    );
        
}
export default Home;