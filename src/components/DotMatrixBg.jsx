import React, { useEffect, useRef } from 'react';

// Subtle Nothing OS Glyph Dot-Matrix Canvas with gentle white & red LED pulses
export default function DotMatrixBg({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const spacing = 26;
    let animId;
    let mouse = { x: -999, y: -999 };

    // Occasional Glyph LED beacon dots
    const beacons = Array.from({ length: 18 }, () => ({
      col: Math.floor(Math.random() * Math.ceil(width / spacing)),
      row: Math.floor(Math.random() * Math.ceil(height / spacing)),
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.025,
      isRed: Math.random() > 0.68,
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      beacons.forEach((b) => {
        b.col = Math.floor(Math.random() * Math.ceil(width / spacing));
        b.row = Math.floor(Math.random() * Math.ceil(height / spacing));
      });
    };

    const handleMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handleMove, { passive: true });

    let lastDraw = 0;
    const interval = 1000 / 30;

    const draw = (now) => {
      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(draw);
      }
      if (now - lastDraw < interval && !prefersReducedMotion) return;
      lastDraw = now;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      // Base crisp dot grid + mouse Glyph illumination
      for (let c = 0; c < cols; c++) {
        const x = c * spacing + spacing / 2;
        for (let r = 0; r < rows; r++) {
          const y = r * spacing + spacing / 2;
          const dist = Math.hypot(x - mouse.x, y - mouse.y);

          if (dist < 130) {
            const intensity = 1 - dist / 130;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.07 + intensity * 0.28})`;
            ctx.beginPath();
            ctx.arc(x, y, 1 + intensity * 0.9, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.055)';
            ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
          }
        }
      }

      // Pulsing Glyph LED beacons (white & Nothing red)
      if (!prefersReducedMotion) {
        beacons.forEach((b) => {
          b.phase += b.speed;
          const alpha = Math.max(0, Math.sin(b.phase)) * 0.65;
          if (alpha > 0.05) {
            const bx = b.col * spacing + spacing / 2;
            const by = b.row * spacing + spacing / 2;
            ctx.fillStyle = b.isRed
              ? `rgba(215, 25, 33, ${alpha})`
              : `rgba(255, 255, 255, ${alpha * 0.6})`;
            ctx.beginPath();
            ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}
