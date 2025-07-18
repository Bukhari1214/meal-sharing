import React from "react";

export default function Stars({ count }) {
  const maxStars = 5;
  const fullStar = "★";
  const emptyStar = "☆";

  return (
    <span className="stars" aria-label={`${count} out of 5 stars`} role="img">
      {[...Array(maxStars)].map((_, i) => (i < count ? fullStar : emptyStar))}
    </span>
  );
}
