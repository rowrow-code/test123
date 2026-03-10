import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const G = {
  gold: "#C9A84C",
  goldLight: "#E8C97A",
  goldDark: "#A67C30",
  goldGlow: "rgba(201,168,76,0.25)",
  cream: "#FDFAF3",
  white: "#FFFFFF",
  dark: "#0D0C0A",
  darkCard: "#141210",
  darkBorder: "#2A2520",
  muted: "#6B6355",
  text: "#1A1814",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'DM Sans', sans-serif; background: ${G.cream}; color: ${G.text}; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${G.cream}; }
  ::-webkit-scrollbar-thumb { background: ${G.gold}; border-radius: 3px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.85); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes chatPop {
    0% { opacity: 0; transform: scale(0.8) translateY(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes dotBounce {
    0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
  }

  .fade-up { animation: fadeUp 0.6s ease forwards; }
  .fade-in { animation: fadeIn 0.4s ease forwards; }

  .gold-text {
    background: linear-gradient(135deg, ${G.goldDark}, ${G.gold}, ${G.goldLight}, ${G.gold});
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .glass {
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(201,168,76,0.2);
  }

  .card-shadow {
    box-shadow: 0 4px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(201,168,76,0.15);
  }

  .gold-btn {
    background: linear-gradient(135deg, ${G.goldDark} 0%, ${G.gold} 50%, ${G.goldLight} 100%);
    color: #fff;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    letter-spacing: 0.02em;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .gold-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
    transform: translateX(-100%);
    transition: transform 0.4s ease;
  }
  .gold-btn:hover::after { transform: translateX(100%); }
  .gold-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px ${G.goldGlow}; }
  .gold-btn:active { transform: translateY(0); }

  .outline-btn {
    background: transparent;
    color: ${G.gold};
    border: 1.5px solid ${G.gold};
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  .outline-btn:hover { background: ${G.goldGlow}; transform: translateY(-1px); }

  input, textarea, select {
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: all 0.3s ease;
  }
  input:focus, textarea:focus {
    border-color: ${G.gold} !important;
    box-shadow: 0 0 0 3px ${G.goldGlow};
  }

  .nav-link {
    color: ${G.muted};
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
  }
  .nav-link:hover { color: ${G.gold}; }

  .typing-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: ${G.gold};
    display: inline-block;
    animation: dotBounce 1.4s ease-in-out infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  .pattern-bg {
    background-image: radial-gradient(circle at 1px 1px, rgba(201,168,76,0.12) 1px, transparent 0);
    background-size: 32px 32px;
  }

  .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(201,168,76,0.15); }
  .stat-card { transition: all 0.3s ease; }

  .chatbot-row:hover { background: rgba(201,168,76,0.05); }
  .chatbot-row { transition: background 0.2s; }

  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .full-mobile { width: 100% !important; }
  }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_BOTS = [
  { id: 1, name: "Bella Vista Restaurant", url: "bellavista.com", status: "active", visitors: 1243, questions: 389, created: "2025-02-14" },
  { id: 2, name: "Sunset Bay Hotel", url: "sunsetbayhotel.com", status: "active", visitors: 892, questions: 274, created: "2025-02-28" },
  { id: 3, name: "Pacific Coast Tours", url: "pacificcoasttours.com", status: "training", visitors: 0, questions: 0, created: "2025-03-08" },
];

// ─── CLAUDE API CALL ─────────────────────────────────────────────────────────
async function askClaude(systemPrompt, userMessage) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "I couldn't process that request.";
}

// ─── CRAWL + EXTRACT (simulated) ─────────────────────────────────────────────
async function extractWebsiteContent(url) {
  // Ask Claude to simulate what would be scraped from this URL
  const content = await askClaude(
    `You are a website content extractor. When given a website URL, generate realistic, detailed business content that would typically be found on that type of business website. Include: business name, description, services/menu/offerings, hours, location, contact info, FAQs, policies, and any other relevant business information. Make it specific and realistic based on the domain name. Return it as structured text.`,
    `Extract and return the website content from: ${url}. Make it detailed and realistic for this type of business.`
  );
  return content;
}

// ─── ICON COMPONENTS ─────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  bot: "M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2zm-4 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm6 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z",
  check: "M20 6L9 17l-5-5",
  copy: "M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4H8zM14 2v6h6M10 12h4M10 16h4",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8.93-1.87a8 8 0 0 0 .07-1.13 8 8 0 0 0-.07-1.13l2.13-1.66a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.52 1.01a7.94 7.94 0 0 0-1.94-1.12l-.38-2.67A.49.49 0 0 0 15 3h-4a.49.49 0 0 0-.49.42l-.38 2.67a7.94 7.94 0 0 0-1.94 1.12L5.67 6.2a.5.5 0 0 0-.61.22L3.06 9.88a.49.49 0 0 0 .12.64l2.13 1.66A8.1 8.1 0 0 0 5.24 13a8.1 8.1 0 0 0 .07 1.13L3.18 15.79a.49.49 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.52-1.01a7.94 7.94 0 0 0 1.94 1.12l.38 2.67c.07.24.29.42.49.42h4c.27 0 .48-.18.49-.42l.38-2.67a7.94 7.94 0 0 0 1.94-1.12l2.52 1.01a.5.5 0 0 0 .61-.22l2-3.46a.49.49 0 0 0-.12-.64z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  plus: "M12 5v14M5 12h14",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  x: "M18 6L6 18M6 6l12 12",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  globe: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-3 3.5-5 8-5 10s2 6.5 5 10m0-20c3 3.5 5 8 5 10s-2 6.5-5 10M2 12h20",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, isLoggedIn, setIsLoggedIn }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(253,250,243,0.92)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid rgba(201,168,76,0.2)`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 5%", height: 68,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("landing")}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon d={Icons.bot} size={18} color="#fff" />
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: G.text }}>
          BotForge
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <span className="nav-link" onClick={() => setPage("landing")}>Home</span>
        <span className="nav-link" onClick={() => setPage("pricing")}>Pricing</span>
        {isLoggedIn && <span className="nav-link" onClick={() => setPage("dashboard")}>Dashboard</span>}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {!isLoggedIn ? (
          <>
            <button className="outline-btn" style={{ padding: "9px 20px", borderRadius: 8, fontSize: 14 }} onClick={() => setPage("login")}>Log In</button>
            <button className="gold-btn" style={{ padding: "9px 20px", borderRadius: 8, fontSize: 14 }} onClick={() => setPage("signup")}>Get Started</button>
          </>
        ) : (
          <>
            <button className="gold-btn" style={{ padding: "9px 20px", borderRadius: 8, fontSize: 14 }} onClick={() => setPage("generator")}>+ New Bot</button>
            <button className="outline-btn" style={{ padding: "9px 14px", borderRadius: 8, fontSize: 14 }} onClick={() => { setIsLoggedIn(false); setPage("landing"); }}>
              <Icon d={Icons.logout} size={16} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ setPage }) {
  const features = [
    { icon: Icons.link, title: "Paste Your URL", desc: "Just drop your website URL and we handle the rest. No technical knowledge needed." },
    { icon: Icons.zap, title: "Instant Training", desc: "Our AI reads your entire website in seconds and learns everything about your business." },
    { icon: Icons.chat, title: "Copy Embed Code", desc: "One snippet of code. Paste it anywhere on your site and your chatbot is live." },
  ];
  const benefits = [
    { icon: Icons.shield, text: "Never answers outside your content" },
    { icon: Icons.users, text: "Handles unlimited visitor questions" },
    { icon: Icons.star, text: "Works 24/7 while you sleep" },
    { icon: Icons.globe, text: "Supports any website type" },
    { icon: Icons.zap, text: "Live in under 2 minutes" },
    { icon: Icons.dollar, text: "Flat $30/month — no surprises" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="pattern-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 5% 80px" }}>
        <div style={{ maxWidth: 780, animation: "fadeUp 0.8s ease forwards" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))`,
            border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 50,
            padding: "6px 16px", marginBottom: 28, fontSize: 13, fontWeight: 500, color: G.goldDark,
          }}>
            <Icon d={Icons.zap} size={13} color={G.gold} /> Powered by Claude AI
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
            Your Website,{" "}
            <span className="gold-text">Instant AI Chatbot</span>
          </h1>

          <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: G.muted, lineHeight: 1.7, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
            Turn any website into a smart customer service chatbot in 60 seconds. It only answers using your content — no hallucinations, no off-topic answers.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="gold-btn" style={{ padding: "16px 36px", borderRadius: 12, fontSize: 16 }} onClick={() => setPage("signup")}>
              Create Your Chatbot — Free Trial
            </button>
            <button className="outline-btn" style={{ padding: "16px 28px", borderRadius: 12, fontSize: 16 }} onClick={() => setPage("pricing")}>
              See Pricing
            </button>
          </div>

          <p style={{ color: G.muted, fontSize: 13, marginTop: 16 }}>No credit card required · Setup in 2 minutes</p>

          {/* Demo mockup */}
          <div style={{
            marginTop: 64, borderRadius: 20, overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(201,168,76,0.2)",
            background: G.white, animation: "float 4s ease-in-out infinite",
          }}>
            <div style={{ background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginLeft: 8 }}>BotForge — Bella Vista Restaurant</span>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { from: "user", text: "What are your opening hours?" },
                { from: "bot", text: "We're open Monday–Sunday, 11am–10pm. On Fridays and Saturdays we stay open until midnight!" },
                { from: "user", text: "Do you have vegetarian options?" },
                { from: "bot", text: "Absolutely! Our menu features over 12 dedicated vegetarian dishes including our popular Truffle Risotto and Garden Pappardelle." },
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    padding: "10px 16px", borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: m.from === "user" ? `linear-gradient(135deg, ${G.goldDark}, ${G.gold})` : "#F8F5EF",
                    color: m.from === "user" ? "#fff" : G.text,
                    fontSize: 14, maxWidth: "75%", textAlign: "left",
                  }}>{m.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "100px 5%", background: G.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 700, marginBottom: 16 }}>
              Three Steps to <span className="gold-text">Live Chatbot</span>
            </h2>
            <p style={{ color: G.muted, fontSize: 17, maxWidth: 500, margin: "0 auto" }}>No developers, no complexity. Just paste and go.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
            {features.map((f, i) => (
              <div key={i} className="card-shadow" style={{
                padding: 36, borderRadius: 20, background: G.cream,
                border: `1px solid rgba(201,168,76,0.15)`, position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: 24, right: 24,
                  fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700,
                  color: "rgba(201,168,76,0.1)", lineHeight: 1,
                }}>{i + 1}</div>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
                }}>
                  <Icon d={f.icon} size={22} color="#fff" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: G.muted, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="pattern-bg" style={{ padding: "100px 5%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, marginBottom: 56 }}>
            Built for <span className="gold-text">Real Businesses</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {benefits.map((b, i) => (
              <div key={i} className="glass card-shadow" style={{ padding: "22px 24px", borderRadius: 14, display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon d={b.icon} size={17} color="#fff" />
                </div>
                <span style={{ fontWeight: 500, fontSize: 15 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section style={{ padding: "100px 5%", background: G.white, textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, marginBottom: 16 }}>
            Simple, Flat Pricing
          </h2>
          <p style={{ color: G.muted, fontSize: 17, marginBottom: 40 }}>One plan. Everything included. No surprises.</p>
          <div className="card-shadow" style={{ padding: 48, borderRadius: 24, border: `2px solid ${G.gold}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${G.goldDark}, ${G.gold}, ${G.goldLight})` }} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 64, fontWeight: 700 }} className="gold-text">$30</div>
            <div style={{ color: G.muted, marginBottom: 32 }}>per month</div>
            {["1 AI Chatbot", "Unlimited visitors", "Website training", "Embed code widget", "24/7 support"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 4 ? `1px solid rgba(201,168,76,0.1)` : "none" }}>
                <Icon d={Icons.check} size={16} color={G.gold} />
                <span style={{ fontSize: 15 }}>{item}</span>
              </div>
            ))}
            <button className="gold-btn" style={{ width: "100%", padding: "16px", borderRadius: 12, fontSize: 16, marginTop: 32 }} onClick={() => setPage("signup")}>
              Start Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 5%", textAlign: "center",
        background: `linear-gradient(135deg, ${G.dark} 0%, #1a1510 100%)`,
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: G.white, marginBottom: 16 }}>
          Ready to Automate Customer Service?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, marginBottom: 36 }}>Join hundreds of businesses saving hours every week.</p>
        <button className="gold-btn" style={{ padding: "18px 48px", borderRadius: 14, fontSize: 18 }} onClick={() => setPage("signup")}>
          Create Your Chatbot Now <span style={{ marginLeft: 8 }}>→</span>
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background: G.dark, padding: "32px 5%", borderTop: `1px solid rgba(255,255,255,0.05)`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: G.white }}>BotForge</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>© 2025 BotForge. All rights reserved.</span>
      </footer>
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────
function AuthPage({ mode, setPage, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => { setIsLoggedIn(true); setPage("dashboard"); }, 1200);
  };

  return (
    <div className="pattern-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px" }}>
      <div className="card-shadow glass" style={{ padding: "52px 48px", borderRadius: 24, width: "100%", maxWidth: 460, animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon d={Icons.bot} size={26} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            {mode === "login" ? "Welcome Back" : "Get Started Free"}
          </h1>
          <p style={{ color: G.muted, fontSize: 14 }}>
            {mode === "login" ? "Sign in to your BotForge account" : "Create your account in seconds"}
          </p>
        </div>

        {mode === "signup" && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: G.muted }}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid rgba(201,168,76,0.25)`, background: "rgba(255,255,255,0.8)", fontSize: 15 }} />
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: G.muted }}>Email Address</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@business.com" style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid rgba(201,168,76,0.25)`, background: "rgba(255,255,255,0.8)", fontSize: 15 }} />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: G.muted }}>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid rgba(201,168,76,0.25)`, background: "rgba(255,255,255,0.8)", fontSize: 15 }} />
        </div>

        <button className="gold-btn" style={{ width: "100%", padding: "15px", borderRadius: 12, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }} onClick={handle} disabled={loading}>
          {loading ? <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Processing…</> : (mode === "login" ? "Sign In" : "Create Account")}
        </button>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: G.muted }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: G.gold, cursor: "pointer", fontWeight: 600 }} onClick={() => setPage(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ setPage, bots, setBots }) {
  const totalVisitors = bots.reduce((a, b) => a + b.visitors, 0);
  const totalQuestions = bots.reduce((a, b) => a + b.questions, 0);

  const stats = [
    { label: "Total Chatbots", value: bots.length, icon: Icons.bot },
    { label: "Total Visitors", value: totalVisitors.toLocaleString(), icon: Icons.users },
    { label: "Questions Answered", value: totalQuestions.toLocaleString(), icon: Icons.chat },
    { label: "Subscription", value: "Active", icon: Icons.star },
  ];

  return (
    <div style={{ minHeight: "100vh", background: G.cream, padding: "90px 5% 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 4 }}>Dashboard</h1>
            <p style={{ color: G.muted }}>Manage your AI chatbots</p>
          </div>
          <button className="gold-btn" style={{ padding: "12px 24px", borderRadius: 10, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }} onClick={() => setPage("generator")}>
            <Icon d={Icons.plus} size={16} color="#fff" /> New Chatbot
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card card-shadow glass" style={{ padding: "24px 28px", borderRadius: 16, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon d={s.icon} size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: G.muted }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bots list */}
        <div className="card-shadow glass" style={{ borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "20px 28px", borderBottom: `1px solid rgba(201,168,76,0.15)`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Your Chatbots</h2>
          </div>
          {bots.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: G.muted }}>
              <Icon d={Icons.bot} size={48} color={G.gold} />
              <p style={{ marginTop: 16, fontSize: 16 }}>No chatbots yet.</p>
              <button className="gold-btn" style={{ padding: "12px 24px", borderRadius: 10, marginTop: 16 }} onClick={() => setPage("generator")}>Create Your First</button>
            </div>
          ) : bots.map((bot, i) => (
            <BotRow key={bot.id} bot={bot} last={i === bots.length - 1} setPage={setPage} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BotRow({ bot, last, setPage }) {
  const [copied, setCopied] = useState(false);
  const embed = `<script src="https://botforge.ai/widget.js" data-bot-id="${bot.id}"></script>`;

  const copy = () => {
    navigator.clipboard?.writeText(embed).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="chatbot-row" style={{ padding: "20px 28px", borderBottom: last ? "none" : `1px solid rgba(201,168,76,0.1)`, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={Icons.bot} size={18} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{bot.name}</div>
        <div style={{ fontSize: 12, color: G.muted }}>{bot.url}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: bot.status === "active" ? "#22c55e" : G.gold, animation: bot.status === "training" ? "pulse 1.5s infinite" : "none" }} />
        <span style={{ fontSize: 13, color: G.muted, textTransform: "capitalize" }}>{bot.status}</span>
      </div>
      <div style={{ fontSize: 13, color: G.muted, minWidth: 80 }}>{bot.visitors.toLocaleString()} visitors</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="outline-btn" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }} onClick={copy}>
          <Icon d={copied ? Icons.check : Icons.copy} size={14} />
          {copied ? "Copied!" : "Embed"}
        </button>
      </div>
    </div>
  );
}

// ─── GENERATOR ────────────────────────────────────────────────────────────────
function Generator({ setPage, bots, setBots }) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1); // 1=input, 2=crawling, 3=done
  const [crawlLog, setCrawlLog] = useState([]);
  const [botId, setBotId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [websiteContent, setWebsiteContent] = useState("");

  const logs = [
    "Connecting to website...",
    "Reading homepage content...",
    "Extracting services & menu...",
    "Scanning contact information...",
    "Processing FAQs...",
    "Building knowledge base...",
    "Training AI model...",
    "Finalizing chatbot...",
  ];

  const generate = async () => {
    if (!url) return;
    const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const displayName = name || displayUrl;
    setStep(2);
    setCrawlLog([]);

    // Show crawl logs progressively
    for (let i = 0; i < logs.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setCrawlLog(prev => [...prev, logs[i]]);
    }

    // Actually extract website content with Claude
    try {
      const content = await extractWebsiteContent(url || displayUrl);
      setWebsiteContent(content);
    } catch (e) {
      setWebsiteContent("Business information extracted from website.");
    }

    const newId = Date.now();
    setBotId(newId);
    setBots(prev => [...prev, {
      id: newId, name: displayName, url: displayUrl,
      status: "active", visitors: 0, questions: 0,
      created: new Date().toISOString().split("T")[0],
      content: websiteContent,
    }]);
    setStep(3);
  };

  const embedCode = `<script src="https://botforge.ai/widget.js" data-bot-id="${botId}" data-name="${name || url}"></script>`;

  const copy = () => {
    navigator.clipboard?.writeText(embedCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="pattern-bg" style={{ minHeight: "100vh", padding: "100px 5% 60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 700, width: "100%" }}>

        {step === 1 && (
          <div className="card-shadow glass" style={{ padding: "52px 48px", borderRadius: 24, animation: "fadeUp 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 8px 24px ${G.goldGlow}` }}>
                <Icon d={Icons.bot} size={28} color="#fff" />
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 10 }}>Create Your Chatbot</h1>
              <p style={{ color: G.muted }}>Paste your website URL and we'll do the rest</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: G.muted }}>Website URL *</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
                  <Icon d={Icons.globe} size={18} color={G.muted} />
                </div>
                <input
                  value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="https://yourrestaurant.com"
                  style={{ width: "100%", padding: "14px 16px 14px 44px", borderRadius: 12, border: `1.5px solid rgba(201,168,76,0.25)`, background: "rgba(255,255,255,0.9)", fontSize: 16 }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 36 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: G.muted }}>Business Name (optional)</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g., Bella Vista Restaurant"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid rgba(201,168,76,0.25)`, background: "rgba(255,255,255,0.9)", fontSize: 16 }}
              />
            </div>

            <button className="gold-btn" style={{ width: "100%", padding: "16px", borderRadius: 12, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }} onClick={generate} disabled={!url}>
              <Icon d={Icons.zap} size={18} color="#fff" /> Generate My Chatbot
            </button>

            <p style={{ textAlign: "center", marginTop: 16, color: G.muted, fontSize: 13 }}>
              Takes about 15 seconds · No technical knowledge needed
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="card-shadow glass" style={{ padding: "52px 48px", borderRadius: 24, textAlign: "center", animation: "fadeUp 0.5s ease" }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", animation: "spin 2s linear infinite", boxShadow: `0 0 30px ${G.goldGlow}` }}>
              <Icon d={Icons.zap} size={30} color="#fff" />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Training Your Chatbot</h2>
            <p style={{ color: G.muted, marginBottom: 36 }}>Reading and learning from your website…</p>
            <div style={{ textAlign: "left", background: "#0D0C0A", borderRadius: 14, padding: 24, fontFamily: "monospace", fontSize: 13, maxHeight: 260, overflow: "hidden" }}>
              {crawlLog.map((log, i) => (
                <div key={i} style={{ color: i === crawlLog.length - 1 ? G.goldLight : "#4ade80", marginBottom: 8, animation: "fadeIn 0.3s ease" }}>
                  <span style={{ color: G.gold }}>▶ </span>{log}
                </div>
              ))}
              {crawlLog.length < logs.length && <span style={{ color: G.gold, animation: "pulse 1s infinite" }}>█</span>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: "fadeUp 0.6s ease" }}>
            <div className="card-shadow glass" style={{ padding: "48px", borderRadius: 24, marginBottom: 24 }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #16a34a, #22c55e)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Icon d={Icons.check} size={30} color="#fff" strokeWidth={2.5} />
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Chatbot Ready! 🎉</h2>
                <p style={{ color: G.muted }}>Your AI chatbot is trained and ready to embed.</p>
              </div>

              <div style={{ background: G.dark, borderRadius: 14, padding: 24, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em" }}>EMBED CODE</span>
                  <button onClick={copy} style={{ background: copied ? "#16a34a" : "rgba(201,168,76,0.2)", border: `1px solid ${copied ? "#16a34a" : G.gold}`, color: copied ? "#fff" : G.gold, padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon d={copied ? Icons.check : Icons.copy} size={13} /> {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <code style={{ color: G.goldLight, fontSize: 13, fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.6 }}>
                  {embedCode}
                </code>
              </div>

              <div style={{ background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 12, padding: 20, fontSize: 14, color: G.muted, lineHeight: 1.7 }}>
                <strong style={{ color: G.text }}>How to use:</strong> Copy the code above and paste it just before the{" "}
                <code style={{ background: "rgba(0,0,0,0.1)", padding: "2px 6px", borderRadius: 4 }}>&lt;/body&gt;</code>{" "}
                tag on any page of your website. The chat widget will appear automatically.
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button className="gold-btn" style={{ flex: 1, padding: "14px", borderRadius: 12, fontSize: 15 }} onClick={() => setPage("dashboard")}>
                Go to Dashboard
              </button>
              <button className="outline-btn" style={{ flex: 1, padding: "14px", borderRadius: 12, fontSize: 15 }} onClick={() => { setStep(1); setUrl(""); setName(""); }}>
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────
function Pricing({ setPage }) {
  return (
    <div style={{ minHeight: "100vh", padding: "100px 5% 80px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, marginBottom: 16 }}>
            Simple <span className="gold-text">Pricing</span>
          </h1>
          <p style={{ color: G.muted, fontSize: 18 }}>Everything you need. One flat price.</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {/* Standard Plan */}
          <div className="card-shadow" style={{ padding: "52px 48px", borderRadius: 24, border: `2px solid ${G.gold}`, background: G.white, maxWidth: 440, width: "100%", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${G.goldDark}, ${G.gold}, ${G.goldLight})` }} />
            <div style={{ position: "absolute", top: 24, right: 24, background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 50, letterSpacing: "0.05em" }}>MOST POPULAR</div>

            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Standard Plan</h2>
            <p style={{ color: G.muted, marginBottom: 28 }}>Perfect for small and medium businesses</p>

            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 36 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 64, fontWeight: 700 }} className="gold-text">$30</span>
              <span style={{ color: G.muted, fontSize: 16 }}>/month</span>
            </div>

            {[
              "1 AI Chatbot",
              "Unlimited website visitors",
              "Full website training & crawling",
              "Embeddable chat widget",
              "Floating bubble + animations",
              "Mobile responsive design",
              "Custom business name",
              "Answers only from your content",
              "Email support",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 8 ? `1px solid rgba(201,168,76,0.1)` : "none" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon d={Icons.check} size={11} color="#fff" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 15 }}>{item}</span>
              </div>
            ))}

            <button className="gold-btn" style={{ width: "100%", padding: "16px", borderRadius: 12, fontSize: 17, marginTop: 36 }} onClick={() => setPage("signup")}>
              Get Started Now
            </button>

            <p style={{ textAlign: "center", color: G.muted, fontSize: 13, marginTop: 14 }}>Cancel anytime · No lock-in</p>
          </div>
        </div>

        <div style={{ marginTop: 64, textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 16 }}>Frequently Asked Questions</h3>
          {[
            ["Will the chatbot answer things not on my website?", "Never. BotForge is strictly limited to your website's content. If a question can't be answered from your site, it politely says so."],
            ["How long does training take?", "Usually under 30 seconds. We crawl your site and train the AI instantly."],
            ["Do I need a developer to install it?", "Not at all. Just copy one line of code and paste it into your website. Done."],
            ["What kinds of websites work?", "Restaurants, hotels, tour companies, clinics, law firms, salons — any business with a website."],
          ].map(([q, a], i) => (
            <div key={i} className="card-shadow glass" style={{ padding: "22px 28px", borderRadius: 14, marginBottom: 12, textAlign: "left" }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{q}</div>
              <div style={{ color: G.muted, fontSize: 14, lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LIVE CHAT WIDGET DEMO ────────────────────────────────────────────────────
function ChatWidget({ bot, onClose }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: `Hi there! 👋 I'm the AI assistant for ${bot?.name || "this business"}. I can answer questions using the information from their website. How can I help you?` }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = async () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    setMessages(prev => [...prev, { from: "user", text: q }]);
    setTyping(true);

    try {
      const systemPrompt = `You are a customer service chatbot for "${bot?.name || "this business"}". 

Here is the ONLY content you are allowed to use to answer questions:
---
${bot?.content || "This is a demo business. We offer great services, are open Monday-Friday 9am-6pm, and can be reached at hello@business.com."}
---

STRICT RULES:
1. ONLY answer using the information above. Do not use any outside knowledge.
2. If the question cannot be answered from the above content, respond EXACTLY: "I couldn't find that information on this business's website. Please contact us directly for more details."
3. If the question is completely unrelated to this business, respond EXACTLY: "I can only answer questions about this business."
4. Be polite, concise, and professional.
5. Never make up information. Never hallucinate.`;

      const answer = await askClaude(systemPrompt, q);
      setMessages(prev => [...prev, { from: "bot", text: answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { from: "bot", text: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setTyping(false);
    }
  };

  if (!isOpen) return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
      <div onClick={() => setIsOpen(true)} style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 8px 32px ${G.goldGlow}`, animation: "chatPop 0.3s ease" }}>
        <Icon d={Icons.chat} size={26} color="#fff" />
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, width: 370, borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "chatPop 0.3s ease", display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={Icons.bot} size={18} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{bot?.name || "AI Assistant"}</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Powered by BotForge</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setIsOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={Icons.x} size={14} color="#fff" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 18, background: "#FAF8F3", display: "flex", flexDirection: "column", gap: 12, minHeight: 280, maxHeight: 380 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
            {m.from === "bot" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>
                <Icon d={Icons.bot} size={13} color="#fff" />
              </div>
            )}
            <div style={{
              padding: "10px 14px", borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.from === "user" ? `linear-gradient(135deg, ${G.goldDark}, ${G.gold})` : G.white,
              color: m.from === "user" ? "#fff" : G.text,
              fontSize: 14, maxWidth: "78%", lineHeight: 1.5,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              animation: "chatPop 0.25s ease",
            }}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon d={Icons.bot} size={13} color="#fff" />
            </div>
            <div style={{ background: G.white, padding: "12px 18px", borderRadius: "18px 18px 18px 4px", display: "flex", gap: 5, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "14px 16px", background: G.white, borderTop: `1px solid rgba(201,168,76,0.15)`, display: "flex", gap: 10 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask a question..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid rgba(201,168,76,0.25)`, background: G.cream, fontSize: 14 }}
        />
        <button onClick={send} disabled={!input.trim() || typing} style={{
          width: 42, height: 42, borderRadius: 10, border: "none",
          background: input.trim() ? `linear-gradient(135deg, ${G.goldDark}, ${G.gold})` : "rgba(201,168,76,0.2)",
          cursor: input.trim() ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}>
          <Icon d={Icons.send} size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bots, setBots] = useState(MOCK_BOTS);
  const [showWidget, setShowWidget] = useState(false);
  const [demoBot, setDemoBot] = useState(null);

  // Show demo widget after 3s on landing page
  useEffect(() => {
    if (page === "landing") {
      const timer = setTimeout(() => {
        setDemoBot({ name: "Demo Restaurant", id: "demo", content: "We are a fine dining Italian restaurant open Mon-Sun 11am-10pm. Located at 123 Main St. Reservation line: 555-0123. Specialties: homemade pasta, wood-fired pizza, tiramisu. Prix fixe dinner $65/person. Free parking. No dress code but smart casual preferred. We accommodate dietary restrictions including vegan and gluten-free." });
        setShowWidget(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [page]);

  return (
    <>
      <style>{globalStyles}</style>

      <Nav page={page} setPage={setPage} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main style={{ paddingTop: 0 }}>
        {page === "landing" && <Landing setPage={setPage} />}
        {page === "login" && <AuthPage mode="login" setPage={setPage} setIsLoggedIn={setIsLoggedIn} />}
        {page === "signup" && <AuthPage mode="signup" setPage={setPage} setIsLoggedIn={setIsLoggedIn} />}
        {page === "dashboard" && <Dashboard setPage={setPage} bots={bots} setBots={setBots} />}
        {page === "generator" && <Generator setPage={setPage} bots={bots} setBots={setBots} />}
        {page === "pricing" && <Pricing setPage={setPage} />}
      </main>

      {/* Floating demo chat widget */}
      {showWidget && page === "landing" && (
        <ChatWidget bot={demoBot} onClose={() => setShowWidget(false)} />
      )}

      {/* Show chatbot for created bots on dashboard */}
      {page === "dashboard" && bots.some(b => b.status === "active") && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999 }}>
          <button
            className="gold-btn"
            style={{ padding: "12px 20px", borderRadius: 50, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}
            onClick={() => { setDemoBot(bots.find(b => b.status === "active")); setShowWidget(!showWidget); }}
          >
            <Icon d={Icons.chat} size={16} color="#fff" /> Test Chatbot
          </button>
          {showWidget && demoBot && <ChatWidget bot={demoBot} onClose={() => setShowWidget(false)} />}
        </div>
      )}
    </>
  );
}
import React from 'react';
import ReactDOM from 'react-dom/client';

// This connects your "Landing" component to the "root" div in your HTML
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Landing /> 
  </React.StrictMode>
);
