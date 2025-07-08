// app/layout.js
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MainLayout from "@/components/Main/Main";

export const metadata = {
  title: "Meal Sharing App",
  description: "Find, share, and enjoy delicious meals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dearmas&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="layout">
          <Header />
          <MainLayout>{children}</MainLayout>
          <Footer />
        </div>
      </body>
    </html>
  );
}
