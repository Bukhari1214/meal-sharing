import Header from "@/components/Header/Header";
import "./globals.css";
import MainLayout from "@/components/Main/Main";
import Footer from "@/components/Footer/Footer";

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
