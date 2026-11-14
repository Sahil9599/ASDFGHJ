import { useEffect, useRef, useState } from 'react';

/**
 * RibbonCursor — Ghislain Auzillon–style chained trailing dots cursor.
 * Multiple circles chase each other via lerp interpolation,
 * creating an organic, rubber-band-like flowing trail.
 * Nothing OS palette: white dots with subtle #d71921 red tint on outer trail.
 * Desktop only (pointer: fine), respects prefers-reduced-motion.
 */

const DOTS_COUNT = 20;

// Each dot config: size tapers, opacity fades, ease decreases (more lag)
const generateDotConfigs = () => {
  const configs = [];
  for (let i = 0; i < DOTS_COUNT; i++) {
    const progress = i / (DOTS_COUNT - 1); // 0 = head, 1 = tail
    configs.push({
      size: Math.max(2, 20 - progress * 18),
      opacity: Math.max(0.04, 0.85 - progress * 0.85),
      ease: Math.max(0.06, 0.35 - progress * 0.28),
      // Color shifts from white to red towards tail
      color:
        progress < 0.5
          ? `rgba(255, 255, 255, ${Math.max(0.05, 0.9 - progress * 1.4)})`
          : `rgba(215, 25, 33, ${Math.max(0.03, 0.5 - (progress - 0.5) * 0.9)})`,
    });
  }
  return configs;
};

const DOT_CONFIGS = generateDotConfigs();

export default function RibbonCursor() {
  const canvasRef = useRef(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (!isFinePointer || prefersReduced) return;
    setSupported(true);
  }, []);

  useEffect(() => {
    if (!supported) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let mouseInWindow = false;

    // Mouse position
    const mouse = { x: -200, y: -200 };

    // Dot positions — each chases the one before it
    const dots = [];
    for (let i = 0; i < DOTS_COUNT; i++) {
      dots.push({ x: -200, y: -200 });
    }

    // Resize canvas to fill viewport
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Mouse handlers
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!mouseInWindow) mouseInWindow = true;
    };
    const onLeave = () => {
      mouseInWindow = false;
    };
    const onEnter = () => {
      mouseInWindow = true;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    // Animation loop
    const animate = () => {
      animId = requestAnimationFrame(animate);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update dot positions — chained lerp
      let targetX = mouse.x;
      let targetY = mouse.y;

      for (let i = 0; i < DOTS_COUNT; i++) {
        const dot = dots[i];
        const cfg = DOT_CONFIGS[i];

        // Lerp towards target (mouse for first dot, previous dot for rest)
        dot.x += (targetX - dot.x) * cfg.ease;
        dot.y += (targetY - dot.y) * cfg.ease;

        // Next dot chases this one
        targetX = dot.x;
        targetY = dot.y;
      }

      if (!mouseInWindow) return;

      // Draw connecting line between dots (thin, subtle)
      if (dots.length > 1) {
        ctx.beginPath();
        ctx.moveTo(dots[0].x, dots[0].y);
        for (let i = 1; i < DOTS_COUNT; i++) {
          ctx.lineTo(dots[i].x, dots[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw dots (back to front so head dot is on top)
      for (let i = DOTS_COUNT - 1; i >= 0; i--) {
        const dot = dots[i];
        const cfg = DOT_CONFIGS[i];
        const radius = cfg.size / 2;

        // Glow for first few dots
        if (i < 3) {
          const glowRadius = radius + 8 - i * 2;
          const glow = ctx.createRadialGradient(
            dot.x, dot.y, radius * 0.5,
            dot.x, dot.y, glowRadius
          );
          glow.addColorStop(0, `rgba(215, 25, 33, ${0.12 - i * 0.03})`);
          glow.addColorStop(1, 'rgba(215, 25, 33, 0)');
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Main dot circle
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = cfg.color;
        ctx.fill();

        // Crisp white border on head dot
        if (i === 0) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, radius + 1.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [supported]);

  if (!supported) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}
