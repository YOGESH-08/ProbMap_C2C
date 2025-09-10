import React from "react";
import './Home.css'
import zoro from './assets/zoro.jpg'
import { VscArrowCircleRight } from "react-icons/vsc";
import profile from './assets/profile.jpg'
function Home(){
    return(
    <>
        
        <div className="home-section">
            {/* Left Content */}
            <div className="home-left">
                <h4 className="sub-heading">PROBLEM MAP</h4><br /><br /><br /><br /><br />  
                <h1 className="main-heading">Solve the Problem</h1>
                <p className="description">
                This is the space to introduce the Services section. <br />
                Briefly describe the types of services offered and <br />
                highlight any special benefits or features.
                </p>
            </div>

            {/* Right Card */}
            <div className="home-right">
                <div className="service-card card1">
                <span className="card-number">01</span>
                <h2 className="card-title">Public Click Pic</h2>
                <p className="card-text">
                    This is the site where people can share public problems. <br />
                    Most often people see problem but they couldn't report  <br />
                    hurry so,we bridge the gap.
                </p>
                </div>
                <div className="service-card card2">
                <span className="card-number">02</span>
                <h2 className="card-title">Updating Problem</h2>
                <p className="card-text">
                    We take the Responsiblilty to share the problem <br />
                    with the concerned authorities. <br />
                    This way we can help public reach solutions to problem.
                </p>
                </div>
                <div className="service-card card3">
                <span className="card-number">03</span>
                <h2 className="card-title">Authorities Recieves</h2>
                <p className="card-text">
                    We take the problem to concerned authorities. <br />
                    Authorities can see the problem and  <br />
                    catogeraies them and see what is cause and solution for it.
                </p>
                </div>
                <div className="service-card card4">
                <span className="card-number">04</span>
                <h2 className="card-title">Update Solution</h2>
                <p className="card-text">
                    After the Problem is solved Admin can update it. <br />
                    Once the solution is updated public can see <br />
                    solution for those.People can have separate points for them.
                </p>
                </div>
            </div>

        </div>
        <div className="home-img">
                <img src={zoro} alt="" />
        </div>
 
       
            
    </>
    );
        
}
export default Home;