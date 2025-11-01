import React from "react";
import { stripEnglishPrefixes } from "../lib/text.js";
import { STR } from "../lib/i18n.js";

export default function PlanOutput({ plan, i18n, language = "English" }) {
  
  const L = (STR && STR[language]) || i18n || {};
  const clean = (x) => (typeof x === "string" ? stripEnglishPrefixes(x, language) : x);

  const slogans = (plan?.slogans || []).map(clean);

  const productCopy = (plan?.product_copy || []).map((p) => ({
    product: clean(p?.product || ""),
    description: clean(p?.description || ""),
    cta: clean(p?.cta || ""),
  }));

  const priceHint = clean(plan?.price_hint || "");

  const contentCalendar = (plan?.content_calendar || []).map((c) => ({
    title: clean(c?.title || ""),
    prompt: clean(c?.prompt || ""),
  }));

  const nextSteps = (plan?.next_steps || []).map(clean);

  const weekDaily = (plan?.one_week_plan?.daily_actions || []).map(clean);
  const quickWins = (plan?.one_week_plan?.quick_wins || []).map(clean);

  const persona = {
    name: clean(plan?.customer_persona?.name || ""),
    age_range: clean(plan?.customer_persona?.age_range || ""),
    needs: (plan?.customer_persona?.needs || []).map(clean),
    where_to_find_them: (plan?.customer_persona?.where_to_find_them || []).map(clean),
  };

  return (
    <section className="card">
      <h2>{L.output?.title ?? "Your Planora Output"}</h2>

      <div className="grid-2">
        <div>
          <h3>{L.output?.slogans ?? "Slogans"}</h3>
          <ul>{slogans.map((s, i) => <li key={i}>{s}</li>)}</ul>

          <h3>{L.output?.productCopy ?? "Product Copy"}</h3>
          <ul>
            {productCopy.map((p, i) => (
              <li key={i}>
                <strong>{p.product}:</strong> {p.description}{" "}
                {p.cta ? <em>{p.cta}</em> : null}
              </li>
            ))}
          </ul>

          <h3>{L.output?.priceHint ?? "Price Hint"}</h3>
          <p>{priceHint}</p>

          <h3>{L.output?.contentCalendar ?? "Content Calendar"}</h3>
          <ol>
            {contentCalendar.map((c, i) => (
              <li key={i}>
                <strong>{c.title}</strong>: {c.prompt}
              </li>
            ))}
          </ol>

          <h3>{L.output?.nextSteps ?? "Next Steps"}</h3>
          <ul>{nextSteps.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>

        <div>
          <h3>{L.output?.weekPlan ?? "One-Week Plan"}</h3>
          <ul>{weekDaily.map((d, i) => <li key={i}>{d}</li>)}</ul>
          {!!quickWins.length && (
            <p>
              <strong>{L.output?.quickWins ?? "Quick wins"}:</strong>{" "}
              {quickWins.join(" • ")}
            </p>
          )}

          <h3>{L.output?.persona ?? "Customer Persona"}</h3>
          {(persona.name || persona.age_range) && (
            <p>
              <strong>{persona.name}</strong>
              {persona.age_range ? ` (${persona.age_range})` : ""}
            </p>
          )}
          {!!persona.needs.length && (
            <p>
              <strong>{L.output?.needs ?? "Needs"}:</strong>{" "}
              {persona.needs.join(", ")}
            </p>
          )}
          {!!persona.where_to_find_them.length && (
            <p>
              <strong>{L.output?.find ?? "Find them on"}:</strong>{" "}
              {persona.where_to_find_them.join(", ")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
