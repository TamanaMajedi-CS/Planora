import React from "react";

export default function PlanForm({
  state,
  setState,
  onGenerate,
  loading,
  disableGenerate,
  i18n,
  hideLanguageSelect = false,
}) {
  const L = i18n || {
    sections: { inputs: "Business Inputs" },
    labels: {
      businessName: "Business Name",
      category: "Category",
      location: "Location",
      targetCustomer: "Target Customer",
      businessType: "Business type",
      product: "Product",
      service: "Service",
      planLength: "Plan length",
      language: "Language",
      constraints: "Constraints",
      products: "Products",
      notes: "Notes (anything else)",
      addProduct: "+ Add Product",
      remove: "Remove",
    },
    lengths: { short: "Short", long: "Long" },
    ph: {
      businessName: "Business name…",
      category: "e.g., tailoring, homemade food",
      location: "e.g., Kabul (optional)",
      targetCustomer: "e.g., students, office workers",
      constraints: "e.g., low budget; local delivery only",
      notes: "Any extra info or preferences…",
      productName: "Product / service name…",
      costOpt: "Cost (optional)",
      priceOpt: "Price (optional)",
    },
    lang: { en: "English", fa: "Dari", ps: "Pashto" },
    loading: "Generating…",
    generate: "Generate Plan",
    errorFill:
      "Fill required: Business Name or we'll suggest one, Category, Target Customer.",
  };

  const update = (k, v) => setState((prev) => ({ ...prev, [k]: v }));
  const updateArray = (key, idx, field, value) => {
    setState((prev) => {
      const arr = prev[key].slice();
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, [key]: arr };
    });
  };
  const removeRow = (key, idx) => {
    setState((prev) => {
      const arr = prev[key].slice();
      arr.splice(idx, 1);
      return {
        ...prev,
        [key]: arr.length
          ? arr
          : key === "products"
          ? [{ name: "", cost: undefined, price: undefined }]
          : [],
      };
    });
  };

  return (
    <section className="card">
      <h2>{L.sections?.inputs || "Business Inputs"}</h2>

      <div className="grid">
        <label>
          {L.labels?.businessName || "Business Name"}
          <input
            placeholder={L.ph?.businessName || "Business name…"}
            value={state.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            disabled={loading}
          />
        </label>

        <label>
          {L.labels?.category || "Category"}
          <input
            placeholder={L.ph?.category || "e.g., tailoring, homemade food"}
            value={state.category}
            onChange={(e) => update("category", e.target.value)}
            disabled={loading}
          />
        </label>

        <label>
          {L.labels?.location || "Location"}
          <input
            placeholder={L.ph?.location || "e.g., Kabul (optional)"}
            value={state.location}
            onChange={(e) => update("location", e.target.value)}
            disabled={loading}
          />
        </label>

        <label>
          {L.labels?.targetCustomer || "Target Customer"}
          <input
            placeholder={L.ph?.targetCustomer || "e.g., students, office workers"}
            value={state.targetCustomer}
            onChange={(e) => update("targetCustomer", e.target.value)}
            disabled={loading}
          />
        </label>

        {/* Business type */}
        <label>
          {i18n?.labels?.businessType || "Business type"}
          <select
            value={state.businessType || "product"}
            onChange={(e) => update("businessType", e.target.value)}
            disabled={loading}
          >
            <option value="product">{i18n?.labels?.product || "Product"}</option>
            <option value="service">{i18n?.labels?.service || "Service"}</option>
          </select>
        </label>

        {/* Plan length */}
        <label>
          {i18n?.labels?.planLength || "Plan length"}
          <select
            value={state.detailLevel || "short"}
            onChange={(e) => update("detailLevel", e.target.value)}
            disabled={loading}
          >
            <option value="short">{i18n?.lengths?.short || "Short"}</option>
            <option value="long">{i18n?.lengths?.long || "Long"}</option>
          </select>
        </label>

        {/* Language (hidden when controlled globally) */}
        {!hideLanguageSelect && (
          <label>
            {L.labels?.language || "Language"}
            <select
              value={state.language}
              onChange={(e) => update("language", e.target.value)}
              disabled={loading}
            >
              <option value="English">{L.lang?.en || "English"}</option>
              <option value="Dari">{L.lang?.fa || "Dari"}</option>
              <option value="Pashto">{L.lang?.ps || "Pashto"}</option>
            </select>
          </label>
        )}
      </div>

      {/* Products — hidden if service */}
      {state.businessType !== "service" && (
        <>
          <h3>{L.labels?.products || "Products"}</h3>
          {state.products.map((p, i) => (
            <div key={i} className="row">
              <input
                placeholder={L.ph?.productName || "Product / service name…"}
                value={p.name}
                onChange={(e) => updateArray("products", i, "name", e.target.value)}
                disabled={loading}
              />
              <input
                type="number"
                placeholder={L.ph?.costOpt || "Cost (optional)"}
                value={p.cost ?? ""}
                onChange={(e) =>
                  updateArray(
                    "products",
                    i,
                    "cost",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                min="0"
                disabled={loading}
              />
              <input
                type="number"
                placeholder={L.ph?.priceOpt || "Price (optional)"}
                value={p.price ?? ""}
                onChange={(e) =>
                  updateArray(
                    "products",
                    i,
                    "price",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                min="0"
                disabled={loading}
              />
              <button
                type="button"
                className="btn--warn"
                onClick={() => removeRow("products", i)}
                disabled={loading}
              >
                {L.labels?.remove || "Remove"}
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn--secondary"
            onClick={() =>
              setState((s) => ({
                ...s,
                products: [
                  ...s.products,
                  { name: "", cost: undefined, price: undefined },
                ],
              }))
            }
            disabled={loading}
          >
            {L.labels?.addProduct || "+ Add Product"}
          </button>
        </>
      )}

      {/* Constraints */}
      <label>
        {L.labels?.constraints || "Constraints"}
        <input
          placeholder={L.ph?.constraints || "e.g., low budget; local delivery only"}
          value={state.constraints}
          onChange={(e) => update("constraints", e.target.value)}
          disabled={loading}
        />
      </label>

      {/* Notes / Anything else */}
      <label>
        {i18n?.labels?.notes || "Notes (anything else)"}
        <textarea
          rows={3}
          placeholder={L.ph?.notes || "Any extra info or preferences…"}
          value={state.notes || ""}
          onChange={(e) => update("notes", e.target.value)}
          disabled={loading}
        />
      </label>

      <div className="actions">
        <button onClick={onGenerate} disabled={loading || disableGenerate}>
          {loading ? L.loading : L.generate}
        </button>
        {disableGenerate && !loading && (
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
            {L.errorFill}
          </div>
        )}
      </div>
    </section>
  );
}
