import { useEffect, useRef, useState } from 'react';

/*
  Gurnaaz Hero — Queen's editorial layout:
  ┌─────────────────────────────────────────────────────┐
  │  GURNAAZ  (huge faded watermark behind all)         │
  │                                                     │
  │  Fa          [MODEL IMAGE]          ◆shion           │
  │  (left edge)   (centered)           (right edge)    │
  │                                                     │
  │  [Thumbnails]            [8+  4k+  4.9]            │
  │  PLAY VIDEO                                         │
  │  ⟳ choose..   ←  01  →                             │
  └─────────────────────────────────────────────────────┘
*/

const SLIDES = [
  { img: '/luxury_model_truly_transparent.png' },
  { img: '/generated_red_suit_bgless.png' },
  { img: '/generated_white_suit_bgless.png' },
  { img: '/generated_blue_suit_bgless.png' },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const rotateRef = useRef(null);
  const [slide, setSlide] = useState(0);
  const [ready, setReady] = useState(false);

  /* ── entry animation ── */
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(t);
  }, []);

  /* ── auto slider ── */
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(s => (s + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  /* ── rotating circle text ── */
  useEffect(() => {
    const el = rotateRef.current;
    if (!el) return;
    let a = 0;
    const id = setInterval(() => { a += 0.35; el.style.transform = `rotate(${a}deg)`; }, 16);
    return () => clearInterval(id);
  }, []);

  const prev = () => setSlide(s => (s === 0 ? SLIDES.length - 1 : s - 1));
  const next = () => setSlide(s => (s === SLIDES.length - 1 ? 0 : s + 1));

  const ease = 'cubic-bezier(0.16,1,0.3,1)';
  const anim = (delay = 0) => ({
    opacity: ready ? 1 : 0,
    transform: ready ? 'none' : 'translateY(24px)',
    transition: `opacity 1s ${delay}s ${ease}, transform 1s ${delay}s ${ease}`,
  });

  return (
    <>
      <style>{`
        /* ── responsive hero elements ── */
        .gurnaaz-watermark { padding-top: 18vh !important; }
        .fashion-text-container { top: 34% !important; }

        /* Widget backgrounds only needed on mobile where they overlap the dress */
        .gh-protected-text {
          background: transparent;
          backdrop-filter: none;
          padding: 0;
          border-radius: 0;
        }
        .gh-nav-btn { background: transparent !important; }

        @media (max-width: 768px) {
          .gurnaaz-watermark { padding-top: 15vh !important; }
          .fashion-text-container { top: 26% !important; }
          .hero-rotating-text { display: none !important; }
          .hero-stats { display: none !important; }
          
          .gh-protected-text {
            background: rgba(250, 249, 246, 0.85) !important;
            backdrop-filter: blur(4px) !important;
            padding: 4px 10px !important;
            border-radius: 20px !important;
          }
          .gh-nav-btn { background: #FAF9F6 !important; }
        }

        /* ── massive screens (4K) scaling for widgets ── */
        @media (min-width: 1800px) {
          .gh-scale-large-left { transform: scale(1.5); transform-origin: bottom left; }
          .gh-scale-large-right { transform: scale(1.5); transform-origin: bottom right; }
        }
        @media (max-width: 1799px) {
          .gh-scale-large-left { transform: scale(0.75); transform-origin: bottom left; }
          .gh-scale-large-right { transform: scale(0.75); transform-origin: bottom right; }
          .hero-model-container { width: clamp(480px, 80vw, 700px) !important; bottom: -7vh !important; height: 95vh !important; }
          .hero-fashion-text { font-size: clamp(90px, 21vw, 340px) !important; }
          .hero-gurnaaz-text { font-size: clamp(50px, 15vw, 210px) !important; }
        }
        @media (max-width: 1000px) {
          .hero-stats { display: none !important; }
          .hero-model-container { bottom: -10vh !important; }
        }
        @media (max-width: 768px) {
          .gh-scale-large-left { transform: scale(0.65); transform-origin: bottom left; }
          .gh-scale-large-right { transform: scale(0.65); transform-origin: bottom right; }
          .gurnaaz-watermark { padding-top: 12vh !important; }
          .fashion-text-container { top: 25% !important; }
          .hero-model-container { bottom: 10vh !important; height: 85vh !important; width: clamp(300px, 120vw, 480px) !important; }
        }

        /* ── nav hover underline ── */
        .gh-nav-btn:hover { background:#111 !important; }
        .gh-nav-btn:hover svg path { stroke:#fff !important; }
        
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes counterOrbit { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(-360deg); } }
        @keyframes fadeInSlide { from { opacity: 0; transform: scale(1.05) translateY(20px); } to { opacity: 1; transform: scale(1.10) translateY(0); } }
      `}</style>

      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          minHeight: '620px',
          background: '#FAF9F6', // Matched with Navbar Ivory
          overflow: 'hidden',
          fontFamily: "'Montserrat', sans-serif",
        }}
      >

        <div className="gurnaaz-watermark" style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: '22vh', // default fallback, handled by CSS class
          zIndex: 1, pointerEvents: 'none', userSelect: 'none', overflow: 'hidden',
          ...anim(0),
        }}>
          <span className="hero-gurnaaz-text" style={{
            fontFamily: "'Cormorant Garamond', serif", // Perfectly matching the "Fashion" font
            fontSize: 'clamp(65px, 18vw, 500px)', // default massive max for 4K
            fontWeight: 400,
            color: 'rgba(0,0,0,0.055)',
            letterSpacing: '0.10em', // medium letter spacing
            whiteSpace: 'nowrap',
            lineHeight: 1,
            display: 'inline-block', // needed for transform to apply
            transform: 'scale(1, 1.8)', // stretch the font height vertically
            transformOrigin: 'center center',
          }}>
            GURNAAZ
          </span>
        </div>

        {/* ════════════ LAYER 2 — "Fashion" TEXT ════════════ */}
        <div className="fashion-text-container" style={{
          position: 'absolute',
          left: 0, right: 0, top: '38%', // default fallback, handled by CSS class
          transform: ready ? 'translateY(-50%)' : 'translateY(-50%) translateY(20px)',
          opacity: ready ? 1 : 0,
          transition: `opacity 1s 0.2s ${ease}, transform 1s 0.2s ${ease}`,
          textAlign: 'center',
          zIndex: 2, pointerEvents: 'none', userSelect: 'none',
        }}>
          <span className="hero-fashion-text" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(110px, 25vw, 800px)', // default massive max for 4K
            fontWeight: 300,
            color: '#111',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            Fashi
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              o
              {/* Diamond inside 'o' */}
              <span style={{
                position: 'absolute',
                fontSize: '0.22em',
                color: '#111',
                top: '59%', // Optically centered in the Cormorant Garamond 'o'
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
                ✦
              </span>
            </span>
            n
          </span>
        </div>

        {/* ════════════ LAYER 3 — Model image (ON TOP of text) ════════════ */}
        <div className="hero-model-container" style={{
          position: 'absolute',
          left: '50%', bottom: '8vh',
          transform: ready
            ? 'translateX(-50%)'
            : 'translateX(-50%) translateY(40px)',
          opacity: ready ? 1 : 0,
          transition: `opacity 1.2s 0.35s ${ease}, transform 1.2s 0.35s ${ease}`,
          width: 'clamp(480px, 120vw, 1500px)', // Default huge max width for 4K
          height: '92vh',
          zIndex: 3,
        }}>
          <img
            key={slide}
            src={SLIDES[slide].img}
            alt="Gurnaaz Collection"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center bottom',
              display: 'block',
              transform: 'scale(1.10)',
              transformOrigin: 'bottom center',
              animation: 'fadeInSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          />
        </div>

        {/* ════════════ LAYER 4 & 4a — Bottom Left Widgets Wrapper ════════════ */}
        <div className="gh-scale-large-left" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
          
        {/* ════════════ LAYER 4 — Bottom left "Explore" widget ════════════ */}
        <div style={{
          position: 'absolute',
          left: 'clamp(10px, 4vw, 60px)',
          bottom: 'clamp(80px, 18vh, 160px)', // Lifted even higher up
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(10px, 4vw, 50px)',
        }}>
          {/* Explore widget */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            ...anim(0.5),
          }}>
          {/* Circular Layout Container */}
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            
            {/* 6 Images in a rotating circle */}
            <div style={{ position: 'absolute', inset: 0, animation: 'orbit 25s linear infinite' }}>
              {[
                '/banarasi_suit.png',
                '/luxury_hero_model_v2.png',
                '/anarkali_suit.png',
                '/chikankari_suit.png',
                '/pakistani_suit.png',
                '/cute_luxury_model.png'
              ].map((imgSrc, i) => {
                const angle = (i * 60) * (Math.PI / 180);
                const radius = 45;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <div key={i} style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    width: '32px', height: '32px', borderRadius: '50%',
                    overflow: 'hidden', border: '2px solid #FAF9F6',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    zIndex: 5,
                    animation: 'counterOrbit 25s linear infinite',
                  }}>
                    <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                  </div>
                );
              })}
            </div>

            {/* Center Action button */}
            <div style={{
              position: 'absolute',
              left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '42px', height: '42px', borderRadius: '50%',
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(0,0,0,0.14)',
              zIndex: 10,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Label */}
          <span className="gh-protected-text" style={{
            fontSize: '10.5px', fontWeight: 700, // Increased font size
            letterSpacing: '0.22em', textTransform: 'uppercase', color: '#111',
          }}>
            EXPLORE
          </span>
          </div>
        </div>

        {/* ════════════ LAYER 4a — Rotating Text ════════════ */}
        <div className="hero-rotating-text" style={{
          position: 'absolute',
          left: 'clamp(200px, 20vw, 300px)', // Shifted right further to clear the even larger explore widget
          bottom: 'clamp(80px, 18vh, 160px)', // Match the Explore widget's exact bottom position
          pointerEvents: 'auto',
          width: '140px', height: '140px', // Increased size further
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...anim(0.7),
        }}>
            <svg
              ref={rotateRef}
              width="140" height="140" viewBox="0 0 140 140" // Increased size
              style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', transformOrigin: 'center' }}
            >
              <defs>
                <path id="ghCircle"
                  d="M 70, 70 m -54, 0 a 54,54 0 1,1 108,0 a 54,54 0 1,1 -108,0" /> {/* Even larger circle path */}
              </defs>
              <text style={{
                fontSize: '12px', letterSpacing: '3.6px', // Increased font size to match new path
                fill: '#555', fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
              }}>
                <textPath href="#ghCircle">
                  Choose your style · Choose your style ·
                </textPath>
              </text>
            </svg>
            {/* Centre star */}
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', // Increased star circle size
              border: '1.5px solid #111', background: '#FAF9F6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 2,
            }}>
              <svg width="18" height="18" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 0L6.5 4.5L11 5.5L6.5 6.5L5.5 11L4.5 6.5L0 5.5L4.5 4.5L5.5 0Z" fill="#111" />
              </svg>
            </div>
        </div>

        </div> {/* End Left Wrapper */}

        {/* ════════════ LAYER 5 & 6 — Bottom Right Widgets Wrapper ════════════ */}
        <div className="gh-scale-large-right" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>

        {/* ════════════ LAYER 5 — Stats (bottom right, above arrows) ════════════ */}
        <div className="hero-stats" style={{
          position: 'absolute',
          right: 'clamp(18px, 4vw, 60px)',
          bottom: 'clamp(190px, 30vh, 220px)', // Lifted higher to match the new nav arrows height
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'stretch',
          ...anim(0.6),
        }}>
          {[
            { val: '50+', label: 'Exclusive Designs' },
            { val: '100%', label: 'Authentic Quality' },
            { val: '5.0', label: 'Customer Rating' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                paddingLeft: i === 0 ? 0 : '14px', paddingRight: '14px',
              }}>
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(28px, 3.5vw, 48px)', // Increased stat value size
                  fontWeight: 600, color: '#111', lineHeight: 1,
                  textShadow: '0 0 15px rgba(250, 249, 246, 1), 0 0 30px rgba(250, 249, 246, 1)', // Protective glow
                }}>{s.val}</span>
                <span style={{
                  fontSize: '10.5px', color: '#888', // Increased stat label size
                  letterSpacing: '0.06em', marginTop: '6px', whiteSpace: 'nowrap',
                  textShadow: '0 0 10px rgba(250, 249, 246, 1), 0 0 20px rgba(250, 249, 246, 1)', // Protective glow
                }}>{s.label}</span>
              </div>
              {i < 2 && (
                <div style={{
                  width: '1px', background: 'rgba(0,0,0,0.15)',
                  alignSelf: 'stretch', margin: '2px 0',
                }} />
              )}
            </div>
          ))}
        </div>



        {/* ════════════ LAYER 6 — Nav arrows & Counter (bottom right) ════════════ */}
        <div style={{
          position: 'absolute',
          right: 'clamp(18px, 4vw, 60px)',
          bottom: 'clamp(80px, 18vh, 160px)', // Matched horizontally with the Explore widget on the left
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          ...anim(0.8),
        }}>
          <button
            className="gh-nav-btn"
            onClick={prev}
            style={{
              width: '46px', height: '46px', borderRadius: '50%', // Increased button size
              border: '1.5px solid rgba(0,0,0,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.25s',
              color: '#111',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <span className="gh-protected-text" style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '18px', fontWeight: 700, color: '#111', // Increased counter size
            minWidth: '32px', textAlign: 'center', letterSpacing: '0.05em',
            display: 'inline-block'
          }}>
            {String(slide + 1).padStart(2, '0')}
          </span>

          <button
            className="gh-nav-btn"
            onClick={next}
            style={{
              width: '46px', height: '46px', borderRadius: '50%', // Increased button size
              border: '1.5px solid rgba(0,0,0,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.25s',
              color: '#111',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        </div> {/* End Right Wrapper */}

      </section>
    </>
  );
}
