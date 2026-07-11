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
  { img: '/gurnaaz_hero_model_custom_5.png' },
  { img: '/anarkali_suit.png' },
  { img: '/chikankari_suit.png' },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const rotateRef  = useRef(null);
  const [slide, setSlide] = useState(0);
  const [ready, setReady] = useState(false);

  /* ── entry animation ── */
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(t);
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
    opacity:   ready ? 1 : 0,
    transform: ready ? 'none' : 'translateY(24px)',
    transition: `opacity 1s ${delay}s ${ease}, transform 1s ${delay}s ${ease}`,
  });

  return (
    <>
      <style>{`
        /* ── nav hover underline ── */
        .gh-nav-btn:hover { background:#111 !important; }
        .gh-nav-btn:hover svg path { stroke:#fff !important; }
      `}</style>

      <section
        ref={sectionRef}
        style={{
          position:   'relative',
          width:      '100%',
          height:     '100vh',
          minHeight:  '620px',
          background: '#FAF9F6', // Matched with Navbar Ivory
          overflow:   'hidden',
          fontFamily: "'Montserrat', sans-serif",
        }}
      >

        {/* ════════════ LAYER 1 — GURNAAZ watermark ════════════ */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1, pointerEvents: 'none', userSelect: 'none', overflow: 'hidden',
          ...anim(0),
        }}>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize:   'clamp(100px, 20vw, 310px)',
            fontWeight: 700,
            color:      'rgba(0,0,0,0.055)',
            letterSpacing: '0.12em',
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}>
            GURNAAZ
          </span>
        </div>

        {/* ════════════ LAYER 2 — "Fa" LEFT ════════════ */}
        <div style={{
          position:  'absolute',
          left: 0, top: '50%',
          transform: ready ? 'translateY(-50%)' : 'translateY(-50%) translateX(-30px)',
          opacity:   ready ? 1 : 0,
          transition:`opacity 1s 0.2s ${ease}, transform 1s 0.2s ${ease}`,
          zIndex:    2,
          pointerEvents: 'none',
          userSelect:    'none',
          lineHeight: 0.85,
        }}>
          <span style={{
            fontFamily:    "'Cinzel', serif",
            fontSize:      'clamp(90px, 15vw, 210px)',
            fontWeight:    700,
            color:         '#111',
            letterSpacing: '-0.04em',
            display:       'block',
            paddingLeft:   'clamp(18px, 3.5vw, 56px)',
          }}>
            Fa
          </span>
        </div>

        {/* ════════════ LAYER 2 — "◆shion" RIGHT ════════════ */}
        <div style={{
          position:  'absolute',
          right: 0, top: '50%',
          transform: ready ? 'translateY(-50%)' : 'translateY(-50%) translateX(30px)',
          opacity:   ready ? 1 : 0,
          transition:`opacity 1s 0.2s ${ease}, transform 1s 0.2s ${ease}`,
          zIndex:    2,
          pointerEvents: 'none',
          userSelect:    'none',
          display: 'flex',
          alignItems: 'center',
          lineHeight: 0.85,
        }}>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize:   'clamp(26px, 3.6vw, 56px)',
            color:      '#111',
            lineHeight: 1,
            marginRight: '3px',
            flexShrink: 0,
          }}>◆</span>
          <span style={{
            fontFamily:    "'Cinzel', serif",
            fontSize:      'clamp(90px, 15vw, 210px)',
            fontWeight:    700,
            color:         '#111',
            letterSpacing: '-0.04em',
            display:       'block',
            paddingRight:  'clamp(18px, 3.5vw, 56px)',
          }}>
            shion
          </span>
        </div>

        {/* ════════════ LAYER 3 — Model image (ON TOP of text) ════════════ */}
        <div style={{
          position:  'absolute',
          left: '50%', bottom: 0,
          transform: ready
            ? 'translateX(-50%)'
            : 'translateX(-50%) translateY(40px)',
          opacity:   ready ? 1 : 0,
          transition:`opacity 1.2s 0.35s ${ease}, transform 1.2s 0.35s ${ease}`,
          width:     'clamp(300px, 45vw, 650px)',
          height:    '92vh',
          zIndex:    3,
          mixBlendMode: 'multiply',
        }}>
          <img
            src={SLIDES[slide].img}
            alt="Gurnaaz Collection"
            style={{
              width:           '100%',
              height:          '100%',
              objectFit:       'contain',
              objectPosition:  'center bottom',
              display:         'block',
              transform:       'scale(1.10)',
              transformOrigin: 'bottom center',
            }}
          />
        </div>

        {/* ════════════ LAYER 5 — Play Video widget (left) ════════════ */}
        <div style={{
          position:  'absolute',
          left:      'clamp(18px, 4vw, 60px)',
          top:       '55%',
          transform: 'translateY(-50%)',
          zIndex:    10,
          display:   'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           '10px',
          cursor:        'pointer',
          ...anim(0.5),
        }}>
          {/* Stacked thumbnail cards */}
          <div style={{ position: 'relative', width: '88px', height: '68px' }}>
            {/* back card */}
            <div style={{
              position: 'absolute', top: 0, left: 14,
              width: '60px', height: '58px', borderRadius: '10px',
              overflow: 'hidden', border: '2.5px solid #fff',
              boxShadow: '0 6px 18px rgba(0,0,0,0.13)',
            }}>
              <img src="/gurnaaz_fabric.png" alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* front card */}
            <div style={{
              position: 'absolute', top: 9, left: 0,
              width: '60px', height: '58px', borderRadius: '10px',
              overflow: 'hidden', border: '2.5px solid #fff',
              boxShadow: '0 6px 18px rgba(0,0,0,0.10)',
            }}>
              <img src="/gurnaaz_hero_model.png" alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(0.8)' }} />
            </div>
          </div>

          {/* Play button */}
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(0,0,0,0.14)',
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M3.5 2.5L10.5 6.5L3.5 10.5V2.5Z" fill="#111" />
            </svg>
          </div>

          {/* Label */}
          <span style={{
            fontSize: '8.5px', fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: '#111',
          }}>
            PLAY VIDEO
          </span>
        </div>

        {/* ════════════ LAYER 5 — Stats (bottom right, above arrows) ════════════ */}
        <div style={{
          position: 'absolute',
          right:    'clamp(18px, 4vw, 60px)',
          bottom:   'clamp(80px, 13vh, 120px)',
          zIndex:   10,
          display:  'flex',
          alignItems: 'stretch',
          ...anim(0.6),
        }}>
          {[
            { val: '8+',  label: 'Experience' },
            { val: '4k+', label: 'Best clients' },
            { val: '4.9', label: 'Review' },
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

        {/* ════════════ LAYER 5 — Rotating circle text (bottom left) ════════════ */}
        <div style={{
          position: 'absolute',
          left:     'clamp(18px, 4vw, 60px)',
          bottom:   'clamp(18px, 3.5vh, 40px)',
          zIndex:   10,
          width:    '88px', height: '88px',
          display:  'flex', alignItems: 'center', justifyContent: 'center',
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

        {/* ════════════ LAYER 5 — Nav arrows + counter (bottom right) ════════════ */}
        <div style={{
          position: 'absolute',
          right:    'clamp(18px, 4vw, 60px)',
          bottom:   'clamp(18px, 3.5vh, 40px)',
          zIndex:   10,
          display:  'flex', alignItems: 'center', gap: '14px',
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
