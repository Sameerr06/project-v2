import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3 className="footerHeading">Contact Us</h3>
        <p className="footerText" href="https://www.jct.ac.in/" onClick={() => window.location.href = 'https://www.jct.ac.in/'}>https://www.jct.ac.in/</p>
        <p className="footerText" onClick={() => {}}>Phone: +91 9361488801</p>
      </div>
      <div>
        <h3 className="footerHeading">Follow us</h3>
        <div className="socialContainer">
          <a href="https://www.facebook.com/jctgroups/" aria-label="Facebook">facebook
          </a>
          <a href="https://www.instagram.com/jct_college/" aria-label="Instagram">instagram
          </a>
        </div>
      </div>
      <div>
        <h3 className="faqText">FAQ</h3>
      </div>
    </footer>
  );
}

export default Footer;