import React, { useState } from "react";
import { firebaseResetPassword } from "../api/authentification";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const resetPassword = async (email) => {
    try {
      await firebaseResetPassword(email);
      alert(`Un email à été envoyer à votre adresse ${email}`);
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.log(error);
        setErrors((prev) => ({
          ...prev,
          email: "L'utilisateur n'a pas été trouvé",
        }));
      } else if (error.code === "auth/invalid-email") {
        setErrors((prev) => ({
          ...prev,
          email: "Le format de l'email est invalide",
        }));
      }
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    await resetPassword(email);
    e.target.reset();
    
  };

  return (
    <div>
      <h1 className="logo-container">ExoBook</h1>
      <div className="form-group">
        <div className="form-container">
          <h1>Réinitialiser mon mot de passe</h1>

          <form onSubmit={handleForm}>
            <div className="email-container input-control">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" value={email}
                onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className="input-control">
              <input type="submit" value="Réinitialiser" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
