"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toggleRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 700);
      if (window.innerWidth > 700) setMenuOpen(false);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  const handleMouseEnter = () => {
    if (isMobile) setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) setMenuOpen(false);
  };

  const handleToggleClick = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <div className={styles["header-left"]}>
        <Link href="/" className={styles["header-logo"]}>
          <img
            src="/images/meal_sharing_app_logo.png"
            alt="Logo"
            className={styles["header-logo-img"]}
          />
        </Link>
      </div>

      <div className={styles["header-center"]}>
        <h1 className={styles["header-title"]}>Meal Sharing App</h1>
      </div>

      <div className={styles["header-right"]}>
        {isMobile ? (
          <div
            ref={containerRef}
            style={{ position: "relative" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={toggleRef}
              className={styles["header-nav-toggle"]}
              onClick={handleToggleClick}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>

            {menuOpen && (
              <ul
                className={`${styles["header-dropdown"]} ${styles["header-dropdown-list"]}`}
                ref={dropdownRef}
              >
                <li>
                  <Link href="/" onClick={handleLinkClick}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" onClick={handleLinkClick}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/meals" onClick={handleLinkClick}>
                    Meals
                  </Link>
                </li>
                {/* <li>
                  <Link href="/search" onClick={handleLinkClick}>
                    Search
                  </Link>
                </li> */}
                <li>
                  <Link href="/contact" onClick={handleLinkClick}>
                    Contact
                  </Link>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <ul className={styles["header-nav-list"]}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/meals">Meals</Link>
            </li>
            {/* <li>
              <Link href="/search">Search</Link>
            </li> */}
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
