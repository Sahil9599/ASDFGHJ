import React, { useEffect, useRef } from 'react';

export default function MatrixRain({ opacity = 0.15, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Cyber security, networking & hex characters
    const chars = '01010101ABCDEF0123456789//SYN.ACK:PORT>RHEL_CISCO_IPSEC_VLAN_NET_';
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    
    // Y position drops array
    let drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let lastDrawTime = 0;
    const fpsInterval = 1000 / 28; // Throttled to 28 FPS for buttery smoothness and 0% CPU lag

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);

      const elapsed = currentTime - lastDrawTime;
      if (elapsed < fpsInterval) return;
      lastDrawTime = currentTime - (elapsed % fpsInterval);

      // Semi-transparent black wash to create the smooth trailing fade
      ctx.fillStyle = 'rgba(5, 5, 7, 0.09)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of the rain drops is brighter white/silver, tail is subtle emerald/cyber cyan
        if (Math.random() > 0.88) {
          ctx.fillStyle = '#ffffff'; // Specular white head
        } else if (Math.random() > 0.5) {
          ctx.fillStyle = '#10b981'; // Cyber emerald
        } else {
          ctx.fillStyle = '#059669'; // Muted dark matrix green
        }

        ctx.fillText(text, x, y);

        // Reset drop to top with randomized delay once it leaves the screen
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}
