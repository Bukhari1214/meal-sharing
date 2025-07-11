"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import "./MealDetailUsingId.css";
import Reviews from "../Reviews/Reviews";
import Reservations from "../Reservations/Reservations";
import Stars from "../ReviewStars/ReviewStars";

export default function MealDetails({ meal }) {
  const [showReviews, setShowReviews] = useState(false);
  const [showReservations, setShowReservations] = useState(false);
  const [averageStars, setAverageStars] = useState(0);
  const [loadingStars, setLoadingStars] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleBack = () => {
    router.push("/meals");
  };

  useEffect(() => {
    async function fetchReviewsAndCalculateAvg() {
      setLoadingStars(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`);
        if (!res.ok) throw new Error("Failed to fetch reviews");

        const allReviews = await res.json();
        const mealReviews = allReviews.filter((r) => r.meal_id === meal.id);

        if (mealReviews.length === 0) {
          setAverageStars(0);
        } else {
          const totalStars = mealReviews.reduce((sum, r) => sum + r.stars, 0);
          const avg = totalStars / mealReviews.length;
          setAverageStars(Math.round(avg));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingStars(false);
      }
    }

    fetchReviewsAndCalculateAvg();
  }, [meal.id]);

  return (
    <div className="meal-card-detail">
      <h2 className="meal-title">{meal.title}</h2>
      <p className="meal-description">{meal.description}</p>
      <p className="meal-price">Price: ${meal.price}</p>

      {loadingStars ? (
        <p>Loading rating...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error loading rating: {error}</p>
      ) : (
        <>
          <Stars count={averageStars} />
          <img
            src={`/images/${meal.id}.png`}
            alt={meal.title}
            className="meal-image"
          />
        </>
      )}

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
