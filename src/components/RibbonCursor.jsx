import { useEffect, useRef, useState } from 'react';

/**
 * RibbonCursor — A flowing ribbon trail that follows the user's cursor.
 * Renders an HTML5 Canvas overlay with a smooth, fading polyline trail.
 * Uses Nothing OS palette: white core ribbon with #d71921 red edge glow.
 * Only renders on desktop (pointer: fine), respects prefers-reduced-motion.
 */
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

    // Trail configuration
    const MAX_POINTS = 80;
    const RIBBON_WIDTH = 28;
    const FADE_SPEED = 0.025;

    // Store trail points: { x, y, age (0-1, 1 = fully faded) }
    const trail = [];
    let mouseX = -100;
    let mouseY = -100;

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
      mouseX = e.clientX;
      mouseY = e.clientY;
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

    // Helper: get perpendicular offset for ribbon width
    const perp = (p0, p1, width) => {
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      return { x: (-dy / len) * width, y: (dx / len) * width };
    };

    // Smooth Catmull-Rom interpolation point
    const catmullRom = (p0, p1, p2, p3, t) => {
      const t2 = t * t;
      const t3 = t2 * t;
      return {
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      };
    };

    let lastAddTime = 0;
    const ADD_INTERVAL = 12; // ms between adding trail points

    // Animation loop
    const draw = (timestamp) => {
      animId = requestAnimationFrame(draw);

      // Add new point at interval
      if (mouseInWindow && timestamp - lastAddTime > ADD_INTERVAL) {
        trail.unshift({ x: mouseX, y: mouseY, age: 0 });
        if (trail.length > MAX_POINTS) trail.length = MAX_POINTS;
        lastAddTime = timestamp;
      }

      // Age & prune
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age += FADE_SPEED;
        if (trail[i].age >= 1) {
          trail.splice(i, 1);
        }
      }

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trail.length < 3) return;

      // Draw ribbon as a filled shape with gradient opacity
      // Build left & right edges using perpendicular offsets
      const leftEdge = [];
      const rightEdge = [];

      for (let i = 0; i < trail.length; i++) {
        const progress = i / (trail.length - 1); // 0 at head, 1 at tail
        const age = trail[i].age;
        const widthMul = (1 - age) * (1 - progress * 0.7);
        const w = RIBBON_WIDTH * 0.5 * widthMul;

        let p;
        if (i === 0) {
          p = perp(trail[0], trail[1], w);
        } else if (i === trail.length - 1) {
          p = perp(trail[i - 1], trail[i], w);
        } else {
          p = perp(trail[i - 1], trail[i + 1], w);
        }

        leftEdge.push({ x: trail[i].x + p.x, y: trail[i].y + p.y });
        rightEdge.push({ x: trail[i].x - p.x, y: trail[i].y - p.y });
      }

      // Draw filled ribbon with smooth Catmull-Rom curves
      // Main ribbon body
      ctx.beginPath();

      // Left edge (head -> tail)
      ctx.moveTo(leftEdge[0].x, leftEdge[0].y);
      for (let i = 0; i < leftEdge.length - 1; i++) {
        const p0 = leftEdge[Math.max(i - 1, 0)];
        const p1 = leftEdge[i];
        const p2 = leftEdge[i + 1];
        const p3 = leftEdge[Math.min(i + 2, leftEdge.length - 1)];
        for (let t = 0; t <= 1; t += 0.25) {
          const pt = catmullRom(p0, p1, p2, p3, t);
          ctx.lineTo(pt.x, pt.y);
        }
      }

      // Right edge (tail -> head, reversed)
      for (let i = rightEdge.length - 1; i >= 0; i--) {
        ctx.lineTo(rightEdge[i].x, rightEdge[i].y);
      }

      ctx.closePath();

      // Create gradient along the ribbon (head to tail opacity)
      // Use a linear gradient from head point to tail point
      const head = trail[0];
      const tail = trail[trail.length - 1];

      const gradient = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.25)');
      gradient.addColorStop(0.7, 'rgba(215, 25, 33, 0.12)');
      gradient.addColorStop(1, 'rgba(215, 25, 33, 0)');

      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw a thin center highlight line with Catmull-Rom smoothing
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 0; i < trail.length - 1; i++) {
        const p0 = trail[Math.max(i - 1, 0)];
        const p1 = trail[i];
        const p2 = trail[i + 1];
        const p3 = trail[Math.min(i + 2, trail.length - 1)];
        for (let t = 0; t <= 1; t += 0.2) {
          const pt = catmullRom(p0, p1, p2, p3, t);
          ctx.lineTo(pt.x, pt.y);
        }
      }

      const lineGrad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
      lineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      lineGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)');
      lineGrad.addColorStop(1, 'rgba(215, 25, 33, 0)');

      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Small glow dot at cursor position
      if (mouseInWindow && trail.length > 0) {
        const headPt = trail[0];
        const dotGrad = ctx.createRadialGradient(
          headPt.x, headPt.y, 0,
          headPt.x, headPt.y, 18
        );
        dotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        dotGrad.addColorStop(0.4, 'rgba(215, 25, 33, 0.15)');
        dotGrad.addColorStop(1, 'rgba(215, 25, 33, 0)');

        ctx.beginPath();
        ctx.arc(headPt.x, headPt.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = dotGrad;
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(draw);

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
