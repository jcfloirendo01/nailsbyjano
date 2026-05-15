/* Main app — Lenis + GSAP ScrollTrigger + page transitions */
/* global React, ReactDOM, TopNav, Hero, ServicesPage, BeautyBand, PhotoSpread, Gallery, AboutPage, Footer, BookingPanel, ConfirmedScreen, SERVICES */

const { useState, useEffect } = React;

const App = () => {
  const [route, setRoute] = useState("home");
  const [selectedService, setSelectedService] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  /* ----------------------------------------------------------------
     Lenis smooth scroll — initialise once, connect to GSAP ticker
  ---------------------------------------------------------------- */
  useEffect(() => {
    if (!window.Lenis || !window.gsap) return;

    const lenis = new window.Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    const tick = time => lenis.raf(time * 1000);
    window.gsap.ticker.add(tick);
    window.gsap.ticker.lagSmoothing(0);
    window._lenis = lenis;

    return () => {
      lenis.destroy();
      window.gsap.ticker.remove(tick);
      delete window._lenis;
    };
  }, []);

  /* ----------------------------------------------------------------
     ScrollTrigger — re-run animations each time the route changes
  ---------------------------------------------------------------- */
  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
    window.gsap.registerPlugin(window.ScrollTrigger);
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;

    const timer = setTimeout(() => {
      /* Kill stale triggers from previous route */
      ST.getAll().forEach(t => t.kill());

      /* --- Hero category names: stagger entrance (not scroll) --- */
      const heroCats = document.querySelectorAll('.hero-cat');
      if (heroCats.length) {
        gsap.fromTo(heroCats,
          { y: 70, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.18, delay: 0.2 }
        );
      }

      /* --- Eyebrows: slide in from left on scroll --- */
      gsap.utils.toArray('.anim-left').forEach(el => {
        gsap.fromTo(el,
          { x: -28, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.75, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });

      /* --- Headings: fade up on scroll --- */
      gsap.utils.toArray('h1, h2').forEach(el => {
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.0, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });

      /* --- Photos: fade + lift with stagger on scroll --- */
      const photoWraps = document.querySelectorAll('.nail-photo-wrap');
      photoWraps.forEach((el, i) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'power2.out',
            delay: (i % 4) * 0.08,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        );
      });

      /* --- Body copy paragraphs: gentle fade up --- */
      gsap.utils.toArray('section > div p').forEach(el => {
        gsap.fromTo(el,
          { y: 22, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        );
      });

      if (window._lenis) window._lenis.resize();
      ST.refresh();
    }, 160);

    return () => clearTimeout(timer);
  }, [route]);

  /* ----------------------------------------------------------------
     Lucide icons
  ---------------------------------------------------------------- */
  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }, [route]);

  const navigate = (newRoute, service = null) => {
    setSelectedService(service);
    setRoute(newRoute);
    window.scrollTo(0, 0);
    if (window._lenis) window._lenis.scrollTo(0, { immediate: true });
  };

  const goBook = (service) => navigate('book', service || null);
  const goHome = () => navigate('home');

  const showFooter = route !== 'book' && route !== 'owner';

  let body;
  if (route === 'home') {
    body = (
      <>
        <Hero onBook={() => goBook()} />
        <BeautyBand onBook={() => goBook()} />
        <PhotoSpread />
        <Gallery />
      </>
    );
  } else if (route === 'services') {
    body = <ServicesPage onBook={goBook} />;
  } else if (route === 'gallery') {
    body = <Gallery />;
  } else if (route === 'about') {
    body = <AboutPage />;
  } else if (route === 'owner') {
    body = <VoucherLookup />;
  } else if (route === 'book') {
    body = (
      <BookingPanel
        initialService={selectedService}
        onClose={goHome}
        onConfirm={(b) => {
          setBookingResult(b);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
      />
    );
  }

  const isMobile = typeof useWindowWidth === "function" ? useWindowWidth() <= 768 : false;
  const showFab  = isMobile && route !== 'book' && route !== 'owner';

  return (
    <div className="nbj">
      <TopNav active={route} onNavigate={r => navigate(r)} onBook={() => goBook()} />
      {body}
      {showFooter && <Footer onBook={() => goBook()} onNavigate={r => navigate(r)} />}

      {showFab && (
        <button
          onClick={() => goBook()}
          style={{
            position: "fixed",
            bottom: 24,
            right: 20,
            zIndex: 1000,
            background: "var(--brand)",
            color: "#fff",
            border: "none",
            borderRadius: 0,
            padding: "14px 22px",
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(232,23,74,0.35)",
          }}
        >
          Book Now
        </button>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
