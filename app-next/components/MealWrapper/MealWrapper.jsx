"use client";

import MealDetails from "../MealDetailUsingId/MealDetailUsingId";
import "./MealWrapper.css";

export default function MealWrapper({ meal, onClose }) {
  if (!meal) return null;

  return (
    <div
      className="popup-overlay"
      onClick={onClose} // clicking on overlay closes popup
      role="dialog"
      aria-modal="true"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <MealDetails meal={meal} onClose={onClose} />
      </div>
    </div>
  );
}
