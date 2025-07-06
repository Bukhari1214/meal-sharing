import MealDetails from "@/components/MealDetailUsingId/MealDetailUsingId";

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals`);
  const meals = await res.json();

  return meals.map((meal) => ({
    id: meal.id.toString(),
  }));
}

export default async function MealPage({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/meals/${params.id}`
  );

  if (!res.ok) throw new Error("Failed to fetch meal");

  const meal = await res.json();

  return <MealDetails meal={meal} />;
}
