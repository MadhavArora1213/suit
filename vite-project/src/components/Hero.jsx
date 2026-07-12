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

        {/* ════════════ LAYER 1 — GURNAAZ watermark ════════════ */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          paddingBottom: '55vh', // Moved further up to leave room for bottom widgets
          zIndex: 1, pointerEvents: 'none', userSelect: 'none', overflow: 'hidden',
          ...anim(0),
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif", // Perfectly matching the "Fashion" font
            fontSize: 'clamp(90px, 16vw, 250px)', // sweet spot between too big and too small
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
        <div style={{
          position: 'absolute',
          left: 0, right: 0, top: '36%',
          transform: ready ? 'translateY(-50%)' : 'translateY(-50%) translateY(20px)',
          opacity: ready ? 1 : 0,
          transition: `opacity 1s 0.2s ${ease}, transform 1s 0.2s ${ease}`,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          lineHeight: 0.85,
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(120px, 25vw, 420px)',
            fontWeight: 300,
            color: '#111',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
          }}>
            Fashi
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              o
              {/* Diamond inside 'o' */}
              <span style={{
                position: 'absolute',
                fontSize: '0.22em',
                color: '#111',
                top: '68%', // Nudged further down for perfect center
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
        <div style={{
          position: 'absolute',
          left: '50%', bottom: '8vh',
          transform: ready
            ? 'translateX(-50%)'
            : 'translateX(-50%) translateY(40px)',
          opacity: ready ? 1 : 0,
          transition: `opacity 1.2s 0.35s ${ease}, transform 1.2s 0.35s ${ease}`,
          width: 'clamp(300px, 45vw, 650px)',
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

        {/* ════════════ LAYER 5 — Bottom Left Group (Explore + Choose Style) ════════════ */}
        <div style={{
          position: 'absolute',
          left: 'clamp(18px, 4vw, 60px)',
          bottom: 'clamp(120px, 15vh, 160px)', // moved up significantly to fit on first screen
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(30px, 4vw, 50px)',
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
          <span style={{
            fontSize: '8.5px', fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: '#111',
          }}>
            EXPLORE
          </span>
          </div>

          {/* Rotating circle text */}
          <div style={{
            width: '88px', height: '88px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...anim(0.7),
          }}>
            <svg
              ref={rotateRef}
              width="88" height="88" viewBox="0 0 88 88"
              style={{ position: 'absolute', transformOrigin: 'center' }}
            >
              <defs>
                <path id="ghCircle"
                  d="M44,44 m-31,0 a31,31 0 1,1 62,0 a31,31 0 1,1 -62,0" />
              </defs>
              <text style={{
                fontSize: '8px', letterSpacing: '2.4px',
                fill: '#555', fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
              }}>
                <textPath href="#ghCircle">
                  Choose your style · Choose your style ·
                </textPath>
              </text>
            </svg>
            {/* Centre star */}
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              border: '1.5px solid #111', background: '#FAF9F6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2,
            }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 0L6.5 4.5L11 5.5L6.5 6.5L5.5 11L4.5 6.5L0 5.5L4.5 4.5L5.5 0Z" fill="#111" />
              </svg>
            </div>
          </div>
        </div>

        {/* ════════════ LAYER 5 — Stats (bottom right, above arrows) ════════════ */}
        <div style={{
          position: 'absolute',
          right: 'clamp(18px, 4vw, 60px)',
          bottom: 'clamp(140px, 20vh, 180px)',
          zIndex: 10,
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
                paddingLeft: i === 0 ? 0 : '20px', paddingRight: '20px',
              }}>
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(22px, 2.8vw, 36px)',
                  fontWeight: 600, color: '#111', lineHeight: 1,
                }}>{s.val}</span>
                <span style={{
                  fontSize: '8px', color: '#888',
                  letterSpacing: '0.06em', marginTop: '4px', whiteSpace: 'nowrap',
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



        {/* ════════════ LAYER 5 — Nav arrows + counter (bottom right) ════════════ */}
        <div style={{
          position: 'absolute',
          right: 'clamp(18px, 4vw, 60px)',
          bottom: 'clamp(60px, 8vh, 100px)', // moved up to stay proportional
          zIndex: 10,
          display: 'flex', alignItems: 'center', gap: '14px',
          ...anim(0.7),
        }}>
          <button
            className="gh-nav-btn"
            onClick={prev}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              border: '1.5px solid rgba(0,0,0,0.22)', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.25s',
              color: '#111',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '15px', fontWeight: 600, color: '#111',
            minWidth: '20px', textAlign: 'center', letterSpacing: '0.05em',
          }}>
            {String(slide + 1).padStart(2, '0')}
          </span>

          <button
            className="gh-nav-btn"
            onClick={next}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              border: '1.5px solid rgba(0,0,0,0.22)', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.25s',
              color: '#111',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </section>
    </>
  );
}
