/* Major page sections — Four Spa aesthetic, fully responsive */
/* global React, Button, Eyebrow, NailPhoto, Icon, useLucide, useNailCursor, useWindowWidth, NAIL_PHOTOS */

const { useState, useEffect } = React;

/* ===================================================================
   TOP NAV
   Desktop: BOOK NOW | SERVICES  ——  Nails by Jano  ——  instagram | INFO
   Mobile:  ☰  ——  Nails by Jano  ——  instagram
   =================================================================== */
const TopNav = ({ active, onNavigate, onBook }) => {
  useLucide();
  const w = useWindowWidth();
  const isMobile = w <= 768;
  const [menuOpen, setMenuOpen] = useState(false);

  const wordmark = (
    <button
      onClick={() => { onNavigate("home"); setMenuOpen(false); }}
      style={{
        background: "none", border: 0, cursor: "pointer", padding: 0,
        position: "absolute", left: "50%", transform: "translateX(-50%)",
      }}
    >
      <span style={{
        fontFamily: "var(--font-display)",
        fontSize: isMobile ? 15 : 18,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--brand)",
        whiteSpace: "nowrap",
      }}>
        Nails by Jano
      </span>
    </button>
  );

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--bg)", borderBottom: "1px solid var(--hairline)" }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: isMobile ? "0 20px" : "0 32px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
      }}>
        {/* Left */}
        {isMobile ? (
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", display: "flex", padding: 0 }}
            aria-label="Menu"
          >
            <Icon name={menuOpen ? "x" : "menu"} size={20} stroke={1.5} />
          </button>
        ) : (
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <button onClick={onBook} style={navBtn(active === "book")}>BOOK NOW</button>
            <button onClick={() => onNavigate("services")} style={navBtn(active === "services")}>SERVICES</button>
          </nav>
        )}

        {wordmark}

        {/* Right */}
        <div style={{ display: "flex", gap: isMobile ? 16 : 20, alignItems: "center" }}>
          <a href="https://www.instagram.com/nailsbyjano.est2024/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", lineHeight: 1 }}>
            <InstagramIcon size={18} color="#E8174A" />
          </a>
          {!isMobile && (
            <button onClick={() => onNavigate("about")} style={navBtn(active === "about")}>INFO</button>
          )}
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {isMobile && menuOpen && (
        <div style={{
          background: "var(--bg)",
          borderBottom: "1px solid var(--hairline)",
          padding: "8px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}>
          {[
            { label: "Book now", action: () => { onBook(); setMenuOpen(false); } },
            { label: "Services", action: () => { onNavigate("services"); setMenuOpen(false); } },
            { label: "Gallery", action: () => { onNavigate("gallery"); setMenuOpen(false); } },
            { label: "About", action: () => { onNavigate("about"); setMenuOpen(false); } },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                background: "none", border: "none",
                borderBottom: "1px solid var(--hairline)",
                fontFamily: "var(--font-sans)",
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--brand)",
                cursor: "pointer",
                padding: "14px 0",
                textAlign: "left",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

const navBtn = (active) => ({
  background: "none", border: "none",
  fontFamily: "var(--font-sans)",
  fontSize: 10, fontWeight: 700,
  letterSpacing: "0.18em", textTransform: "uppercase",
  color: "var(--brand)", cursor: "pointer",
  padding: "4px 0",
  borderBottom: active ? "1px solid var(--brand)" : "1px solid transparent",
  transition: "border-color 140ms",
});

/* ===================================================================
   SERVICE DATA — from official Nailsbyjano price list
   Location: 831-A Fullon St. Dagupan Tondo, Manila | +63 9929262792
   Payment: GCash / Cash only
   =================================================================== */
const SERVICE_CATEGORIES = [
  {
    id: "softgel",
    name: "JLF Softgel Xtension",
    items: [
      { id: "softgel-plain",   name: "Plain",                  price: "₱399", duration: "90 min",  desc: "" },
      { id: "softgel-minimal", name: "Minimal Design",         price: "₱499", duration: "100 min", desc: "" },
      { id: "softgel-full",    name: "Full Design",            price: "₱549", duration: "120 min", desc: "" },
      { id: "softgel-inspo",   name: "Depend on Nails Inspo",  price: "₱649", duration: "150 min", desc: "Price may vary based on design" },
    ],
  },
  {
    id: "manicure",
    name: "Manicure + Gel Polish",
    items: [
      { id: "mani-plain",   name: "Plain",                 price: "₱249", duration: "60 min",  desc: "Normal gel polish" },
      { id: "mani-minimal", name: "Minimal Design",        price: "₱299", duration: "75 min",  desc: "" },
      { id: "mani-full",    name: "Full Design",           price: "₱349", duration: "90 min",  desc: "" },
      { id: "mani-inspo",   name: "Depend on Nails Inspo", price: "₱399", duration: "100 min", desc: "Price may vary based on design" },
    ],
  },
  {
    id: "removal",
    name: "Removal",
    items: [
      { id: "removal-gel-mine",  name: "Gel Polish (My Work)",          price: "₱99",  duration: "30 min", desc: "" },
      { id: "removal-gel-other", name: "Gel Polish (Not My Work)",      price: "₱149", duration: "45 min", desc: "" },
      { id: "removal-xt-mine",   name: "Nail Xtension (My Work)",       price: "₱149", duration: "45 min", desc: "" },
      { id: "removal-xt-other",  name: "Nail Xtension (Not My Work)",   price: "₱199", duration: "60 min", desc: "" },
    ],
  },
];

/* Flat list used for hero text and booking step 0 */
const SERVICES = SERVICE_CATEGORIES.flatMap(cat =>
  cat.items.map(item => ({ ...item, category: cat.name }))
);

/* ===================================================================
   HERO — large running service text + GSAP cursor nail image
   =================================================================== */
const Hero = ({ onBook }) => {
  const { show, hide, move } = useNailCursor();
  const w = useWindowWidth();
  const isMobile = w <= 768;

  useEffect(() => {
    const onScroll = () => hide();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel',  onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel',  onScroll);
    };
  }, []);

  return (
    <section style={{ background: "var(--bg)", padding: isMobile ? "36px 20px 48px" : "48px 32px 64px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>

        <div
          onMouseMove={isMobile ? undefined : move}
          onMouseLeave={isMobile ? undefined : hide}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? "clamp(28px, 9vw, 52px)" : "clamp(40px, 6vw, 80px)",
            fontWeight: 400,
            lineHeight: 1.12,
            color: "var(--brand)",
            letterSpacing: "0.03em",
            textAlign: "center",
            margin: "0 0 36px",
          }}
        >
          {SERVICE_CATEGORIES.map((cat, i) => (
            <div key={cat.id}>
              <span
                className="service-text-item hero-cat"
                onMouseEnter={isMobile ? undefined : () => show(NAIL_PHOTOS[i] || NAIL_PHOTOS[0])}
                onMouseLeave={isMobile ? undefined : hide}
                style={{ cursor: "default", transition: "color 180ms", display: "inline-block", opacity: 0 }}
              >
                {cat.name.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        <Button variant="link" onClick={onBook} style={{ fontSize: 11 }}>
          Make an appointment
        </Button>
      </div>
    </section>
  );
};

/* ===================================================================
   "BEAUTY TAKES TIME" — photo mosaic + copy
   =================================================================== */
const BeautyBand = ({ onBook }) => {
  const w = useWindowWidth();
  const isMobile = w <= 768;

  return (
    <section style={{ background: "var(--bg)", padding: isMobile ? "48px 20px" : "80px 32px" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 40 : 64,
        alignItems: "center",
      }}>

        {/* Photo mosaic with corner letters */}
        <div style={{ position: "relative" }}>
          {["J","A","N","O"].map((letter, i) => {
            const positions = [
              { top: 0, left: 0 },
              { top: 0, right: 0 },
              { bottom: 0, left: 0 },
              { bottom: 0, right: 0 },
            ];
            return (
              <span key={letter} style={{
                position: "absolute",
                fontFamily: "var(--font-display)",
                fontSize: isMobile ? "clamp(40px, 12vw, 72px)" : "clamp(52px, 8vw, 96px)",
                fontWeight: 400,
                color: "var(--brand)",
                lineHeight: 1,
                zIndex: 2,
                ...positions[i],
              }}>
                {letter}
              </span>
            );
          })}

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            padding: isMobile ? "36px 28px" : "48px 32px",
          }}>
            <NailPhoto index={0} aspect="3/4" />
            <NailPhoto index={1} aspect="3/4" />
            <NailPhoto index={2} aspect="3/4" />
            <NailPhoto index={3} aspect="3/4" />
          </div>

        </div>

        {/* Copy */}
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? "clamp(26px, 7vw, 40px)" : "clamp(28px, 4vw, 48px)",
            fontWeight: 400,
            color: "var(--brand)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            lineHeight: 1.1,
            margin: "0 0 20px",
          }}>
            Beauty takes time.
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.7, color: "var(--fg-muted)", margin: "0 0 14px" }}>
            Nails by Jano elevates the nail experience, giving every client
            personalised attention and a luxury finish tailored to their look.
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.7, color: "var(--fg-muted)", margin: "0 0 28px" }}>
            Based in Tondo, Manila. Softgel extensions and gel polish done right —
            one client at a time. Never rushed. Always clean.
          </p>
          <Button variant="primary" onClick={onBook} size="md">Book your slot</Button>
        </div>
      </div>
    </section>
  );
};

