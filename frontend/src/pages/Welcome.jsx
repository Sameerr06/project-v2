import React from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import Footer from "./Footer";
import "./Welcome.css";

function Welcome() {
  return (
    <div className="pageContainer">
      <Header />
      <main>
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}

export default Welcome;