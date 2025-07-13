"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./Reviews.css";
import ReviewForm from "../ReviewForm/ReviewForm.jsx";
import Stars from "../ReviewStars/ReviewStars";

export default function Reviews({ meal, onClose }) {
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reviews");
        return res.json();
      })
      .then((data) => {
        setReviews(data.filter((r) => r.meal_id === meal.id));
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [meal.id]);

  if (showForm)
    return (
      <ReviewForm
        meal={meal}
        onClose={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false);
          fetchReviews();
        }}
      />
    );

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="reviews-title">Reviews for {meal.title}</h3>
        {loading ? (
          <p className="reviews-text">Loading reviews...</p>
        ) : error ? (
          <p className="reviews-text">Error: {error}</p>
        ) : reviews.length === 0 ? (
          <p className="reviews-text">No reviews available yet.</p>
        ) : (
          <ol className="reviews-list">
            {reviews.map((r) => (
              <li key={r.id} className="reviews-text review-item">
                <div
                  className="review-header"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div className="review-rating">
                    <Stars count={r.stars} />
                  </div>
                  <div className="review-title">
                    <em className="glow-title">{r.title}</em>
                  </div>
                </div>
                <div className="review-description">
                  <p>{r.description}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        <div className="buttons-container">
          <div className="button-row">
            <button className="button" onClick={() => setShowForm(true)}>
              Submit a Review
            </button>
          </div>
          <div className="button-row">
            <button className="button" onClick={onClose}>
              Close
            </button>
            <button className="button" onClick={() => router.push("/meals")}>
              Back to Meals List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
