import React from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Heart, 
  Mail, 
  ArrowUp,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import "../Styles/Footer.css";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="modern-footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="footer-logo">
                <MapPin size={20} />
              </div>
              <span className="footer-brand-name">
                Prob<span>Map</span>
              </span>
            </div>
            <p className="footer-desc">
              AI-driven civic engagement platform bridging the gap between proactive citizens and municipal authorities for faster public infrastructure repairs.
            </p>
            <div className="footer-trust-badge">
              <ShieldCheck size={16} className="text-emerald" />
              <span>Verified Public Property Oversight</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/">Home & Mission</Link></li>
              <li><Link to="/report">Report Damage</Link></li>
              <li><Link to="/pending">Pending Reviews</Link></li>
              <li><Link to="/history">Resolution History</Link></li>
              <li><Link to="/volunteer">Volunteer Network</Link></li>
            </ul>
          </div>

          {/* Technologies */}
          <div className="footer-col">
            <h4 className="footer-heading">Engineered With</h4>
            <ul className="footer-links tech-list">
              <li><CheckCircle2 size={13} className="text-teal" /> React 18 & Vite</li>
              <li><CheckCircle2 size={13} className="text-teal" /> Google Gemini Vision AI</li>
              <li><CheckCircle2 size={13} className="text-teal" /> Node.js & Express API</li>
              <li><CheckCircle2 size={13} className="text-teal" /> Local MongoDB Compass</li>
              <li><CheckCircle2 size={13} className="text-teal" /> Firebase Authentication</li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div className="footer-col">
            <h4 className="footer-heading">Community & Support</h4>
            <p className="footer-contact-text">
              Have questions, feedback, or partner municipal queries?
            </p>
            <a href="mailto:support@probmap.org" className="footer-email-link">
              <Mail size={16} />
              <span>support@probmap.org</span>
            </a>
            <div className="footer-social-icons">
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                <FaGithub size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <FaTwitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} ProbMap C2C. Developed for social infrastructure improvement.
          </p>

          <button type="button" className="scroll-top-btn" onClick={scrollToTop}>
            <span>Back to top</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
