// "use client";

// import { useState, useEffect } from "react";
// import "./Search.css";
// import MealWrapper from "../MealWrapper/MealWrapper";

// export default function Search() {
//   const [allMeals, setAllMeals] = useState([]);
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedMeal, setSelectedMeal] = useState(null);

//   useEffect(() => {
//     async function fetchMeals() {
//       try {
//         const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
//         const res = await fetch(`${apiUrl}/meals`);
//         if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//         const data = await res.json();
//         setAllMeals(data || []);
//       } catch (err) {
//         console.error("Failed to fetch meals:", err);
//         setAllMeals([]);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchMeals();
//   }, []);

//   useEffect(() => {
//     if (query.trim() === "") {
//       setResults([]);
//       return;
//     }
//     const filtered = allMeals.filter(
//       (meal) =>
//         meal.title && meal.title.toLowerCase().includes(query.toLowerCase())
//     );
//     setResults(filtered);
//   }, [query, allMeals]);

//   async function handleMealClick(meal) {
//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
//       const res = await fetch(`${apiUrl}/reservations?meal_id=${meal.id}`);
//       if (!res.ok) throw new Error("Failed to fetch reservations");

//       const reservations = await res.json();
//       const reservedCount = reservations.length || 0;
//       const remainingReservations =
//         (meal.max_reservations || 0) - reservedCount;

//       setSelectedMeal({ ...meal, remainingReservations });
//     } catch (err) {
//       console.error("Reservation fetch failed:", err);
//       setSelectedMeal({ ...meal, remainingReservations: 0 });
//     }
//   }

//   return (
//     <>
//       <main className="search-container">
//         <h1>Search Meals</h1>
//         {loading ? (
//           <p className="loading">Loading meals...</p>
//         ) : (
//           <>
//             <input
//               type="text"
//               placeholder="Type meal title..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               className="search-input"
//               autoFocus
//             />
//             {query && (
//               <div className="search-results">
//                 {results.length > 0 ? (
//                   results.map((meal) => (
//                     <p
//                       key={meal.id}
//                       className="search-item clickable"
//                       onClick={() => handleMealClick(meal)}
//                       tabIndex={0}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") handleMealClick(meal);
//                       }}
//                     >
//                       {meal.title}
//                     </p>
//                   ))
//                 ) : (
//                   <p className="no-results">No meals found.</p>
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </main>

//       <MealWrapper meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
//     </>
//   );
// }
