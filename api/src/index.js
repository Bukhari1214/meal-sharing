import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mealRouter from "./routers/mealRouterWeek01.js";
import meals from "./routers/mealsWeek2Week3.js";
import reservations from "./routers/reservationsWeek2.js";
import reviews from "./routers/reviewsWeek03.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

apiRouter.use("/meals-week-01", mealRouter);
apiRouter.use("/meals", meals);
apiRouter.use("/reservations", reservations);
apiRouter.use("/reviews", reviews);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});

// I moved all the routes for week01 homework to the mealRouterWeek01.js file
