import React, { useEffect, useRef, useState } from 'react';
import './LiveWallpaper.css';

const THEMES = {
  aurora: {
    name: 'Cosmic Aurora',
    icon: 'bi-moon-stars-fill',
    particleColor: 'rgba(139, 92, 246, 0.65)',
    lineColor: 'rgba(99, 102, 241, 0.18)',
    blob1: 'radial-gradient(circle, rgba(89, 56, 182, 0.35) 0%, transparent 70%)',
    blob2: 'radial-gradient(circle, rgba(236, 72, 153, 0.28) 0%, transparent 70%)',
    blob3: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
    blob4: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
  },
  cyber: {
    name: 'Cyber Wave',
    icon: 'bi-cpu-fill',
    particleColor: 'rgba(6, 182, 212, 0.75)',
    lineColor: 'rgba(59, 130, 246, 0.22)',
    blob1: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 70%)',
    blob2: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
    blob3: 'radial-gradient(circle, rgba(217, 70, 239, 0.25) 0%, transparent 70%)',
    blob4: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%)',
  },
  sunset: {
    name: 'Golden Hour',
    icon: 'bi-sunset-fill',
    particleColor: 'rgba(245, 158, 11, 0.7)',
    lineColor: 'rgba(239, 68, 68, 0.18)',
    blob1: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%)',
    blob2: 'radial-gradient(circle, rgba(239, 68, 68, 0.28) 0%, transparent 70%)',
    blob3: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)',
    blob4: 'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, transparent 70%)',
  }
};

const floatingGlyphs = ['🎓', '⚡', '💡', '📚', '🌟', '🚀', '🎯', '✨'];

const LiveWallpaper = () => {
  const canvasRef = useRef(null);
  const [currentTheme, setCurrentTheme] = useState('aurora');
  const [showControls, setShowControls] = useState(false);
  const mousePosRef = useRef({ x: -1000, y: -1000, radius: 140 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize particles
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseVal: Math.random() * Math.PI,
      });
    }

    const theme = THEMES[currentTheme];

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulseVal += p.pulseSpeed;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse interaction attraction / repulse
        const dx = mousePosRef.current.x - p.x;
        const dy = mousePosRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mousePosRef.current.radius) {
          const force = (mousePosRef.current.radius - dist) / mousePosRef.current.radius;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
        }

        // Draw particle
        const size = p.radius + Math.sin(p.pulseVal) * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, size), 0, Math.PI * 2);
        ctx.fillStyle = theme.particleColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = theme.particleColor;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles with glowing lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distBetween = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distBetween < 130) {
            const alpha = 1 - distBetween / 130;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = theme.lineColor.replace(/[\d.]+\)$/g, `${alpha * 0.35})`);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme]);

  const activeTheme = THEMES[currentTheme];

  return (
    <div className="live-wallpaper-container" aria-hidden="true">
      {/* Dynamic Animated Aurora Blobs */}
      <div 
        className="live-aurora-orb orb-1" 
        style={{ backgroundImage: activeTheme.blob1 }} 
      />
      <div 
        className="live-aurora-orb orb-2" 
        style={{ backgroundImage: activeTheme.blob2 }} 
      />
      <div 
        className="live-aurora-orb orb-3" 
        style={{ backgroundImage: activeTheme.blob3 }} 
      />
      <div 
        className="live-aurora-orb orb-4" 
        style={{ backgroundImage: activeTheme.blob4 }} 
      />

      {/* Floating 3D Drifting Campus Glyphs */}
      <div className="live-floating-glyphs">
        {floatingGlyphs.map((glyph, i) => (
          <span 
            key={i} 
            className={`live-glyph glyph-${i + 1}`}
          >
            {glyph}
          </span>
        ))}
      </div>

      {/* Canvas Interactive Particle Field */}
      <canvas ref={canvasRef} className="live-canvas-particles" />

      {/* Grid Pattern Overlay */}
      <div className="live-grid-overlay" />

      {/* Interactive Theme Switcher Trigger */}
      <div className="live-theme-controller" aria-hidden="false">
        {showControls ? (
          <div className="live-theme-menu">
            <div className="live-theme-header">
              <span>Live Wallpaper</span>
              <button type="button" onClick={() => setShowControls(false)}>✕</button>
            </div>
            <div className="live-theme-options">
              {Object.entries(THEMES).map(([key, t]) => (
                <button
                  key={key}
                  type="button"
                  className={`live-theme-opt ${currentTheme === key ? 'active' : ''}`}
                  onClick={() => setCurrentTheme(key)}
                >
                  <i className={`bi ${t.icon} me-1`} />
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button 
            type="button"
            className="live-theme-trigger-btn"
            onClick={() => setShowControls(true)}
            title="Customize Live Moving Wallpaper Theme"
          >
            <i className={`bi ${activeTheme.icon}`} />
            <span>Live Wallpaper</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveWallpaper;