/* ===================================================================
   PHOTO SPREAD — editorial image pair
   =================================================================== */
const PhotoSpread = () => {
  const w = useWindowWidth();
  const isMobile = w <= 768;

  return (
    <section style={{ background: "var(--bg)", padding: isMobile ? "0 20px 48px" : "0 32px 80px" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "5fr 7fr",
        gap: isMobile ? 12 : 16,
        alignItems: "end",
      }}>
        <NailPhoto index={4} aspect="3/4" />
        <NailPhoto index={5} aspect="3/4" />
      </div>
    </section>
  );
};

/* ===================================================================
   SERVICES PAGE — accordion with ADD buttons
   =================================================================== */
const ServicesPage = ({ onBook }) => {
  const w = useWindowWidth();
  const isMobile = w <= 768;
  const [open, setOpen] = useState(SERVICE_CATEGORIES[0].name);
  return (
    <section style={{ background: "var(--bg)", padding: isMobile ? "40px 20px 80px" : "64px 32px 96px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <Eyebrow style={{ marginBottom: 12 }}>Services</Eyebrow>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: isMobile ? "clamp(40px, 12vw, 64px)" : "clamp(40px, 6vw, 80px)",
          fontWeight: 400, color: "var(--brand)",
          letterSpacing: "0.03em", textTransform: "uppercase",
          margin: "0 0 40px", lineHeight: 0.95,
        }}>
          The menu
        </h1>

        {SERVICE_CATEGORIES.map(cat => (
          <div key={cat.name} style={{ borderTop: "1px solid var(--hairline)" }}>
            <button
              onClick={() => setOpen(open === cat.name ? null : cat.name)}
              style={{
                width: "100%", background: "none", border: "none",
                padding: isMobile ? "16px 0" : "20px 0",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: isMobile ? "clamp(22px, 7vw, 36px)" : "clamp(24px, 3.5vw, 40px)",
                fontWeight: 400, color: "var(--brand)",
                letterSpacing: "0.06em", textTransform: "uppercase",
                textAlign: "left",
              }}>
                {cat.name}
              </span>
              <span style={{ color: "var(--brand)", fontSize: 20, lineHeight: 1, flexShrink: 0, marginLeft: 12 }}>
                {open === cat.name ? "−" : "+"}
              </span>
            </button>

            {open === cat.name && (
              <div style={{ paddingBottom: 8 }}>
                {cat.items.map((s, i) => (
                  <div
                    key={s.id}
                    style={{
                      borderTop: "1px solid var(--hairline)",
                      padding: isMobile ? "14px 0" : "16px 0",
                    }}
                  >
                    {isMobile ? (
                      /* Mobile: two-line layout */
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                          <span style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(18px, 5vw, 26px)",
                            fontWeight: 400, color: "var(--brand)",
                            letterSpacing: "0.04em", textTransform: "uppercase",
                          }}>
                            {s.name}
                          </span>
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: "var(--brand)", flexShrink: 0, marginLeft: 12 }}>
                            {s.price}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--fg-muted)" }}>
                            {s.duration}
                          </span>
                          <button
                            onClick={() => onBook(s)}
                            style={addBtnStyle}
                            onMouseEnter={e => { e.target.style.background = "var(--brand)"; e.target.style.color = "#fff"; }}
                            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "var(--brand)"; }}
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Desktop: single-row layout */
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(18px, 2.8vw, 32px)",
                            fontWeight: 400, color: "var(--brand)",
                            letterSpacing: "0.04em", textTransform: "uppercase",
                            flex: 1, cursor: "default",
                          }}
                        >
                          {s.name}
                        </span>
                        {s.desc && (
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-muted)", maxWidth: 200, flexShrink: 0 }}>
                            {s.desc}
                          </span>
                        )}
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--fg-muted)", width: 56, textAlign: "right", flexShrink: 0 }}>
                          {s.duration}
                        </span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, color: "var(--brand)", width: 52, textAlign: "right", flexShrink: 0 }}>
                          {s.price}
                        </span>
                        <button
                          onClick={() => onBook(s)}
                          style={addBtnStyle}
                          onMouseEnter={e => { e.target.style.background = "var(--brand)"; e.target.style.color = "#fff"; }}
                          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "var(--brand)"; }}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--hairline)" }} />
      </div>
    </section>
  );
};

