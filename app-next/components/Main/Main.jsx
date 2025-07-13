"use client"; // if you need client-side functionality

import React from "react";

export default function MainLayout({ children }) {
  return <main className="main-container">{children}</main>;
}
