// src/pages/About.jsx
import React from "react";
import { Link, useOutletContext } from "react-router-dom";

export default function About() {
  const ctx = (typeof useOutletContext === "function" ? useOutletContext() : {}) || {};
  const T = ctx.T || {};
  const A = T.about || {};

  return (
    <div className="container">
      {/* Hero header with background image */}
      <div className="card hero--stars" style={{ marginBottom: 16 }}>
        <div className="hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">
              {A.title || "About Planora"}
            </h1>
            <p className="hero__subtitle">
              {A.tagline || "A lightweight micro-business planner focused on practical, local steps."}
            </p>
          </div>
          <div aria-hidden="true" />
        </div>
      </div>

      <section className="card">
        <h2>{A.missionTitle || "Our mission"}</h2>
        <p>
          {A.mission ||
            "Help people start or improve a micro-business quickly—with realistic suggestions that fit low budgets, local delivery, and everyday life."}
        </p>

        <div className="features" style={{ marginTop: 12 }}>
          <div className="feature">
            <div className="feature__title">{A.goal1 || "Simple & fast"}</div>
            <div className="feature__desc">
              {A.goal1d ||
                "Fill a few fields and generate a weekly action plan, social posts, and next steps in seconds."}
            </div>
          </div>
          <div className="feature">
            <div className="feature__title">{A.goal2 || "Local & low-cost"}</div>
            <div className="feature__desc">
              {A.goal2d ||
                "Content and ideas consider small budgets and local realities."}
            </div>
          </div>
          <div className="feature">
            <div className="feature__title">{A.goal3 || "Multilingual"}</div>
            <div className="feature__desc">
              {A.goal3d || "English • Dari • Pashto with RTL support."}
            </div>
          </div>
          <div className="feature">
            <div className="feature__title">{A.goal4 || "Own your data"}</div>
            <div className="feature__desc">
              {A.goal4d ||
                "Your plan is stored in your browser (localStorage). Export JSON/CSV/PDF anytime."}
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>{A.howTitle || "How it works"}</h2>
        <ol className="steps">
          <li>
            {A.how1 ||
              "Open the planner and enter your business name, products/services, and details."}
          </li>
          <li>{A.how2 || "Click Generate to create a plan and social content."}</li>
          <li>
            {A.how3 ||
              "Review, tweak, and export your plan as PDF/JSON/CSV to save, print, or share."}
          </li>
        </ol>
        <div className="ctaRow">
          <Link to="/app" className="btn" aria-label="Open planner">
            {A.openPlanner || "Open Planner"}
          </Link>
          <Link to="/" className="btn btn--ghost" aria-label="Back to Home">
            {A.backHome || "Back to Home"}
          </Link>
        </div>
      </section>

      <section className="card">
        <h2>{A.privacyTitle || "Privacy & data"}</h2>
        <div className="block">
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
            <li>
              {A.privacy1 ||
                "Your generated plan is saved only in your browser (localStorage)."}
            </li>
            <li>
              {A.privacyExport ||
                "You can export your plan as PDF, JSON, or CSV anytime."}
            </li>
            <li>
              {A.privacy2 ||
                "You can delete your saved plan anytime by clearing your browser data."}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
