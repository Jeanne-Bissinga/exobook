import React from "react";
import { firebaseLogoutUser } from "../api/authentification";
import { useNavigate } from "react-router-dom";
import logoutIcon from "../assets/img/icon-logout.svg";

const Logout = () => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await firebaseLogoutUser();
      navigate("/login");
      console.log("déconnexion réussi");
    } catch {
      alert("Erreur...");
      console.log("erreur l'hors de la déconnexion");
    }
  };

  return (
    <li className="logout" onClick={logout}>
      <img src={logoutIcon} alt="icon-logout" />
      <span> Déconnexion</span>
    </li>
  );
};

export default Logout;
