"use client";

import React from "react";
import Link from "next/link";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <img
          src="/images/meal_sharing_app_logo.png"
          alt="Logo"
          className="header-logo-img"
        />
      </div>

      <h1 className="header-title">Meal Sharing App</h1>

      <div className="header-nav">
        <button
          className="header-nav-toggle"
          aria-haspopup="true"
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <nav className="header-dropdown">
          <ul className="header-dropdown-list">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/meals">All Meals</Link>
            </li>
            <li>
              <Link href="/search">Search</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
