import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import style from "./footer.module.css";

function Footer() {
  return (
    <div className={style.footer_container}>
        <div>
          <img src="/10001.png" alt="" />
          <br />
          <span>
            <FaFacebook />
            <FaInstagram />
            <FaYoutube />
          </span>
        </div>
        <div>
          <h2>Useful Link</h2>
          <ul>
            <li>
              <Link to="#">How It works</Link>
            </li>
            <li>
              <Link to="#">Terms of Service</Link>
            </li>
            <li>
              <Link to="#">Privacy Policy</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Contact Info</h2>
          <ul>
            <li>
              <Link to="#">Evangadi Networks</Link>
            </li>
            <li>
              <Link to="#">Support@evangadi.com</Link>
            </li>
            <li>
              <Link to="">+1-202-386-2702</Link>
            </li>
          </ul>
        </div>
      </div>
  );
}

export default Footer;
