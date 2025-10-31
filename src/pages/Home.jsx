
// src/pages/Home.jsx
import React from "react";
import { Link, useOutletContext } from "react-router-dom";

export default function Home() {
  const { T } = useOutletContext?.() || {};
  const H = (T && T.home) || {};

  return (
    <div className="container">
      {/* ================= HERO (stars background is on the section) ================= */}
      <section
        className="hero hero--stars"
        aria-label={H.tagline || "Planora – a simple micro-business planner"}
      >
        <div className="hero__inner">
          {/* Left panel */}
          <div className="hero__copy card glass">
            <h1 className="hero__title">Planora</h1>
            <p className="hero__subtitle">
              {H.tagline ||
                "A simple micro-business planner for fast, practical action."}
            </p>
            <div className="hero__cta">
              <Link to="/app" className="btn" aria-label="Open planner">
                {H.getStarted || "Open Planner"}
              </Link>
              <a
                href="#features"
                className="btn btn--ghost"
                aria-label="Learn features"
              >
                {H.learnMore || "Learn more"}
              </a>
            </div>
          </div>

          {/* Right panel */}
          <aside className="hero__demo card glass" aria-label="Quick examples">
            <div className="hero__demoTitle">
              {H.demoTitle || "Try a quick example"}
            </div>
            <ul className="hero__demoList" role="list">
              <li>• {H.exFoodTitle || "Homemade Food"}</li>
              <li>• {H.exTailorTitle || "Tailoring"}</li>
              <li>• {H.exTutorTitle || "Tutoring"}</li>
            </ul>
            <Link to="/app" className="btn btn--secondary" aria-label="Start demo">
              {H.tryNow || "Try now"}
            </Link>
          </aside>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="card" aria-labelledby="gallery-title">
        <h2 id="gallery-title">
          {H.examplesTitle || "Real micro-business examples"}
        </h2>
        <div className="gallery">
          <article className="gallery__item">
            <img
              src="/images/food.webp"
              alt={
                H.altFood ||
                "Homemade food micro-business preparing mantoo dumplings"
              }
              loading="lazy"
              decoding="async"
              width="640"
              height="420"
              className="gallery__img"
            />
            <div className="gallery__meta">
              <h3 className="gallery__title">
                {H.exFoodTitle || "Homemade Food"}
              </h3>
              <p className="gallery__desc">
                {H.exFoodDesc ||
                  "Fresh, local meals prepared to order and delivered nearby."}
              </p>
            </div>
          </article>

          <article className="gallery__item">
            <img
              src="/images/tailoring.webp"
              alt={H.altTailor || "Tailor sewing at home on a machine"}
              loading="lazy"
              decoding="async"
              width="640"
              height="420"
              className="gallery__img"
            />
            <div className="gallery__meta">
              <h3 className="gallery__title">{H.exTailorTitle || "Tailoring"}</h3>
              <p className="gallery__desc">
                {H.exTailorDesc ||
                  "Alterations and made-to-measure clothing for locals."}
              </p>
            </div>
          </article>

          <article className="gallery__item">
            <img
              src="/images/tutoring.webp"
              alt={H.altTutor || "Home tutoring session with students and a laptop"}
              loading="lazy"
              decoding="async"
              width="640"
              height="420"
              className="gallery__img"
            />
            <div className="gallery__meta">
              <h3 className="gallery__title">{H.exTutorTitle || "Tutoring"}</h3>
              <p className="gallery__desc">
                {H.exTutorDesc ||
                  "After-school lessons with simple online materials."}
              </p>
            </div>
          </article>

          <article className="gallery__item">
            <img
              src="/images/crafts.webp"
              alt={H.altCrafts || "Home crafts or simple beauty services"}
              loading="lazy"
              decoding="async"
              width="640"
              height="420"
              className="gallery__img"
            />
            <div className="gallery__meta">
              <h3 className="gallery__title">
                {H.exCraftsTitle || "Crafts / Beauty"}
              </h3>
              <p className="gallery__desc">
                {H.exCraftsDesc ||
                  "Hand-made items or basic beauty services from home."}
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="card">
        <h2>{H.featuresTitle || "Why Planora?"}</h2>
        <div className="features">
          <div className="feature">
            <div className="feature__title">
              {H.f1 || "Fast, clear planning"}
            </div>
            <div className="feature__desc">
              {H.f1d ||
                "Answer a few fields, get a realistic weekly plan and content ideas."}
            </div>
          </div>
          <div className="feature">
            <div className="feature__title">{H.f2 || "Local & low-cost"}</div>
            <div className="feature__desc">
              {H.f2d ||
                "Advice that fits small budgets and local delivery constraints."}
            </div>
          </div>
          <div className="feature">
            <div className="feature__title">
              {H.f3 || "Simple budgeting"}
            </div>
            <div className="feature__desc">
              {H.f3d ||
                "Track costs vs. prices with a quick chart and keep it realistic."}
            </div>
          </div>
          <div className="feature">
            <div className="feature__title">
              {H.f4 || "English • Dari • Pashto"}
            </div>
            <div className="feature__desc">
              {H.f4d ||
                "Switch language in the planner header; RTL supported."}
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="card">
        <h2>{H.howTitle || "How it works"}</h2>
        <ol className="steps">
          <li>{H.how1 || "Open the planner and enter your business info."}</li>
          <li>{H.how2 || "Click Generate to get a weekly plan and posts."}</li>
          <li>
            {H.how3pdf ||
              "Edit, export JSON/CSV/PDF, and take action. (PDF gives you a clean, printable version.)"}
          </li>
        </ol>
        <div className="ctaRow">
          <Link to="/app" className="btn" aria-label="Open planner">
            {H.openPlanner || "Open Planner"}
          </Link>
          <Link to="/about" className="btn btn--ghost" aria-label="About Planora">
            {H.about || "About"}
          </Link>
        </div>
      </section>
    </div>
  );
}
