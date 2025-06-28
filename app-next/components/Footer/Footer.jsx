import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        background:
          "conic-gradient(from 0deg, #3e3a4f 0% 33%, #5a4b81 33% 66%, #2d2a3e 66% 100%)",
        padding: "1rem",
        color: "white",
        textAlign: "center",
      }}
    >
      <p>
        &copy; {new Date().getFullYear()} Meal Sharing. All rights reserved
        @HYF.
      </p>
    </footer>
  );
};

export default Footer;
