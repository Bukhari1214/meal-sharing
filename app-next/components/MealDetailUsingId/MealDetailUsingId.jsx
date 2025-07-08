"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import "./MealDetailUsingId.css";
import Reviews from "../Reviews/Reviews";
import Reservations from "../Reservations/Reservations";

export default function MealDetails({ meal }) {
  const [showReviews, setShowReviews] = useState(false);
  const [showReservations, setShowReservations] = useState(false);

  const router = useRouter();
 

  const handleBack = () => {
      router.push("/meals");
    
  };

  return (
    <div className="meal-card-detail">
      <h2 className="meal-title">{meal.title}</h2>
      <p className="meal-description">{meal.description}</p>
      <p className="meal-price">Price: ${meal.price}</p>

      <div className="buttons-container">
        <div className="button-row">
          <button
            className="button"
            onClick={() => setShowReviews(true)}
            type="button"
          >
            Reviews
          </button>
          <button
            className="button"
            onClick={() => setShowReservations(true)}
            type="button"
          >
            Reservations
          </button>
        </div>
        <div className="button-row">
          <button className="button" onClick={handleBack} type="button">
            ⏪ Return ⏩
          </button>
        </div>
      </div>

      {showReviews && (
        <Reviews meal={meal} onClose={() => setShowReviews(false)} />
      )}
      {showReservations && (
        <Reservations meal={meal} onClose={() => setShowReservations(false)} />
      )}
    </div>
  );
}
