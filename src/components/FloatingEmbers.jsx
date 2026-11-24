import React, { useEffect, useRef } from 'react';

export default function FloatingEmbers() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Dynamic ember particles
    const particleCount = 75;
    const particles = [];

    const emberColors = [
      '255, 85, 0',    // Neon Orange
      '255, 170, 0',   // Fire Gold
      '255, 42, 85',   // Fiery Crimson
      '0, 240, 255',   // Electric Cyan
      '255, 200, 50',  // Spark Yellow
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseRadius: Math.random() * 2.8 + 1.0,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
        baseAlpha: Math.random() * 0.7 + 0.3,
        speedY: Math.random() * 1.2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.8,
        swaySpeed: Math.random() * 0.03 + 0.015,
        swayOffset: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        pulseVal: Math.random() * Math.PI
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.swayOffset += p.swaySpeed;
        p.x += Math.sin(p.swayOffset) * 0.6 + p.speedX;
        p.pulseVal += p.pulseSpeed;

        // Wrap around top to bottom
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        const currentAlpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.pulseVal));
        const currentRadius = p.baseRadius * (0.8 + 0.3 * Math.sin(p.pulseVal));

        // Outer fiery glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius * 4.5);
        glow.addColorStop(0, `rgba(${p.color}, ${currentAlpha})`);
        glow.addColorStop(0.5, `rgba(${p.color}, ${currentAlpha * 0.3})`);
        glow.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Bright white/golden hot core
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, currentAlpha * 1.3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full opacity-90 mix-blend-screen"
    />
  );
}
