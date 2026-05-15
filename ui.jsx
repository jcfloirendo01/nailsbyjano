/* Shared UI primitives — Four Spa aesthetic for Nails by Jano */
/* global React */

const { useState, useEffect, useRef } = React;

/* ---------- Responsive hook ---------- */
const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return width;
};

/* ---------- Real nail photos from assets/nails/ ---------- */
const NAIL_ASSETS = [
  "assets/nails/585860383_17847443169621830_7520807805283528908_n.jpg",
  "assets/nails/587367699_17847619386621830_8637849702523549727_n.jpg",
  "assets/nails/605877421_17847441777621830_6154313628226203725_n.jpg",
  "assets/nails/606401560_17847382749621830_5954084448391437500_n.jpg",
  "assets/nails/607295384_17847619398621830_4211164013176851949_n.jpg",
  "assets/nails/607309118_17847556758621830_3519773731973920201_n.jpg",
  "assets/nails/608283789_17847556749621830_4046861165861096545_n.jpg",
  "assets/nails/611259666_17848978944621830_678929935806136492_n.jpg",
  "assets/nails/612119916_17848978935621830_6447642879417353718_n.jpg",
  "assets/nails/624837894_17852495553621830_4167310787908394965_n.jpg",
  "assets/nails/625478578_17852495538621830_5508173523311486486_n.jpg",
  "assets/nails/627666510_17852495529621830_8127767243469670435_n.jpg",
  "assets/nails/627731901_17852492958621830_7469502476484667829_n.jpg",
];

const NAIL_PHOTOS = NAIL_ASSETS;

/* ---------- GSAP cursor-follower hook ---------- */
const useNailCursor = () => {
  const show = (photoSrc) => {
    const el = document.getElementById("nail-cursor");
    const img = document.getElementById("nail-cursor-img");
    if (!el || !img || !window.gsap) return;
    img.style.display = "block";
    img.onload = () => {
      window.gsap.to(el, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
    };
    img.onerror = () => {
      img.style.display = "none";
      window.gsap.to(el, { opacity: 0, duration: 0.2 });
    };
    img.src = photoSrc;
  };
  const hide = () => {
    const el = document.getElementById("nail-cursor");
    if (!el || !window.gsap) return;
    window.gsap.to(el, { opacity: 0, scale: 0.92, duration: 0.3, ease: "power2.in" });
  };
  const move = (e) => {
    const el = document.getElementById("nail-cursor");
    if (!el || !window.gsap) return;
    window.gsap.to(el, {
      x: e.clientX + 24,
      y: e.clientY - 120,
      duration: 0.55,
      ease: "power3.out",
    });
  };
  return { show, hide, move };
};

/* ---------- FourSpa-style Button ---------- */
const Button = ({ variant = "primary", size = "md", children, onClick, type = "button", disabled, style }) => {
  const [hover, setHover] = useState(false);
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    fontFamily: "var(--font-sans)",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    transition: "all 200ms var(--ease-out)",
    border: "1px solid var(--brand)",
    borderRadius: 0,
    background: "transparent",
    color: "var(--brand)",
    whiteSpace: "nowrap",
  };
  const sizes = {
    sm: { fontSize: 10, padding: "7px 14px" },
    md: { fontSize: 11, padding: "10px 20px" },
    lg: { fontSize: 12, padding: "14px 28px" },
  };
  const variants = {
    primary: {
      background: hover ? "var(--brand)" : "transparent",
      color: hover ? "#fff" : "var(--brand)",
    },
    filled: {
      background: hover ? "var(--brand-deep)" : "var(--brand)",
      color: "#fff",
      border: "1px solid transparent",
    },
    ghost: {
      background: "transparent",
      border: "none",
      color: hover ? "var(--brand-deep)" : "var(--brand)",
      textDecoration: hover ? "underline" : "none",
      textUnderlineOffset: 4,
      padding: 0,
    },
    link: {
      background: "transparent",
      border: "none",
      color: "var(--brand)",
      textDecoration: "underline",
      textUnderlineOffset: 4,
      padding: 0,
      letterSpacing: "0.06em",
    },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
};

/* ---------- Eyebrow ---------- */
const Eyebrow = ({ children, style }) => (
  <span
    className="anim-left"
    style={{
      fontFamily: "var(--font-sans)",
      fontSize: "var(--t-eyebrow)",
      fontWeight: 700,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--brand)",
      display: "block",
      ...style,
    }}
  >
    {children}
  </span>
);

