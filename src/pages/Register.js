import React, { useRef, useState } from "react";
import Select from "react-select";
import { NavLink, useNavigate } from "react-router-dom";
import { firebaseCreateUser } from "../api/authentification";
import chevronRightBlack from "../assets/img/chevron_right_black.svg";

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    lastName: "",
    firstName: "",
    password: "",
    confirmPassword: "",
    terms: false,
    notifications: false,
    program: [],
    yearOfStudy: [],
    currentCourse: [],
    previousCourse: [],
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const selectOptions = {
    program: [
      { value: "program1", label: "Choix1" },
      { value: "program2", label: "Choix2" },
      { value: "program3", label: "Choix3" },
      { value: "program4", label: "Choix4" },
    ],
    yearOfStudy: [
      { value: "program1", label: "Choix1" },
      { value: "program2", label: "Choix2" },
      { value: "program3", label: "Choix3" },
      { value: "program4", label: "Choix4" },
    ],
    currentCourse: [
      { value: "program1", label: "Choix1" },
      { value: "program2", label: "Choix2" },
      { value: "program3", label: "Choix3" },
      { value: "program4", label: "Choix4" },
    ],
    previousCourse: [
      { value: "program1", label: "Choix1" },
      { value: "program2", label: "Choix2" },
      { value: "program3", label: "Choix3" },
      { value: "program4", label: "Choix4" },
    ],
  };

  const handleSelectChange = (name, selectedOptions) => {
    // Gère les cas où selectedOptions est null ou n'est pas un tableau
    const values = Array.isArray(selectedOptions)
      ? selectedOptions.map((item) => item.value)
      : selectedOptions
      ? [selectedOptions.value]
      : [];

    setUserData((prev) => ({
      ...prev,
      [name]: values,
    }));

    // La logique de validation
    if (name === "program" || name === "yearOfStudy") {
      if (values.length === 0) {
        // Vérifie si le tableau est vide
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Vous devez faire une sélection.",
        }));
      } else {
        // Supprime le message d'erreur si une sélection est faite
        const { [name]: _, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Validation basique pour chaque champ concerné
    if (name === "email") emailChecker(value);
    if (name === "password") passwordChecker(value);
    if (name === "confirmPassword") {
      confirmPasswordChecker(userData.password, value);
    }
    // Validation spécifique pour "terms"
    if (name === "terms") {
      if (!checked) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          terms: "Vous devez accepter les termes et conditions d'utilisation.",
        }));
      } else {
        // On supprimele message d'erreur si terms est coché
        const { terms, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }
  };

  const emailChecker = (email) => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        email: "Le format de l'email est invalide",
      }));
    } else {
      // Réinitialiser l'erreur si l'email est valide
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  };

  const passwordChecker = (password) => {
    if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Le mot de passe doit contenir 8 caractères minimum",
      }));
      return;
    } else {
      // Réinitialiser l'erreur si le mot de passe est valide
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const confirmPasswordChecker = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Les mots de passe ne correspondent pas",
      }));
    } else {
      // Réinitialiser l'erreur si les mots de passe correspondent
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  };

  const validateStep = (currentStep) => {
    let isValid = true;
    let newErrors = {};

    // Validation de l'étape 1
    if (currentStep === 1) {
      if (!userData.email) {
        newErrors.email = "L'email est requis";
        isValid = false;
      }
      if (!userData.firstName) {
        newErrors.firstName = "Veillez renseigner votre prénom";
        isValid = false;
      }
      if (!userData.lastName) {
        newErrors.lastName = "Veillez renseigner votre Nom";
        isValid = false;
      }
      if (!userData.password) {
        newErrors.password = "Veiller renseigne un mot de passe";
        isValid = false;
      }
      if (!userData.confirmPassword) {
        newErrors.confirmPassword = "Confirmer votre mot de passe";
        isValid = false;
      }
      if (!userData.terms) {
        newErrors.terms =
          "Veillez acceptez les conditions générales d'utilisations";
        isValid = false;
      }
    }

    // Validation de l'étape 2
    if (currentStep === 2) {
      if (!userData.program) {
        newErrors.program = "Veillez renseigner votre programme";
        isValid = false;
      }
      if (!userData.yearOfStudy) {
        newErrors.yearOfStudy = "Veillez renseigner votre année d'étude";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setErrors({}); // Réinitialiser les erreurs
    }
  };

  const register = async () => {
    const result = await firebaseCreateUser(
      userData.email,
      userData.password
    )

    try {
      if (result.user) {
        navigate("/login");
      }
    } catch (err) {
      if (result.error.code === "auth/email-already-in-use") {
        setErrors((prev) => ({ ...prev, email: "L'utilisateur existe déjà" }));
      } else if (result.error.code === "auth/invalid-email") {
        setErrors((prev) => ({
          ...prev,
          email: "Le format de l'email est invalide",
        }));
      }
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    
    // Avant d'appeler register, on vérifi que tous les champs à travers toutes les étapes sont corrects
    if (validateStep(step)) {
      // Tente d'enregistrer l'utilisateur
      await register();
      // Réinitialise les champs du formulaire après la soumission réussie
    setUserData((prevUserData) => ({
      ...prevUserData,
      program: [],
      yearOfStudy: [],
      currentCourse: [],
      previousCourse: [],
    }));
      setErrors({});
    }
  };

  return (
    <div>
      <h1 className="logo-container">ExoBook</h1>
      {/* Rendu conditionnel : étape 1 du formulaire */}
      {step === 1 && (
        <div className="form-group">
          <div className="form-container">
            <h1>S'inscrire</h1>
            <form >
              <div className="email-container input-control">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={userData.email}
                  required
                  onChange={handleInputChange}
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>

              <div className="lastName-container input-control">
                <label htmlFor="lastName">Nom</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userData.lastName}
                  required
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <div className="error">{errors.lastName}</div>
                )}
              </div>

              <div className="firstName-container input-control">
                <label htmlFor="firstName">Prénom</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userData.firstName}
                  required
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <div className="error">{errors.firstName}</div>
                )}
              </div>

              <div className="password-container input-control">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={userData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <div className="error">{errors.password}</div>
                )}
              </div>

              <div className="confirmPassword-container input-control">
                <label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  required
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <div className="error">{errors.confirmPassword}</div>
                )}
              </div>

              <div className="checkBox-container">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={userData.terms}
                  required
                  onChange={handleInputChange}
                />
                <label htmlFor="terms">
                  En créant un compte, j'accepte la politique de confidentialité
                  et les conditions d'utilisation de ce site web.
                </label>
              </div>
              {errors.terms && <div className="error">{errors.terms}</div>}

              <div className="checkBox-container">
                <input
                  type="checkbox"
                  id="notifications"
                  name="notifications"
                  checked={userData.notifications}
                  onChange={handleInputChange}
                />
                <label htmlFor="notifications">
                  Je suis d'accord pour recevoir des notifications dans ma boîte
                  mail.
                </label>
              </div>

              <div className="input-control">
                <input
                  type="button"
                  value="Suivant"
                  className="next"
                  onClick={handleNextStep}
                />
              </div>

              <div className="member">
                <p>Déjà membre d'ExoBook?</p>
                <NavLink to="/login">
                  <p style={{ color: "black", textDecoration: "underline" }}>
                    Se connecter
                  </p>
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rendu conditionnel : étape 2 du formulaire */}
      {step === 2 && (
        <div className="form-group">
          <div className="form-container">
            <div className="prev-step">
              <img
                src={chevronRightBlack}
                className="chevron-right-black"
                alt="chevron"
                onClick={() => setStep(1)}
                style={{ cursor: "pointer" }}
              />
              <h1>S'inscrire</h1>
            </div>
            <form onSubmit={handleForm}>
              <div className="program-container input-control">
                <label htmlFor="program">Programme</label>
                <Select
                  options={selectOptions.program}
                  isMulti
                  name="program"
                  className="basic-multi-select"
                  placeholder="Choisir mon programme"
                  onChange={(value) => handleSelectChange("program", value)}
                />
                {errors.program && (
                  <div className="error">{errors.program}</div>
                )}
              </div>

              <div className="yearOfStudy-container input-control">
                <label htmlFor="yearOfStudy">Année d'étude</label>
                <Select
                  options={selectOptions.yearOfStudy}
                  name="yearOfStudy"
                  className="basic-multi-select"
                  placeholder="Choisir mon année d'étude"
                  onChange={(value) => handleSelectChange("yearOfStudy", value)}
                />
                {errors.yearOfStudy && (
                  <div className="error">{errors.yearOfStudy}</div>
                )}
              </div>

              <div className="currentCourse-container input-control">
                <label htmlFor="currentCourse">Cours suivis</label>
                <Select
                  options={selectOptions.currentCourse}
                  isMulti
                  name="currentCourse"
                  className="basic-multi-select"
                  placeholder="Choisir mes cours actuels"
                  onChange={(selectedOptions) =>
                    handleSelectChange("currentCourse", selectedOptions)
                  }
                />
              </div>

              <div className="previousCourse-container input-control">
                <label htmlFor="previousCourse">
                  Cours de l'année précédente
                </label>
                <Select
                  options={selectOptions.previousCourse}
                  isMulti
                  name="previousCourse"
                  className="basic-multi-select"
                  placeholder="Choisir mes cours de l'année précédente"
                  onChange={(selectedOptions) =>
                    handleSelectChange("previousCourse", selectedOptions)
                  }
                />
              </div>

              <div className="input-control">
                <input
                  type="submit"
                  value="S'inscrire"
                  className="submit-btn"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
