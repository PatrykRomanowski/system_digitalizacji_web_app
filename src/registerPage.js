import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth2 } from "./firebase";

import { useNavigate } from "react-router-dom";

import "./registerPage.module.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerResult, setRegisterResult] = useState(null);

  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth2, email, password);
      console.log("Rejestracja powiodła się");
      setRegisterResult("success");
    } catch (error) {
      console.log("Rejestracja nie powiodła się.", error);
      setRegisterResult("failure");
    }
  };

  return (
    <div>
      <div>This is register Page!!!!</div>
      <form className="registerComponent" onSubmit={handleSubmit}>
        <p className="inputText">WPISZ LOGIN:</p>
        <input
          className="input-login"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="inputText">WPISZ HASŁO:</p>
        <input
          className="input-login"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-register" type="submit">
          Zarejestruj się
        </button>
      </form>
      <button onClick={goBackHandler}>Wróć do logowania</button>
    </div>
  );
};

export default RegisterPage;
