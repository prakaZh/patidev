import React, { useState, useEffect, useCallback } from 'react';

const IMAGES = [
  {
    url: 'https://customer-assets.emergentagent.com/job_b648d6df-c28b-4b06-a864-99fa9be25b95/artifacts/2gvr1v9y_Gemini_Generated_Image_tkr1fwtkr1fwtkr1.png',
    alt: 'Character 1'
  },
  {
    url: 'https://customer-assets.emergentagent.com/job_b648d6df-c28b-4b06-a864-99fa9be25b95/artifacts/ckk51ppy_Gemini_Generated_Image_o42in0o42in0o42i%20-%20Edited.png',
    alt: 'Character 2'
  },
  {
    url: 'https://customer-assets.emergentagent.com/job_b648d6df-c28b-4b06-a864-99fa9be25b95/artifacts/jp71x3zv_Untitled%20design.png',
    alt: 'Character 3'
  },
  {
    url: 'https://customer-assets.emergentagent.com/job_b648d6df-c28b-4b06-a864-99fa9be25b95/artifacts/gvedcxfr_Eminem.webp',
    alt: 'Character 4'
  },
  {
    url: 'https://customer-assets.emergentagent.com/job_b648d6df-c28b-4b06-a864-99fa9be25b95/artifacts/dkuh8kpt_AB-WEEKND-COMP.webp',
    alt: 'Character 5'
  }
];

export const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
      setIsTransitioning(false);
    }, 500);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  const currentImage = IMAGES[currentIndex];

  return (
    <section className="carousel-section" data-testid="carousel-section">
      <div className="carousel-container">
        {/* Image with transparent background */}
        <div className="image-frame" data-testid="image-frame">
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className={`carousel-image ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            data-testid="carousel-image"
          />
        </div>
        
        {/* Carousel Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6" data-testid="carousel-dots">
          {IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
              data-testid={`carousel-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
