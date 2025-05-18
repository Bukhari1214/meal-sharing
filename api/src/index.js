import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});

// This is a simple example of how to use Knex.js with Express.js
app.get("/", (req, res) => {
  const routes = [
    { route: "/future-meals" },
    { route: "/past-meals" },
    { route: "/all-meals" },
    { route: "/first-meal" },
    { route: "/last-meal" },
  ];

  res.json({
    message: "Hello! This is the MEAL SHARING APP",
    routes: routes,
  });
});

// ROUTE TO GET FUTURE MEALS. USED KNEX QUERY BUILDER
app.get("/future-meals", async (req, res) => {
  try {
    const future_meals = await knex("meal")
      .where("when", ">", new Date())
      .orderBy("when", "asc");
    res.json(future_meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ROUTE TO GET PAST MEALS. USED KNEX QUERY BUILDER

app.get("/past-meals", async (req, res) => {
  try {
    const past_meals = await knex("meal")
      .where("when", "<", new Date())
      .orderBy("when", "asc");
    res.json(past_meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ROUTE TO GET ALL MEALS SORTED BY ID. USING RAW SQL
app.get("/all-meals", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM meal ORDER BY id ASC");
    const all_meals = Array.isArray(result[0]) ? result[0] : result.rows;
    res.json(all_meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ROUTE to GET FIRST MEAL IN DB. USING RAW SQL
app.get("/first-meal", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM meal ORDER BY id asc LIMIT 1");

    const first_meal = Array.isArray(result[0]) ? result[0] : result.rows; // handles MySQL and PostgreSQL
    res.json(first_meal);
  } catch (error) {
    console.error("Error executing raw SQL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ROUTE to GET LAST MEAL IN DB
app.get("/last-meal", async (req, res) => {
  try {
    const result = await knex.raw(
      "SELECT * FROM meal ORDER BY id desc LIMIT 1"
    );

    const last_meal = Array.isArray(result[0]) ? result[0] : result.rows; // handles MySQL and PostgreSQL
    res.json(last_meal);
  } catch (error) {
    console.error("Error executing raw SQL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
