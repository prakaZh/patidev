import React, { useState, useEffect, useCallback } from 'react';

const IMAGES = [
  { url: 'https://customer-assets.emergentagent.com/job_pati-devta-quiz/artifacts/mex16oxi_1.png', alt: 'Character 1' },
  { url: 'https://customer-assets.emergentagent.com/job_pati-devta-quiz/artifacts/rfju9oxc_2.png', alt: 'Character 2' },
  { url: 'https://customer-assets.emergentagent.com/job_pati-devta-quiz/artifacts/4bo03sxn_3.png', alt: 'Character 3' },
  { url: 'https://customer-assets.emergentagent.com/job_pati-devta-quiz/artifacts/pq243wb8_4.png', alt: 'Character 4' },
  { url: 'https://customer-assets.emergentagent.com/job_pati-devta-quiz/artifacts/dvna8za7_5.png', alt: 'Character 5' },
  { url: 'https://customer-assets.emergentagent.com/job_pati-devta-quiz/artifacts/zvchpria_6.png', alt: 'Character 6' },
  { url: 'https://customer-assets.emergentagent.com/job_pati-devta-quiz/artifacts/q2i9ncp0_7.png', alt: 'Character 7' },
  { url: 'https://customer-assets.emergentagent.com/job_pati-devta-quiz/artifacts/ro7n8mjv_8.png', alt: 'Character 8' },
  { url: 'https://customer-assets.emergentagent.com/job_pati-devta-quiz/artifacts/fcuish0b_9.png', alt: 'Character 9' },
  { url: 'https://customer-assets.emergentagent.com/job_pati-devta-quiz/artifacts/gdnm2cg4_10.png', alt: 'Character 10' }
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
            style={{ background: 'transparent' }}
            data-testid="carousel-image"
          />
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
