import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import profile from "../assets/img/icon-profile.svg";
import home from "../assets/img/icon-home.svg";
import work from "../assets/img/icon-work.svg";
import meet from "../assets/img/icon-meet.svg";
import message from "../assets/img/icon-message.svg";
import Logout from "../pages/Logout";

const Navigation = () => {
  return (
    <div>
      <div className="navigation">
        <Logo />
        <ul>
          <NavLink
            to="/profile"
            className={(nav) => (nav.isActive ? "nav-active" : "")}
          >
            <li>
              <img src={profile} alt="icon-profile" />
              Profil
            </li>
          </NavLink>
          <NavLink to="/">
            <li>
              <img src={home} alt="icon-home" />
              Flux d'activité
            </li>
          </NavLink>
          <NavLink to="/meeting">
            <li>
              <img src={meet} alt="icon-meet" />
              Réunions
            </li>
          </NavLink>
          <NavLink to="/jobs">
            <li>
              <img src={work} alt="icon-work" />
              Conseils Emploi
            </li>
          </NavLink>
          <NavLink to="/messages">
            <li>
              <img src={message} alt="icon-message" />
              Messages
            </li>
          </NavLink>
          <NavLink>
              <Logout/>
          </NavLink>
        </ul>
        <div className="confidentiality">
          <NavLink to="/confidentiality">
            <p>Confidentialité</p>
          </NavLink>
          <NavLink to="/terms">
            <p>Conditions générales</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
