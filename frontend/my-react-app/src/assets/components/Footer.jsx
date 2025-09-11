import React from "react"
import "../Styles/Footer.css"
export default function Footer(){
    return (
        <footer>
        <div class="footer-top">
            <p>Your Service companion!</p>
            <h1>Let's Elevate Social Serivce</h1>
        </div>
    
        <div class="footer-content">
            <div class="footer-column">
                <h3>Contact Us</h3>
                <p><a href="mailto:support@vitgpt.com">support@probmap.com</a></p>
            </div>
    
            <div class="footer-column">
                <a href="./assets/codes/upload.html">
                <button class="quote-btn">Get Started</button>
                </a>
            </div>
    
            <div class="footer-column">
                <h3>Support</h3>
                <p>Available 24/7 for public queries</p>
            </div>
        </div>
    
        <div class="social-icons">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-linkedin-in"></i></a>
            <a href="#"><i class="fab fa-github"></i></a>
        </div>
    
        <div class="footer-bottom">
            <p>© 2025 ProbMap. All Rights Reserved.</p>
            <a href="#">Back to Top ↑</a>
        </div>
        </footer>
    
    )
}