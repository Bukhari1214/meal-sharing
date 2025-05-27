import express from "express";
import knex from "../database_client.js";

const reservations = express.Router();

// const routes = [
//   { route1: "/my-reservations" }, // This is the GET route to get all RESERVATIONS from the database
//   { route2: "/my-reservations" }, // This is the POST route to add new RESERVATION to the database
//   { route3: "/my-reservations/:id" }, // This is the GET route to get RESERVATION from the database using id
//   { route4: "/my-reservations/:id" }, // This is the PUT route to update RESERVATION in the database using id
//   { route5: "/my-reservations/:id" }, // This is the DELETE route to delete RESERVATION from the database using id
// ];

// // This is a base route to say Hello and show the routes available in the RESERVATION Table.
// reservations.get("/", (req, res) => {
//   res.json({
//     message:
//       "Hello! This is the MEAL SHARING APP, HOMEWORK NODEJS WEEK 02 Defining Routes on reservations Table",
//     Routes: routes,
//   });
// });

// This is the GET route (localhost:3005/api/reservations/my-reservations) to get all RESERVATIONS from the database.
reservations.get("/", async (req, res) => {
  try {
    const reservations = await knex("reservation")
      .select("*")
      .orderBy("id", "asc");
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching RESERVATIONS:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// This is the Post route (localhost:3005/api/reservations/my-reservations) to add new RESERVATION to the database.
reservations.post("/", async (req, res) => {
  try {
    const {
      meal_id,
      number_of_guests,
      created_date,
      contact_phonenumber,
      contact_name,
      contact_email,
    } = req.body;

    if (
      !meal_id ||
      !number_of_guests ||
      !created_date ||
      !contact_phonenumber ||
      !contact_name ||
      !contact_email
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (typeof meal_id !== "number" || typeof number_of_guests !== "number") {
      return res
        .status(400)
        .json({ error: "meal_id and number_of_guests must be numbers" });
    }

    const [newReservationId] = await knex("reservation").insert({
      meal_id,
      number_of_guests,
      created_date,
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

// Example of the body to be sent in the POST request to add new RESERVATION to the database
// {
//   "meal_id": 10,
//   "number_of_guests": 5,
//   "created_date": "2025-05-22 12:00:00",
//   "contact_phonenumber": "+1234567890",
//   "contact_name": "WASIM SHAH",
//   "contact_email": "wasim@example.com"
// }

// This is the GET route (localhost:3005/api/reservations/my-reservations/:id) to get RESERVATION from the database using id.
reservations.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await knex("reservation").where({ id }).first();
    if (!reservation) {
      return res.status(404).json({ error: "RESERVATION not found" });
    }
    res.json(reservation);
  } catch (error) {
    console.error("Error fetching RESERVATION:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// This is the PUT route (localhost:3005/api/reservations/my-reservations/:id) to update RESERVATION in the database using id.
reservations.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { meal_id, number_of_guests, created_date, contact_phonenumber } =
    req.body;

  try {
    const updatedReservation = await knex("reservation").where({ id }).update({
      meal_id,
      number_of_guests,
      created_date,
      contact_phonenumber,
    });

    if (!updatedReservation) {
      return res.status(404).json({ error: "RESERVATION not found" });
    }

    const updatedReservationDetails = await knex("reservation")
      .where({ id })
      .first();

    res.json({
      message: "RESERVATION updated successfully",
      "New Reservation Details": updatedReservationDetails,
    });
  } catch (error) {
    console.error("Error updating RESERVATION:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// This is the DELETE route (localhost:3005/api/reservations/my-reservations/:id) to delete RESERVATION from the database using id.
reservations.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const reservationToDelete = await knex("reservation").where({ id }).first();
    if (!reservationToDelete) {
      return res.status(404).json({ error: "RESERVATION not found" });
    }
    await knex("reservation").where({ id }).del();
    res.json({
      message: "RESERVATION deleted successfully",
      deletedReservationDetails: reservationToDelete,
    });
  } catch (error) {
    console.error("Error deleting RESERVATION:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default reservations;
