
import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useOutletContext, Link } from "react-router-dom";
import PlanForm from "./components/PlanForm.jsx";
import { buildPlanoraPrompt } from "./lib/prompt.js";
import { BusinessState, PlanoraPlan } from "./lib/schema.js";
import { STR } from "./lib/i18n.js";

const BudgetChart = React.lazy(() => import("./components/BudgetChart.jsx"));
const PlanOutput  = React.lazy(() => import("./components/PlanOutput.jsx"));

const API_BASE = import.meta.env.VITE_API_BASE || "https://planora-api.pollyglot-ai.workers.dev";
const PUBLIC_HEADERS = {};

function suggestName(category, location) {
  const base = (category || "Business").toString().trim();
  const city = (location || "").toString().trim();
  const pick = ["Local","Fresh","Prime","Nova","Bright","Craft","Spark","Next"][Math.floor(Math.random()*8)];
  const chunk = [pick, base].filter(Boolean).join(" ");
  return city ? `${chunk} — ${city}` : chunk;
}
function getTemplatesFor(language, TEMPLATES_BY_LANG) {
  return TEMPLATES_BY_LANG[language] || TEMPLATES_BY_LANG.English;
}

/* ================= Multilingual Templates ================= */
const TEMPLATES_BY_LANG = {
  English: {
    "Homemade Food": {
      businessName: "Mama’s Kitchen",
      category: "homemade food",
      location: "Kabul",
      targetCustomer: "families and office workers",
      businessType: "product",
      detailLevel: "short",
      products: [{ name: "Beef Mantoo (6 pcs)", cost: 120, price: 200 }],
      constraints: "local delivery only",
      notes: ""
    },
    Tailoring: {
      businessName: "Stitch & Style",
      category: "tailoring",
      location: "Kabul",
      targetCustomer: "students and professionals",
      businessType: "service",
      detailLevel: "short",
      products: [],
      constraints: "low budget",
      notes: "Simple alterations and mending."
    },
    Tutoring: {
      businessName: "TopMarks",
      category: "tutoring",
      location: "Kabul",
      targetCustomer: "high-school students",
      businessType: "service",
      detailLevel: "short",
      products: [],
      constraints: "after-school hours only",
      notes: "Math + English focus."
    },
  },

  Dari: {
    "غذای خانگی": {
      businessName: "آشپزخانه ماما",
      category: "غذای خانگی",
      location: "کابل",
      targetCustomer: "خانواده‌ها و کارمندان",
      businessType: "product",
      detailLevel: "short",
      products: [{ name: "منتو گوشت (۶ عدد)", cost: 120, price: 200 }],
      constraints: "فقط تحویل محلی",
      notes: ""
    },
    "خیاطی": {
      businessName: "استیچ و استایل",
      category: "خیاطی",
      location: "کابل",
      targetCustomer: "محصلین و حرفه‌ای‌ها",
      businessType: "service",
      detailLevel: "short",
      products: [],
      constraints: "بودجه کم",
      notes: "رفو/تغییرات ساده"
    },
    "آموزش خصوصی": {
      businessName: "تاپ مارکس",
      category: "آموزش خصوصی",
      location: "کابل",
      targetCustomer: "شاگردان صنف بالا",
      businessType: "service",
      detailLevel: "short",
      products: [],
      constraints: "فقط بعد از مکتب",
      notes: "ریاضی + انگلیسی"
    },
  },

  Pashto: {
    "کورني خواړه": {
      businessName: "د ماما پخلنځی",
      category: "کورني خواړه",
      location: "کابل",
      targetCustomer: "کورنۍ او کارکوونکي",
      businessType: "product",
      detailLevel: "short",
      products: [{ name: "منتو (۶ دانې)", cost: 120, price: 200 }],
      constraints: "یوازې محلي سپارنه",
      notes: ""
    },
    "خیاطي": {
      businessName: "سټیچ او سټایل",
      category: "خیاطي",
      location: "کابل",
      targetCustomer: "محصلین او مسلکیان",
      businessType: "service",
      detailLevel: "short",
      products: [],
      constraints: "لږه بودیجه",
      notes: "اصلاحات/رفو"
    },
    "ښوونه": {
      businessName: "ټاپ مارکس",
      category: "ښوونه/ټیوشن",
      location: "کابل",
      targetCustomer: "د لیسې زده کوونکي",
      businessType: "service",
      detailLevel: "short",
      products: [],
      constraints: "یوازې د ښوونځي وروسته",
      notes: "ریاضي + انګلیسي"
    },
  },
};

