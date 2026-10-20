import React from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Camera, 
  Cpu, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingUp, 
  Award, 
  Users, 
  ArrowRight,
  Clock,
  Layers
} from "lucide-react";
import "./Home.css";

export default function Home({ user }) {
  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles className="badge-sparkle" />
            <span>AI-Powered Civic Engagement Platform</span>
          </div>

          <h1 className="hero-title">
            Report Local Damage. <br />
            <span className="gradient-text">Transform Your City.</span>
          </h1>

          <p className="hero-subtitle">
            ProbMap connects proactive citizens directly with local authorities. 
            Snap a photo of potholes, street light outages, or public property damage — 
            our <strong>Gemini Vision AI</strong> automatically classifies severity and dispatches field resolution.
          </p>

          <div className="hero-cta-group">
            <Link to={user ? "/report" : "/login"} className="btn-primary hero-btn">
              <Camera className="btn-icon" />
              <span>Report an Issue</span>
              <ArrowRight className="arrow-icon" />
            </Link>

            <Link to={user ? "/volunteer" : "/login"} className="btn-secondary hero-btn">
              <Users className="btn-icon" />
              <span>Join as Volunteer</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="hero-visual">
          <div className="visual-card glass-card">
            <div className="visual-header">
              <div className="visual-dot red" />
              <div className="visual-dot yellow" />
              <div className="visual-dot green" />
              <span className="visual-title">Live AI Inspection Demo</span>
            </div>
            
            <div className="visual-preview">
              <div className="preview-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80" 
                  alt="Road damage preview" 
                  className="preview-img"
                />
                <div className="preview-ai-overlay">
                  <Cpu className="ai-pulse-icon" />
                  <span>Gemini AI Analyzing...</span>
                </div>
              </div>

              <div className="preview-meta">
                <div className="meta-row">
                  <span className="meta-label">Category:</span>
                  <span className="meta-val highlight">Pothole / Road Surface</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Severity:</span>
                  <span className="meta-val badge badge-rejected">High Priority</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Cost Est:</span>
                  <span className="meta-val">~$450 USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS METRICS BAR */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper purple">
              <Camera className="stat-icon" />
            </div>
            <div className="stat-info">
              <h3 className="stat-number">1,450+</h3>
              <p className="stat-label">Issues Pinned</p>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper teal">
              <Cpu className="stat-icon" />
            </div>
            <div className="stat-info">
              <h3 className="stat-number">99.2%</h3>
              <p className="stat-label">AI Class Accuracy</p>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper green">
              <CheckCircle2 className="stat-icon" />
            </div>
            <div className="stat-info">
              <h3 className="stat-number">920+</h3>
              <p className="stat-label">Resolved Reports</p>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper amber">
              <Users className="stat-icon" />
            </div>
            <div className="stat-info">
              <h3 className="stat-number">380+</h3>
              <p className="stat-label">Active Volunteers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-STEP PROCESS WORKFLOW */}
      <section className="process-section">
        <div className="section-header">
          <span className="section-tag">Simple & Transparent</span>
          <h2 className="section-heading">How ProbMap Works</h2>
          <p className="section-subheading">From photo submission to authority repair in 4 automated steps.</p>
        </div>

        <div className="process-grid">
          <div className="process-card glass-card">
            <div className="step-badge">01</div>
            <div className="step-icon-bg">
              <Camera className="step-icon" />
            </div>
            <h3>Spot & Capture</h3>
            <p>Snap a photo of the damaged public infrastructure on your phone or upload an existing image.</p>
          </div>

          <div className="process-card glass-card">
            <div className="step-badge">02</div>
            <div className="step-icon-bg">
              <Cpu className="step-icon" />
            </div>
            <h3>AI Vision Verification</h3>
            <p>Gemini Vision AI classifies damage type, calculates urgency, and estimates repair costs automatically.</p>
          </div>

          <div className="process-card glass-card">
            <div className="step-badge">03</div>
            <div className="step-icon-bg">
              <MapPin className="step-icon" />
            </div>
            <h3>Geo-Tagged Dispatch</h3>
            <p>GPS coordinates and district details are mapped and dispatched to local municipal authorities & volunteers.</p>
          </div>

          <div className="process-card glass-card">
            <div className="step-badge">04</div>
            <div className="step-icon-bg">
              <Award className="step-icon" />
            </div>
            <h3>Resolution & Rewards</h3>
            <p>Track repair status in real-time, get resolution photo proof, and earn community social impact points.</p>
          </div>
        </div>
      </section>

      {/* FEATURES SHOWCASE */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">Built for Impact</span>
          <h2 className="section-heading">Why Choose ProbMap?</h2>
        </div>

        <div className="features-grid">
          <div className="feature-box glass-card">
            <Clock className="feature-box-icon" />
            <h3>Real-Time Issue Tracking</h3>
            <p>Monitor status changes live — from initial submission to admin response and volunteer claims.</p>
          </div>

          <div className="feature-box glass-card">
            <ShieldAlert className="feature-box-icon" />
            <h3>AI Property Validation</h3>
            <p>Smart vision model distinguishes public property from private issues to reduce bogus submissions.</p>
          </div>

          <div className="feature-box glass-card">
            <Users className="feature-box-icon" />
            <h3>Community Volunteer Network</h3>
            <p>Empowers local citizens to claim issues, resolve neighborhood problems, and submit photo proof.</p>
          </div>

          <div className="feature-box glass-card">
            <Layers className="feature-box-icon" />
            <h3>District Analytics</h3>
            <p>High-resolution map visualization for city administrators to identify damage hotspots.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="cta-banner-section">
        <div className="cta-banner glass-card">
          <div className="cta-content">
            <h2>Ready to make your neighborhood safer?</h2>
            <p>Join thousands of citizens taking active initiative in public infrastructure upkeep.</p>
          </div>
          <Link to={user ? "/report" : "/login"} className="btn-primary cta-banner-btn">
            <span>Get Started Free</span>
            <ArrowRight className="arrow-icon" />
          </Link>
        </div>
      </section>
    </div>
  );
}