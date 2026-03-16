import React from "react";
import "./HeroSection.css";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="heroSection">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/f796661729b42697c9e759ec475854fd7cf8aa41"
        alt="Quiz Background"
        className="backgroundImage"
      />
      <div className="heroContent">
        <h1 className="welcomeTitle">Welcome</h1>
        <p className="welcomeText">
          Dive into the world of knowledge with our exciting quiz. Engage your
          brain with our test, your skills and learn something new everyday!
        </p>
        <Link to="/student-entry">
          <button className="startbutton">Start Quiz</button>
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;