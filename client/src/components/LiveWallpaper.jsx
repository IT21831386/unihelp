import React, { useEffect, useRef, useState } from 'react';
import './LiveWallpaper.css';

const CAMPUS_WALLPAPERS = [
  {
    id: 'quad',
    title: 'University Modern Quad',
    tag: 'Campus Hub',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2072&auto=format&fit=crop',
  },
  {
    id: 'library',
    title: 'Grand Research Library',
    tag: 'Quiet Zone',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'techlab',
    title: 'Student Innovation Lab',
    tag: 'Tech & Careers',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'grounds',
    title: 'University Twilight Grounds',
    tag: 'Campus Life',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'lounge',
    title: 'Student Commons & Lounge',
    tag: 'Social & Market',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
  }
];

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
  const [activeWallpaperIndex, setActiveWallpaperIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const mousePosRef = useRef({ x: -1000, y: -1000, radius: 140 });

  // ── Live Wallpaper Auto-Change Timer ──
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveWallpaperIndex((prev) => (prev + 1) % CAMPUS_WALLPAPERS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleNext = () => {
    setActiveWallpaperIndex((prev) => (prev + 1) % CAMPUS_WALLPAPERS.length);
  };

  const handlePrev = () => {
    setActiveWallpaperIndex((prev) => (prev - 1 + CAMPUS_WALLPAPERS.length) % CAMPUS_WALLPAPERS.length);
  };

  // ── Canvas Particle Mesh Effect ──
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

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulseVal += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dx = mousePosRef.current.x - p.x;
        const dy = mousePosRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mousePosRef.current.radius) {
          const force = (mousePosRef.current.radius - dist) / mousePosRef.current.radius;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
        }

        const size = p.radius + Math.sin(p.pulseVal) * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, size), 0, Math.PI * 2);
        ctx.fillStyle = theme.particleColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = theme.particleColor;
        ctx.fill();
        ctx.shadowBlur = 0;

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
  const activeWallpaper = CAMPUS_WALLPAPERS[activeWallpaperIndex];

  return (
    <div className="live-wallpaper-container" aria-hidden="true">
      {/* ── Live Moving Photographic Background Layers with Smooth Cross-fade ── */}
      <div className="live-bg-images-layer">
        {CAMPUS_WALLPAPERS.map((wp, idx) => (
          <div
            key={wp.id}
            className={`live-bg-slide ${idx === activeWallpaperIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${wp.url})` }}
          />
        ))}
      </div>

      {/* Glass Frost Scrim */}
      <div className="live-bg-glass-scrim" />

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

      {/* ── Interactive Live Wallpaper Player & Theme Widget ── */}
      <div className="live-theme-controller" aria-hidden="false">
        {showControls ? (
          <div className="live-theme-menu">
            <div className="live-theme-header">
              <div className="d-flex align-items-center gap-2">
                <span className="live-pulse-dot"></span>
                <span>Live Wallpaper Studio</span>
              </div>
              <button type="button" onClick={() => setShowControls(false)}>✕</button>
            </div>

            {/* Current Active Wallpaper Status */}
            <div className="live-current-wp-card mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">{activeWallpaper.tag}</small>
                <span className="badge bg-primary rounded-pill" style={{ fontSize: '10px' }}>
                  {activeWallpaperIndex + 1} / {CAMPUS_WALLPAPERS.length}
                </span>
              </div>
              <strong className="d-block text-dark mt-1" style={{ fontSize: '12px' }}>
                {activeWallpaper.title}
              </strong>
            </div>

            {/* Playback Controls */}
            <div className="live-playback-controls mb-3">
              <button type="button" onClick={handlePrev} title="Previous Wallpaper" className="live-ctrl-btn">
                <i className="bi bi-chevron-left" />
              </button>
              <button 
                type="button" 
                onClick={() => setIsAutoPlay(!isAutoPlay)} 
                title={isAutoPlay ? 'Pause Auto-Change' : 'Start Auto-Change'}
                className="live-ctrl-btn primary"
              >
                <i className={`bi ${isAutoPlay ? 'bi-pause-fill' : 'bi-play-fill'}`} />
                <span style={{ fontSize: '11px' }}>{isAutoPlay ? 'Auto-Live' : 'Paused'}</span>
              </button>
              <button type="button" onClick={handleNext} title="Next Wallpaper" className="live-ctrl-btn">
                <i className="bi bi-chevron-right" />
              </button>
            </div>

            {/* Wallpaper Thumbnails Switcher */}
            <div className="live-wp-thumbnails mb-3">
              {CAMPUS_WALLPAPERS.map((wp, idx) => (
                <div
                  key={wp.id}
                  className={`live-wp-thumb ${idx === activeWallpaperIndex ? 'active' : ''}`}
                  onClick={() => setActiveWallpaperIndex(idx)}
                  title={wp.title}
                  style={{ backgroundImage: `url(${wp.url})` }}
                />
              ))}
            </div>

            {/* Aurora Palette Themes */}
            <div className="border-top pt-2">
              <small className="text-muted fw-bold d-block mb-1" style={{ fontSize: '11px' }}>AURORA PALETTES</small>
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
          </div>
        ) : (
          <div className="live-min-bar d-flex align-items-center gap-2">
            <button 
              type="button"
              className="live-theme-trigger-btn"
              onClick={() => setShowControls(true)}
              title="Live Moving Wallpaper Controls"
            >
              <span className="live-pulse-dot"></span>
              <i className="bi bi-camera-reels-fill me-1" />
              <span>Live: {activeWallpaper.title}</span>
            </button>
            <button
              type="button"
              className="live-quick-next-btn"
              onClick={handleNext}
              title="Switch to Next Live Wallpaper"
            >
              <i className="bi bi-arrow-repeat" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveWallpaper;

