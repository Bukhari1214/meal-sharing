"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Meal from "../Meal/Meal";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("title");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/meals?sortkey=${sortKey}&sortdir=${sortDir}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const data = await response.json();
        setMeals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [sortKey, sortDir]);

  if (loading) return <p className="meals-message">Loading meals...</p>;

  if (error)
    return (
      <p className="meals-error">
        <strong>Error:</strong> {error}
        <br />
        Please check your network connection or API server.
      </p>
    );

  if (meals.length === 0) return <p className="meals-message">No meals to display.</p>;

  return (


<div className="meals-container">

      <div className="sort-controls">
        <label>
          Sort by:&nbsp;
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="dropdown"
          >
            <option value="when">Date</option>
            <option value="title">Title</option>
            <option value="max_reservations">Max Reservations</option>
            <option value="price">Price</option>
          </select>
        </label>

        <label>
          Direction:&nbsp;
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
            className="dropdown"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
      <h1 className="meals-heading">All Meals</h1>


      <div className="meals-grid">
        {meals.map((meal) => (
          <Link key={meal.id} href={`/meals/${meal.id}`}>
            <Meal meal={meal} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MealsList;
