import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onComplete }) {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!topRef.current || !bottomRef.current) return;
      
      const tl = gsap.timeline({
        onComplete: () => { if (onComplete) onComplete(); }
      });

      tl.to('.smoke-1', { x: '200vw', duration: 4, ease: 'power2.inOut' }, 'smoke')
        .to('.smoke-2', { x: '200vw', duration: 5, ease: 'power1.inOut' }, 'smoke+=0.2')
        .fromTo('.svg-text-stroke', 
          { strokeDashoffset: 2000 }, 
          { strokeDashoffset: 0, duration: 2.5, ease: 'power2.out' },
          'smoke+=1.5'
        )
        .to('.svg-text-fill', { opacity: 1, duration: 0.8, ease: 'power2.out' }, 'smoke+=3.0')
        .to({}, { duration: 0.4 })
        .to(topRef.current, { y: '-100%', duration: 1.2, ease: 'expo.inOut' }, 'split')
        .to(bottomRef.current, { y: '100%', duration: 1.2, ease: 'expo.inOut' }, 'split')
        .to(loaderRef.current, { autoAlpha: 0, duration: 0.1 });
    });
  }, [onComplete]);

  const word = "Welcome";

  const renderSmoke = () => (
    <div className="absolute left-0 top-0 w-full h-0 z-0 pointer-events-none">
      <div className="smoke-1 absolute left-0 top-0 w-[50vw] h-[50vh] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-[100vw] will-change-transform"></div>
      <div className="smoke-2 absolute left-0 top-0 w-[70vw] h-[40vh] rounded-full blur-[100px] -translate-y-1/2 -translate-x-[100vw] will-change-transform" style={{background:'rgba(188,165,138,0.15)'}}></div>
    </div>
  );

  const renderSvgText = () => (
    <svg viewBox="0 0 600 200" style={{position:'absolute',left:'50%',transform:'translateX(-50%)',width:'min(600px, 90vw)',height:'200px',overflow:'visible',pointerEvents:'none',zIndex:10}}>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="svg-text-stroke"
        style={{fontFamily:"'Great Vibes', cursive", fontWeight:400}}>
        {word}
      </text>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="svg-text-fill opacity-0"
        style={{fontFamily:"'Great Vibes', cursive", fontWeight:400}}>
        {word}
      </text>
    </svg>
  );

  return (
    <div ref={loaderRef} className="fixed inset-0 z-50 pointer-events-auto">
      <div ref={topRef} className="absolute top-0 left-0 w-full h-[50vh] overflow-hidden flex justify-center" style={{background:'#111111'}}>
        <div style={{position:'absolute',top:'100%',left:0,width:'100%'}}>{renderSmoke()}</div>
        <div style={{position:'absolute',top:'100%',transform:'translateY(-90px)',width:'100%'}}>{renderSvgText()}</div>
      </div>
      <div ref={bottomRef} className="absolute bottom-0 left-0 w-full h-[50vh] overflow-hidden flex justify-center" style={{background:'#111111'}}>
        <div style={{position:'absolute',top:0,left:0,width:'100%'}}>{renderSmoke()}</div>
        <div style={{position:'absolute',top:0,transform:'translateY(-90px)',width:'100%'}}>{renderSvgText()}</div>
      </div>
    </div>
  );
}
