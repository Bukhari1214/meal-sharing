import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-copyright">
        &copy; {new Date().getFullYear()} Meal Sharing. All rights reserved
        @HYF.
      </p>
      <div className="footer-contact">
        <a href="mailto:wasimhussain3@gmail.com" aria-label="Email">
          ✉️ Send Us Email
        </a>
        <a href="tel:+4553819612" aria-label="Phone">
          📞 Call For Info
        </a>
        <a
          href="https://www.facebook.com/itsWasimBukhari"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Our Facebook"
        >
          📘 Facebook
        </a>
        <a
          href="https://www.linkedin.com/in/sayyed-wasim-hussain-bukhari-041342299/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Our LinkedIn"
        >
          💼 LinkedIn
        </a>
        <a
          href="https://github.com/Bukhari1214"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Our GitHub"
        >
          🐙 GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
