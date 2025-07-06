"use client";

import "./about.css";

export default function AboutPage() {
  return (
    <main className="about-container">
      <section className="about-content">
        <h1>About This Project</h1>
        <p>
          This Meal Sharing App is part of my assignment to practice and
          demonstrate my skills with Node.js and React/Next.js. While I’m still
          improving my graphic design abilities, I focus on learning and
          applying frontend programming concepts like React hooks — including{" "}
          <code>useState</code> and <code>useEffect</code> — to manage component
          state and side effects efficiently.
        </p>
        <p>
          I also implemented client-side and server-side routing using Next.js,
          which helped me understand how to build multi-page applications with
          smooth navigation and improved user experience.
        </p>
        <p>
          On the backend, I designed and built RESTful endpoints with Node.js to
          handle data operations, enabling smooth communication between frontend
          and backend. This project has helped me better understand how to
          integrate a full-stack application, from designing APIs to rendering
          dynamic content with Next.js.
        </p>
        <p>
          Overall, this app reflects my ongoing journey to create responsive,
          user-friendly interfaces while effectively managing backend services.
          I continue to learn and improve both my frontend and backend skills
          through hands-on development.
        </p>
        <p>
          I want to express my sincere thanks to my mentors and classmates for
          their support and guidance throughout this project. Special thanks to
          the HYF Team for their hard work in providing us with better learning
          opportunities.
        </p>
      </section>
    </main>
  );
}