const addBtnStyle = {
  border: "1px solid var(--brand)",
  background: "transparent",
  color: "var(--brand)",
  fontFamily: "var(--font-sans)",
  fontSize: 10, fontWeight: 700,
  letterSpacing: "0.14em", textTransform: "uppercase",
  padding: "7px 14px",
  cursor: "pointer", flexShrink: 0,
  transition: "all 180ms",
};

/* ===================================================================
   GALLERY
   =================================================================== */
const Gallery = () => {
  const w = useWindowWidth();
  const isMobile = w <= 768;

  return (
    <section style={{ background: "var(--bg)", padding: isMobile ? "48px 20px 64px" : "64px 32px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Eyebrow style={{ marginBottom: 12 }}>Recent sets</Eyebrow>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? "clamp(28px, 8vw, 44px)" : "clamp(28px, 4vw, 52px)",
            fontWeight: 400, color: "var(--brand)",
            letterSpacing: "0.04em", textTransform: "uppercase", margin: 0,
          }}>
            From the studio.
          </h2>
          <a href="https://www.instagram.com/nailsbyjano.est2024/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">See all on Instagram</Button>
          </a>
        </div>

        {isMobile ? (
          /* Mobile: 2-column uniform grid */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[0,1,2,3,4,5].map(i => (
              <NailPhoto key={i} index={i} aspect="3/4" />
            ))}
          </div>
        ) : (
          /* Desktop: 3-column uniform grid */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[0,1,2,3,4,5,6,7,8].map(i => (
              <NailPhoto key={i} index={i} aspect="3/4" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ===================================================================
   ABOUT PAGE
   =================================================================== */
const AboutPage = () => {
  const w = useWindowWidth();
  const isMobile = w <= 768;

  return (
    <section style={{ background: "var(--bg)", padding: isMobile ? "48px 20px 64px" : "80px 32px 100px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 40 : 64, maxWidth: 700, margin: "0 auto", paddingBottom: isMobile ? 40 : 64 }}>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? "clamp(22px, 6vw, 36px)" : "clamp(28px, 4.5vw, 56px)",
            fontWeight: 400, color: "var(--brand)",
            letterSpacing: "0.04em", textTransform: "uppercase",
            lineHeight: 1.1, margin: 0,
          }}>
            Beauty takes time. Nails by Jano elevates the experience, giving every client
            a luxury service, tailored to their needs.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 32 : 48,
          alignItems: "start",
        }}>
          <NailPhoto index={0} aspect={isMobile ? "16/9" : "4/5"} />
          <div style={{ paddingTop: isMobile ? 0 : 40 }}>
            <Eyebrow style={{ marginBottom: 16 }}>About</Eyebrow>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.75, color: "var(--fg-muted)", margin: "0 0 20px" }}>
              I specialise in softgel extensions and gel polish — precision work
              done properly, every time. I take a small number of clients so each
              set gets my full attention. Never rushed, always clean.
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.75, color: "var(--fg-muted)", margin: "0 0 32px" }}>
              By appointment only. One client at a time. Bring a playlist —
              I'll handle the rest.
            </p>
            <Eyebrow style={{ marginBottom: 14 }}>Studio</Eyebrow>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.8, color: "var(--fg-muted)", margin: 0 }}>
              831-A Fullon St. Dagupan Tondo, Manila<br />
              +63 9929262792<br />
              By appointment only<br />
              Payment: GCash / Cash only
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ===================================================================
   FOOTER
   =================================================================== */
