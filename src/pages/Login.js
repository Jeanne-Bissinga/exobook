import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase-config";
import {firebaseLoginUser, firebaseLogoutUser} from "../api/authentification"

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const login = async () => {
    try {
      const result = await firebaseLoginUser(userData.email, userData.password);
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/invalid-credential") {
        setErrors((prev) => ({
          ...prev,
          password: "Les informations d'identification fournies sont invalides.",
        }));
      } else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setErrors((prev) => ({
          ...prev,
          password: "L'email ou le mot de passe est invalide",
        }));
      }
    }
  };
  

  const handleForm = async (e) => {
    e.preventDefault();
    await login();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };


  return (
    <div>
      <h1 className="logo-container">ExoBook</h1>
      <div className="form-group">
        <div className="form-container">
          <h1>Se connecter</h1>

          <form onSubmit={handleForm}>
            <div className="email-container input-control">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" name="email" value={userData.email} required onChange={handleChange}/>
            </div>

            <div className="password-container input-control">
              <label htmlFor="password">Mot de passe</label>
              <input type="password" id="password" name="password" value={userData.password} required onChange={handleChange}/>
              {errors.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>

            <div className="input-control">
              <input type="submit" value="Se connecter" />
            </div>

            <div className="member">
              <p>Vous n'avez pas de compte?</p>
              <NavLink to="/register">
                <p style={{ color: "black", textDecoration: "underline" }}>
                  S'inscrire
                </p>
              </NavLink>
            </div>

            <div className="reset-passWord">
              <p>Mot de passe oublié ?</p>
              <NavLink to="/resetpassword">
                <p style={{ color: "black", textDecoration: "underline" }}>
                  Réinitialiser le mot de passe
                </p>
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