/* ---------- Pill / Tag ---------- */
const Pill = ({ children, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      border: "1px solid var(--brand)",
      borderRadius: 0,
      padding: "4px 10px",
      fontFamily: "var(--font-sans)",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--brand)",
      ...style,
    }}
  >
    {children}
  </span>
);

/* ---------- Field + Input (Four Spa style — thin pink border, no radius) ---------- */
const Field = ({ label, hint, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--brand)",
      }}
    >
      {label}
    </span>
    {children}
    {hint && (
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--fg-muted)", fontStyle: "italic" }}>
        {hint}
      </span>
    )}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    style={{
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 500,
      padding: "10px 12px",
      border: "1px solid var(--brand)",
      borderRadius: 0,
      background: "#fff",
      color: "var(--brand)",
      outline: "none",
      width: "100%",
      transition: "box-shadow 140ms",
      ...props.style,
    }}
    onFocus={(e) => {
      e.target.style.boxShadow = "0 0 0 2px rgba(232,23,74,0.2)";
      props.onFocus && props.onFocus(e);
    }}
    onBlur={(e) => {
      e.target.style.boxShadow = "none";
      props.onBlur && props.onBlur(e);
    }}
  />
);

const Select = ({ children, value, onChange, style }) => (
  <div style={{ position: "relative" }}>
    <select
      value={value}
      onChange={onChange}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "10px 36px 10px 12px",
        border: "1px solid var(--brand)",
        borderRadius: 0,
        background: "#fff",
        color: "var(--brand)",
        appearance: "none",
        WebkitAppearance: "none",
        width: "100%",
        cursor: "pointer",
        outline: "none",
        ...style,
      }}
    >
      {children}
    </select>
    <span
      style={{
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        color: "var(--brand)",
        fontSize: 10,
      }}
    >
      ▾
    </span>
  </div>
);

/* ---------- Nail photo (real images from assets/nails/) ---------- */
const NailPhoto = ({ index = 0, aspect = "3/4", style, label }) => (
  <div
    className="nail-photo-wrap"
    style={{
      aspectRatio: aspect,
      position: "relative",
      overflow: "hidden",
      borderRadius: 0,
      background: "#f5f5f5",
      ...style,
    }}
  >
    <img
      src={NAIL_ASSETS[index % NAIL_ASSETS.length]}
      alt=""
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
    {label && (
      <span
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          fontFamily: "var(--font-sans)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#fff",
          background: "rgba(0,0,0,0.3)",
          padding: "2px 6px",
        }}
      >
        {label}
      </span>
    )}
  </div>
);

/* ---------- Instagram SVG icon (inline — no Lucide dependency) ---------- */
const InstagramIcon = ({ size = 16, color = "#E8174A", style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0, ...style }}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

/* ---------- Lucide icon shim ---------- */
const Icon = ({ name, size = 16, stroke = 1.5, color = "currentColor", style }) => (
  <i
    data-lucide={name}
    style={{ display: "inline-flex", width: size, height: size, color, strokeWidth: stroke, flexShrink: 0, ...style }}
  />
);

const useLucide = () => {
  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  });
};

Object.assign(window, {
  NAIL_ASSETS, NAIL_PHOTOS, Button, Eyebrow, Pill, Field, Input, Select,
  NailPhoto, Icon, InstagramIcon, useLucide, useNailCursor, useWindowWidth,
});
