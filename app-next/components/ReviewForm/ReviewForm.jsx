"use client";

import { useState, useEffect } from "react";

export default function ReviewForm({ meal, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(5);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString();
    setFormattedDate(formatted);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || !description || !stars) {
      setError("Please fill all fields.");
      return;
    }

    const reviewData = {
      meal_id: meal.id,
      title,
      description,
      stars: parseInt(stars),
      created_date: formattedDate,
    };

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit review");
      }

      setSuccess(
        <span style={{ color: "limegreen" }}>
          Review submitted successfully!
        </span>
      );

      setTitle("");
      setDescription("");
      setStars(5);

      const now = new Date();
      setFormattedDate(now.toISOString());

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="review-form-title">Submit Review for: {meal.title}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Review
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </label>
          <label>
            Rating (1–5 stars)
            <input
              type="number"
              min="1"
              max="5"
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
          <div className="buttons-container">
            <div className="button-row">
              <button className="button" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>
              <button
                className="button"
                type="button"
                onClick={onClose}
                style={{ marginLeft: "1rem" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
