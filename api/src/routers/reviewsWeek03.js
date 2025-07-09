import express from "express";
import knex from "../database_client.js";

const reviews = express.Router();

//ENDPOINT /api/reviews (GET)

reviews.get("/", async (req, res) => {
  try {
    const reviews = await knex("review").select("*").orderBy("id", "asc");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching Reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ENDPOINT /api/reviews/:meal_id/reviews

reviews.get("/:meal_id/reviews", async (req, res) => {
  const { meal_id } = req.params;

  if (!/^[1-9]\d*$/.test(meal_id)) {
    return res.status(400).json({ error: "Invalid meal ID" });
  }

  const mealId = parseInt(meal_id, 10);

  try {
    const meal = await knex("meal").where({ id: mealId }).first();
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    const reviews = await knex("review").where({ meal_id: mealId });
    if (reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this meal" });
    }
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ENDPOINT /api/reviews (POST)

reservations.post("/", async (req, res) => {
  try {
    let {
      meal_id,
      number_of_guests,
      contact_phonenumber,
      contact_name,
      contact_email,
    } = req.body;

    if (
      !meal_id ||
      !number_of_guests ||
      !contact_phonenumber ||
      !contact_name ||
      !contact_email
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    meal_id = Number(meal_id);
    number_of_guests = Number(number_of_guests);

    if (isNaN(meal_id) || isNaN(number_of_guests)) {
      return res.status(400).json({
        error: "meal_id and number_of_guests must be valid numbers",
      });
    }

    const [newReservationId] = await knex("reservation").insert({
      meal_id,
      number_of_guests,
      contact_phonenumber,
      contact_name,
      contact_email,
    });

    const newReservation = await knex("reservation")
      .where({ id: newReservationId })
      .first();

    res.status(201).json({
      message: "Record added successfully",
      reservation: newReservation,
    });
  } catch (error) {
    console.error("Error adding RESERVATION:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ENDPOINT /api/reviews/:id (GET)

reviews.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ error: "Invalid review ID" });
  }

  const reviewId = parseInt(id, 10);

  try {
    const review = await knex("review").where({ id: reviewId }).first();
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ENDPOINT /api/reviews/:id (PUT)

reviews.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, stars, meal_id } = req.body;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ error: "Invalid review ID" });
  }

  const reviewId = parseInt(id, 10);

  try {
    const review = await knex("review").where({ id: reviewId }).first();
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const updatedReview = await knex("review").where({ id: reviewId }).update({
      title,
      description,
      stars,
      meal_id,
    });

    console.log("Updated review:", updatedReview);

    if (updatedReview) {
      const newReview = await knex("review").where({ id: reviewId }).first();
      res.json({
        message: "Review updated successfully",
        updatedReview: newReview,
      });
    } else {
      res.status(400).json({ error: "Failed to update review" });
    }
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ENDPOINT /api/reviews/:id (DELETE)

reviews.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ error: "Invalid review ID" });
  }

  const reviewId = parseInt(id, 10);

  try {
    const review = await knex("review").where({ id: reviewId }).first();
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await knex("review").where({ id: reviewId }).del();
    res.json({ message: "Review deleted successfully", deletedReview: review });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default reviews;