export default function AppShell() {
  const ctx = (typeof useOutletContext === "function" ? useOutletContext() : null) || {};
  const language = ctx.language || "English";
  const T = ctx.T || STR?.English || {};

  const [state, setState] = useState({
    businessName: "",
    category: "",
    location: "",
    targetCustomer: "",
    businessType: "product",
    detailLevel: "short",
    language,
    products: [{ name: "", cost: undefined, price: undefined }],
    constraints: "",
    notes: ""
  });

  useEffect(() => setState(s => ({ ...s, language })), [language]);

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const validate = () => {
    const errs = [];
    if (!state.category.trim()) errs.push("Category is required.");
    if (!state.targetCustomer.trim()) errs.push("Target Customer is required.");
    if (state.businessType !== "service") {
      if (!state.products.length || !state.products[0].name?.trim()) {
        errs.push("Enter at least one product with a name (or switch to Service).");
      }
    }
    return errs;
  };
  const disableGenerate = useMemo(() => validate().length > 0, [state]);

  useEffect(() => {
    const p = localStorage.getItem("planora:lastPlan");
    if (p) setPlan(JSON.parse(p));
  }, []);
  useEffect(() => {
    if (plan) localStorage.setItem("planora:lastPlan", JSON.stringify(plan));
  }, [plan]);

  const mapResponse = async (res) => {
    const data = await res.json();
    if (data?.ok && typeof data.content === "string") return data.content;
    if (data?.ok && typeof data === "object") return JSON.stringify(data);
    if (!data?.ok && data?.error) throw new Error(data.error);
    throw new Error("API error");
  };

  // ---- helper: classify and localize errors
  const pickErrorMessage = (e, resStatus, bodyText) => {
    const E = T.errors || {};
    const text = String(bodyText || e?.message || e || "").toLowerCase();

    if (offline) return E.offline || "You’re offline. Some features won’t work.";
    if (resStatus === 504 || /timeout/.test(text)) return E.timeout || "The server took too long to respond. Please try again.";
    if (/cors/.test(text)) return E.cors || "Request was blocked by the browser (CORS). Please refresh and try again.";
    if (e?.name === "TypeError" && !resStatus) return E.network || "Network error. Check your internet connection and try again.";
    if (resStatus >= 500) return E.server || "Server error. Please try again.";
    return E.unknown || "Unexpected error. Please try again.";
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    setPlan(null);

    if (offline) {
      setLoading(false);
      setError(pickErrorMessage(new Error("offline")));
      return;
    }

    const errs = validate();
    if (errs.length) {
      setLoading(false);
      setError(errs.join(" | "));
      return;
    }

    const withName = {
      ...state,
      businessName: state.businessName?.trim()
        ? state.businessName.trim()
        : suggestName(state.category, state.location)
    };

    try {
      const cleaned = {
        ...withName,
        products: (withName.businessType === "service" ? [] : withName.products)
          .filter((p) => p.name?.trim())
          .map((p) => ({
            name: p.name.trim(),
            cost: p.cost === "" || p.cost == null ? undefined : Number(p.cost),
            price: p.price === "" || p.price == null ? undefined : Number(p.price),
          }))
      };

      const parsed = BusinessState.parse(cleaned);
      const messages = buildPlanoraPrompt(parsed);

      const res = await fetch(`${API_BASE}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...PUBLIC_HEADERS },
        body: JSON.stringify({ messages }),
      });
      if (!res.ok) {
        let txt = "";
        try { txt = await res.text(); } catch {}
        throw { status: res.status, message: txt || `HTTP ${res.status}` };
      }

      const planString = await mapResponse(res);
      const planJson = JSON.parse(planString);
      const valid = PlanoraPlan.parse(planJson);
      setPlan(valid);
    } catch (e) {
      console.error(e);
      const msg = pickErrorMessage(e, e?.status, e?.message);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Exports
  const exportJSON = () => {
    if (!plan) return;
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "planora-plan.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!plan) return;
    const lines = [
      "section,item",
      ...plan.slogans.map((s) => `slogan,"${s.replace(/"/g, '""')}"`),
      ...plan.next_steps.map((s) => `next_step,"${s.replace(/"/g, '""')}"`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "planora-plan.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!plan) return;
    const win = window.open("", "_blank");
    const title = T.title || "Planora — Micro-Business Planner";
    const o = T.output || {};
    const html = `
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8"/>
          <style>
            body{ font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; padding:24px; }
            h1,h2{ margin:0 0 10px }
            .section{ margin:16px 0; }
            ul{ margin:6px 0 0 18px }
            li{ margin:3px 0 }
            .grid{ display:grid; grid-template-columns:1fr 1fr; gap:16px }
            @media print{ .no-print{ display:none } }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div><strong>${state.businessName || suggestName(state.category, state.location)}</strong></div>
          <div>${state.category} • ${state.location || ""}</div>

          <div class="section">
            <h2>${o.slogans || "Slogans"}</h2>
            <ul>${plan.slogans.map(s=>`<li>${s}</li>`).join("")}</ul>
          </div>

          <div class="section">
            <h2>${o.weekPlan || "One-Week Plan"}</h2>
            <ul>${plan.one_week_plan.daily_actions.map(s=>`<li>${s}</li>`).join("")}</ul>
          </div>

          <div class="section">
            <h2>${o.productCopy || "Product Copy"}</h2>
            <ul>${plan.product_copy.map(p=>`<li><strong>${p.product}:</strong> ${p.description} <em>${p.cta}</em></li>`).join("")}</ul>
          </div>

          <div class="section">
            <h2>${o.nextSteps || "Next Steps"}</h2>
            <ul>${plan.next_steps.map(s=>`<li>${s}</li>`).join("")}</ul>
          </div>

          <button class="no-print" onclick="window.print()">${T.export?.print || "Print / Save PDF"}</button>
        </body>
      </html>
    `;
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  const templates = getTemplatesFor(language, TEMPLATES_BY_LANG);

  return (
    <div>
      {/* prefetch App on hover (micro-optimization) */}
      <Link to="/app" onMouseEnter={() => import("./AppShell.jsx")} className="btn btn--ghost" style={{display:"none"}}>prefetch</Link>

      {offline && (
        <div className="error" role="alert" style={{ marginBottom: 12 }}>
          📡 {T.errors?.offline || "You’re offline. Some features won’t work."}
        </div>
      )}

      {/* Hero header with background image */}
      <div className="card hero--stars" style={{ marginBottom: 12 }}>
        <div className="hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">
              {T.title ?? "Planora — Micro-Business Planner"}
            </h1>
          </div>
          <div aria-hidden="true" />
        </div>
      </div>

      {/* Templates */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="templates-row">
          <strong className="templates-label">
            {T.labels?.templates || "Templates"}:
          </strong>

          <div className="templates-chips">
            {Object.entries(templates).map(([label, payload]) => (
              <button
                key={label}
                className="btn btn--ghost"
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    ...payload,
                    language, 
                    products:
                      payload.products?.length
                        ? payload.products
                        : [{ name: "", cost: undefined, price: undefined }],
                  }))
                }
              >
                {label}
              </button>
            ))}

            <button
              className="btn--secondary"
              onClick={() =>
                setState({
                  businessName: "",
                  category: "",
                  location: "",
                  targetCustomer: "",
                  businessType: "product",
                  detailLevel: "short",
                  language,
                  products: [{ name: "", cost: undefined, price: undefined }],
                  constraints: "",
                  notes: "",
                })
              }
            >
              {T.clear || "Clear"}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <PlanForm
        state={state}
        setState={setState}
        onGenerate={generate}
        loading={loading}
        disableGenerate={disableGenerate}
        i18n={T}
        hideLanguageSelect={true}
      />

      {/* Error */}
      {error && (
        <div className="error" role="alert" aria-live="assertive" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
          <div>⚠️ <strong>{T.errors?.heading || "Something went wrong"}</strong> — {error}</div>
          <button onClick={generate} className="btn--secondary">{T.retry ?? "Retry"}</button>
        </div>
      )}

      {/* Loading overlay  */}
      {loading && (
        <div className="overlay" aria-live="polite" aria-busy="true">
          <div className="loader" role="status" aria-label={T.generating ?? "Generating"}>
            <div className="loader__ring" aria-hidden="true" />
            <div className="loader__title">
              {T.generating ?? "Generating"}
              <span className="dots">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
            </div>
            <div className="loader__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} />
            <div className="loader__hint">{T.pleaseWait ?? "Please wait…"}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {plan && (
        <Suspense fallback={<div className="card">Loading chart…</div>}>
          <BudgetChart products={state.products || []} expenses={[]} i18n={T} />
        </Suspense>
      )}

      {plan && (
        <Suspense fallback={<div className="card">Loading plan…</div>}>
          {/* 🔻 only change: pass language */}
          <PlanOutput plan={plan} i18n={T} language={language} />
        </Suspense>
      )}

      {plan && (
        <div className="card sticky-exports">
          <button onClick={exportJSON}>{T.export?.json || "Export JSON"}</button>
          <button onClick={exportCSV}>{T.export?.csv || "Export CSV"}</button>
          <button onClick={exportPDF} className="btn--secondary">{T.export?.pdf || "Export PDF"}</button>
        </div>
      )}
    </div>
  );
}