const Footer = ({ onBook, onNavigate }) => {
  const w = useWindowWidth();
  const isMobile = w <= 768;

  return (
    <footer style={{ borderTop: "1px solid var(--hairline)", background: "var(--bg)", padding: isMobile ? "40px 20px 28px" : "48px 32px 32px" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
        gap: isMobile ? 28 : 40,
        marginBottom: isMobile ? 28 : 40,
      }}>
        {/* Brand block — full width on mobile */}
        <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? 22 : 28,
            fontWeight: 400, color: "var(--brand)",
            letterSpacing: "0.06em", textTransform: "uppercase",
            display: "block", marginBottom: 12,
          }}>
            Nails by Jano
          </span>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, lineHeight: 1.7, color: "var(--fg-muted)", margin: "0 0 20px", maxWidth: 300 }}>
            Softgel extensions &amp; gel polish in Tondo, Manila.
            By appointment only.
          </p>
          <Button variant="primary" size="sm" onClick={onBook}>Book your slot</Button>
        </div>

        {[
          { label: "Studio", items: ["831-A Fullon St. Dagupan Tondo, Manila", "By appointment only", "GCash / Cash only"] },
          { label: "Hours",  items: ["Mon – Sat · by appt", "Sun · closed", "DM to schedule"] },
        ].map(col => (
          <div key={col.label}>
            <Eyebrow style={{ marginBottom: 12 }}>{col.label}</Eyebrow>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
              {col.items.map(item => (
                <li key={item} style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-muted)" }}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact column with Instagram icon */}
        <div>
          <Eyebrow style={{ marginBottom: 12 }}>Contact</Eyebrow>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
            <li>
              <a
                href="https://www.instagram.com/nailsbyjano.est2024/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--brand)",
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                }}
              >
                <InstagramIcon size={14} color="#E8174A" />
                @nailsbyjano.est2024
              </a>
            </li>
            <li style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--fg-muted)" }}>
              +63 9929262792
            </li>
            <li>
              <a
                href="mailto:nailsbyjano@gmail.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--fg-muted)",
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                }}
              >
                nailsbyjano@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div style={{
        borderTop: "1px solid var(--hairline)", paddingTop: 18,
        display: "flex", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8, alignItems: "center",
      }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "var(--fg-subtle)", letterSpacing: "0.08em" }}>
          © 2026 NAILSBYJANO
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "var(--fg-subtle)", letterSpacing: "0.08em" }}>
          PRIVACY · TERMS · CANCELLATION POLICY
        </span>
        <button
          onClick={() => onNavigate && onNavigate('owner')}
          style={{ background:"none", border:"none", cursor:"pointer", padding:"2px 4px", color:"var(--fg-subtle)", fontSize:10, opacity:0.25, fontFamily:"var(--font-sans)" }}
          title="Owner"
        >·</button>
      </div>
    </footer>
  );
};

Object.assign(window, { TopNav, Hero, ServicesPage, BeautyBand, PhotoSpread, Gallery, AboutPage, Footer, SERVICES, SERVICE_CATEGORIES });
