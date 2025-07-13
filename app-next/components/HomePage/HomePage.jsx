import Link from "next/link";
import Meal from "../Meal/Meal";

export default function HomePage({ meals }) {
  return (
    <div className="meals-container">
      <h1 className="meals-heading">Welcome to My Meal Sharing App!</h1>
      <h2 className="meals-heading">Discover some delicious meals</h2>

      <p className="meals-intro">
        At our Meal Sharing App, we pride ourselves on delivering fresh,
        high-quality dishes crafted with passion and care. Every meal is
        prepared to ensure exceptional taste and satisfaction, making sure our
        customers enjoy every bite. Join us in celebrating good food and great
        company!
      </p>

      <div className="meals-grid">
        {meals.map((meal) => (
          <Meal key={meal.id} meal={meal} />
        ))}
      </div>

      <div className="button-container" style={{ marginTop: "20px" }}>
        <Link href="/meals">
          <button className="button">See All Meals</button>
        </Link>
      </div>
    </div>
  );
}
