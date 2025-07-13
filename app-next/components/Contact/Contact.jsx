"use client";

import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <main className={styles["contact-container"]}>
      <section className={styles["contact-content"]}>
        <h1>Contact Us</h1>
        <p>
          We’d love to hear from you! Whether you have questions, feedback, or
          ideas to share — feel free to reach out. Your input helps us improve
          and serve the community better.
        </p>
        <p className={styles["contact-card"]}>
          <strong>📧 Email:</strong> mealsharing@app.com
          <br />
          <strong>📞 Phone:</strong> +45 12 34 56 78
          <br />
          <strong>📍 Address:</strong> Banefløjen 11, 2700 Brønshøj, Danmark
          <br />
          <strong>⏰ Availability:</strong> Monday to Friday, 9:00 AM – 5:00 PM
        </p>

        <p>
          You can also connect with us through our social media platforms to
          stay updated on new features and community meals.
        </p>
      </section>
    </main>
  );
}
