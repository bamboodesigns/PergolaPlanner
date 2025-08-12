# src/App.jsx
```jsx
import React, { useMemo, useState } from "react";

/**
 * Minimal Pergola Planner
 * - No external UI libs
 * - Single component
 * - Inline sample product data you can replace
 *
 * Matching logic mirrors your original planner:
 * - Parses "Size" spec (e.g., "14x14 ft")
 * - Filters plans that fit within user width/depth
 * - Scores by fit + reasonable area coverage
 *
 * Source inspiration: your PergolaPlannerPage.jsx (simplified):contentReference[oaicite:1]{index=1}
 */

// ---- 1) Replace this with your real catalog later ----
const PRODUCTS = [
  {
    id: "la-luxe-14x14",
    title: "Los Angeles Luxe 14x14 Pergola",
    slug: "los-angeles-luxe-14x14",
    image:
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f3?q=80&w=1200&auto=format&fit=crop",
    product_url: "https://bamboodesigns.com/plans/los-angeles-luxe-14x14",
    specs: [
      { label: "Size", value: "14x14 ft" },
      { label: "Roof", value: "Flat" },
      { label: "Style", value: "Modern" },
    ],
  },
  {
    id: "denver-peak-16x16",
    title: "Denver Peak 16x16 Pergola",
    slug: "denver-peak-16x16",
    image:
      "https://images.unsplash.com/photo-1505692794403-34d4982b49a1?q=80&w=1200&auto=format&fit=crop",
    product_url: "https://bamboodesigns.com/plans/denver-peak-16x16",
    specs: [
      { label: "Size", value: "16x16 ft" },
      { label: "Roof", value: "Gable" },
      { label: "Style", value: "Classic" },
    ],
  },
  {
    id: "orlando-oasis-12x16",
    title: "Orlando Oasis 12x16 Pergola",
    slug: "orlando-oasis-12x16",
    image:
      "https://images.unsplash.com/photo-1470246973918-29a93221c455?q=80&w=1200&auto=format&fit=crop",
    product_url: "https://bamboodesigns.com/plans/orlando-oasis-12x16",
    specs: [
      { label: "Size", value: "12x16 ft" },
      { label: "Roof", value: "Sloped" },
      { label: "Style", value: "Tropical" },
    ],
  },
];

// ---- 2) Tiny helpers ----
const parseSize = (val) => {
  if (!val) return null;
  // accept "14x14 ft", "14 x 14", "14 by 14"
  const clean = String(val).toLowerCase().replace(/ft|'/g, "").trim();
  const parts = clean.split(/x| by /).map((s) => parseFloat(s.trim()));
  if (parts.length < 2 || parts.some(Number.isNaN)) return null;
  return { w: parts[0], d: parts[1] };
};

export default function App() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    width: "",
    depth: "",
    useCase: "",
    style: "",
  });

  const [validated, setValidated] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const canSubmit =
    form.width && form.depth && Number(form.width) > 0 && Number(form.depth) > 0;

  const recommendations = useMemo(() => {
    if (!validated) return [];
    const width = Number(form.width);
    const depth = Number(form.depth);
    const userArea = width * depth;

    const recs = PRODUCTS.map((p) => {
      const sizeSpec = p.specs.find((s) => s.label.toLowerCase() === "size");
      if (!sizeSpec) return null;
      const parsed = parseSize(sizeSpec.value);
      if (!parsed) return null;

      const canFit = parsed.w <= width && parsed.d <= depth;
      if (!canFit) return null;

      // favor 30–80% coverage
      const coverage = (parsed.w * parsed.d) / userArea;
      let score = 0;
      if (canFit) score += 100;
      if (coverage > 0.3 && coverage < 0.8) score += 50;

      // light preference nudge by style (optional)
      const styleSpec = p.specs.find((s) => s.label.toLowerCase() === "style");
      if (form.style && styleSpec?.value?.toLowerCase().includes(form.style))
        score += 10;

      return {
        ...p,
        score,
        areaCoveragePct: Math.round(coverage * 100),
        bufferWidth: ((width - parsed.w) / 2).toFixed(1),
        bufferDepth: ((depth - parsed.d) / 2).toFixed(1),
      };
    })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9);

    return recs;
  }, [validated, form]);

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setValidated(true);
    setStep(2);
  };

  const reset = () => {
    setStep(1);
    setValidated(false);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
      {/* Header */}
      <div
        style={{
          padding: "40px 16px",
          textAlign: "center",
          background: "#f4f7f5",
          borderBottom: "1px solid #e6eae7",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 36 }}>Pergola Planner</h1>
        <p style={{ marginTop: 8, color: "#333" }}>
          Tell us your space. We’ll suggest pergolas that actually fit.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        {step === 1 && (
          <form
            onSubmit={submit}
            style={{
              maxWidth: 720,
              margin: "0 auto",
              border: "1px solid #e6e6e6",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
              background: "#fff",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Step 1: Your Outdoor Space</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginTop: 12,
              }}
            >
              <div>
                <label>Available Width (ft)</label>
                <input
                  type="number"
                  name="width"
                  min="1"
                  step="0.1"
                  value={form.width}
                  onChange={onChange}
                  placeholder="e.g., 15"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label>Available Depth (ft)</label>
                <input
                  type="number"
                  name="depth"
                  min="1"
                  step="0.1"
                  value={form.depth}
                  onChange={onChange}
                  placeholder="e.g., 20"
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label>Main Use Case</label>
              <select
                name="useCase"
                value={form.useCase}
                onChange={onChange}
                style={inputStyle}
              >
                <option value="">Select…</option>
                <option value="dining">Outdoor Dining</option>
                <option value="lounge">Lounging / Seating</option>
                <option value="hottub">Hot Tub / Spa</option>
                <option value="general">General Shade</option>
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              <label>Desired Style</label>
              <select
                name="style"
                value={form.style}
                onChange={onChange}
                style={inputStyle}
              >
                <option value="">Any</option>
                <option value="modern">Modern</option>
                <option value="farmhouse">Farmhouse</option>
                <option value="tropical">Tropical</option>
                <option value="classic">Classic</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "12px 16px",
                background: "#0ea5a0",
                border: 0,
                color: "#fff",
                borderRadius: 10,
                fontWeight: 700,
                cursor: canSubmit ? "pointer" : "not-allowed",
                opacity: canSubmit ? 1 : 0.6,
              }}
            >
              Find My Pergola →
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h2>Your Pergola Matches</h2>
              <p>Based on your space, here are top picks.</p>
            </div>

            {recommendations.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 24,
                  border: "1px dashed #ccc",
                  borderRadius: 12,
                  background: "#fafafa",
                }}
              >
                <p>No direct matches found. Try different dimensions or view all plans.</p>
                <a
                  href="https://bamboodesigns.com/products?category=pergolas"
                  style={{ color: "#0ea5a0", fontWeight: 700 }}
                >
                  View All Pergolas
                </a>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      border: "1px solid #e6e6e6",
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#fff",
                      boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                      <img
                        src={rec.image}
                        alt={rec.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: 14, flex: 1 }}>
                      <h3 style={{ marginTop: 0 }}>{rec.title}</h3>
                      <div
                        style={{
                          fontSize: 14,
                          background: "rgba(14,165,160,0.08)",
                          padding: "6px 10px",
                          borderRadius: 999,
                          display: "inline-block",
                        }}
                      >
                        Space coverage: <strong>{rec.areaCoveragePct}%</strong>
                      </div>
                      <ul style={{ marginTop: 10, paddingLeft: 18, fontSize: 14 }}>
                        <li>Side clearance ~{rec.bufferWidth} ft</li>
                        <li>Front/back clearance ~{rec.bufferDepth} ft</li>
                      </ul>
                    </div>
                    <div style={{ padding: 14 }}>
                      <a
                        href={rec.product_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "block",
                          textAlign: "center",
                          width: "100%",
                          padding: "10px 14px",
                          background: "#0ea5a0",
                          color: "#fff",
                          borderRadius: 10,
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        View Plan
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button
                onClick={reset}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* disclaimer */}
        <div
          style={{
            marginTop: 32,
            border: "1px solid #fde68a",
            background: "#fffbeb",
            color: "#92400e",
            padding: 16,
            borderRadius: 12,
            fontSize: 14,
          }}
        >
          <strong>Important:</strong> This tool provides preliminary recommendations only. Always
          confirm local code, structural requirements, and exact clearances before building.
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: 8,
  padding: "10px 12px",
  marginTop: 6,
};
