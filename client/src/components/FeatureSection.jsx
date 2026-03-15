import './FeatureSection.css';

function FeatureSection({ id, title, tags, description, image, imageAlt, linkText, reverse }) {
  return (
    <section className="feature-section" id={id}>
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div className={`feature-section__card ${reverse ? 'feature-section__card--reverse' : ''}`}>
          <div className="feature-section__image-wrapper">
            <img
              src={image}
              alt={imageAlt || title}
              className="feature-section__image"
            />
          </div>
          <div className="feature-section__content">
            {tags && (
              <div className="feature-section__tags">
                {tags.map((tag, i) => (
                  <span key={i} className="feature-section__tag">{tag}</span>
                ))}
              </div>
            )}
            <p className="feature-section__description">{description}</p>
            <a href={`#${id}`} className="feature-section__link">
              {linkText || 'View All'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
