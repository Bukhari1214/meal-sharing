import React from "react";

const Header = () => {
  return (
    <header
      style={{
        background:
          "conic-gradient(from 0deg, #3e3a4f 0% 33%, #5a4b81 33% 66%, #2d2a3e 66% 100%)",
        padding: "1rem",
      }}
    >
      <h1 style={{ color: "white", textAlign: "center" }}>
        Welcome to MY Meal Sharing App
      </h1>
    </header>
  );
};

export default Header;
