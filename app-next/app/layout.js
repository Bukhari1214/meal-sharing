// app/layout.js or app/layout.tsx
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <Header />
          <main className="main-container">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
