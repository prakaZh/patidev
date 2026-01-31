import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer-section" data-testid="footer-section">
      {/* Signature */}
      <p className="footer-signature" data-testid="footer-signature">
        Created by Prakash
      </p>
      
      {/* Follow Text */}
      <p className="footer-text" data-testid="footer-text">
        If you like the experience, follow me on social media
      </p>
      
      {/* Social Links */}
      <div className="social-links" data-testid="social-links">
        <a 
          href="https://instagram.com/prakazhkumar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link"
          aria-label="Follow on Instagram"
          data-testid="instagram-link"
        >
          <Instagram size={28} />
        </a>
        <a 
          href="https://www.linkedin.com/in/prakash-kumar-prasad-a9467b95" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link"
          aria-label="Connect on LinkedIn"
          data-testid="linkedin-link"
        >
          <Linkedin size={28} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
