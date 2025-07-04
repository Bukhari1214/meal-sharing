"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./Reviews.css";
import ReviewForm from "../ReviewForm/ReviewForm.jsx";

export default function Reviews({ meal, onClose }) {
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = () => {
    setLoading(true);
    fetch("http://localhost:3005/api/reviews")
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
          <ul className="reviews-list">
            {reviews.map((r, index) => (
              <li key={r.id} className="reviews-text">
                <strong>#{String(index + 1).padStart(2, "0")}</strong> —{" "}
                <strong>{r.stars}/5</strong> — <em>{r.title}</em>:{" "}
                {r.description}
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => setShowForm(true)} style={{ marginTop: "1rem" }}>
          Submit a Review
        </button>
        <button onClick={onClose} style={{ marginTop: "1rem" }}>
          Close
        </button>
        <button
          onClick={() => router.push("/meals")}
          style={{ marginTop: "1rem" }}
        >
          Back to Meals List
        </button>
      </div>
    </div>
  );
}
