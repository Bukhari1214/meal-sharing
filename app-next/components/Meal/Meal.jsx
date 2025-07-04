import React from "react";

const Meal = ({ meal }) => {
  return (
    <div className="meal-card">
      <h2 className="meal-title">{meal.title}</h2>
      <p className="meal-description">{meal.description}</p>
      <p className="meal-price">Price: ${meal.price}</p>
    </div>
  );
};

export default Meal;
