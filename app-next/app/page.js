import HomePage from "@/components/HomePage/HomePage";

function getRandomMeals(meals, count) {
  const shuffled = [...meals].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default async function Page() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch meals");

    const json = await res.json();
    const data = Array.isArray(json) ? json : json.meals || [];

    const randomMeals = getRandomMeals(data, 4);

    return <HomePage meals={randomMeals} />;
  } catch (error) {
    return (
      <div style={{ color: "red", padding: 20 }}>
        <p>Error loading meals: {error.message}</p>
      </div>
    );
  }
}
