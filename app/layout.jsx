import "@styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ExploreMe",
  description: "Search for your next destination!",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <link rel="icon" href="/assets/images/logo.svg" />
      <body>
        <div className="main">
          <div className="gradient" />
        </div>

        <main className="app">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
