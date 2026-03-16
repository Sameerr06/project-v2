import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="headerContent">
        <div className="logoGroup">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/67c6115c241c209d7b06387f86f8e92ba55fdc9b"
            alt="College Logo"
            className="logo"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5c7a6da01525a739302af9dc78a7647e418853db"
            alt="Institution Logo"
            className="instituteLogo"
          />
          <p className="autonomousText">
            (JCTCET is An Autonomous Institution)
          </p>
        </div>

        <nav className="navigation">
          <a href="#home" className="navLink">
            Home
          </a>
          <a  className ="navLink" href="https://www.jct.ac.in/">
            College
          </a>
        </nav>

        <button className="mobileMenuButton" aria-label="Toggle menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 6l16 0"></path>
            <path d="M4 12l16 0"></path>
            <path d="M4 18l16 0"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;