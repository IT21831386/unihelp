import './Hero.css';

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__glow" />
      <div className="container">
        <div className="hero__content">
          <div className="hero__badge">
            <span>✨ The ultimate student companion</span>
          </div>
          <h1 className="hero__title">
            Find everything you need <span className="hero__title--gradient">in one place</span>
          </h1>
          <p className="hero__subtitle">
            Your all-in-one platform for university life. From finding boardings to career opportunities, we've got you covered.
          </p>
          
          <div className="hero__search-container">
            <div className="hero__search-wrapper">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                placeholder="Search for boardings, jobs, or notices..." 
                className="hero__search-input"
              />
              <button className="hero__search-btn">Explore</button>
            </div>
          </div>

          <div className="hero__stats">
            <div className="stat-item">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Active Students</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Boarding Places</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Daily Notices</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
