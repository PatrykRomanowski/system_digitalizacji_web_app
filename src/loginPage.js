import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get, child } from "firebase/database";
import { auth2 } from "./firebase";
import { firebaseRealtime } from "./firebase";

import { useNavigate } from "react-router-dom";

import styles from "./loginPage.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [loginResult, setLoginResult] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate("/");
  };

  const goToRegisterPageHandler = () => {
    navigate("/register");
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth2, email, password).then(
        (userInfo) => {
          const userId = userInfo.user.uid;
          console.log(userId);

          const userRef = ref(firebaseRealtime, `/users/${userId}`);

          get(child(userRef, "/isAdmin")).then((isAdmin) => {
            console.log(isAdmin.val());
            if (isAdmin.val() === true) {
              navigate("/adminPanel");
            } else {
              navigate("/userPanel");
            }
          });
        }
      );
    } catch {
      console.log("nie udało się zalogować!!!");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.formLogin} onSubmit={loginHandler}>
        <p className={styles.inputText}>WPISZ LOGIN:</p>
        <input
          className={styles.inputLogin}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className={styles.inputText}>WPISZ HASŁO:</p>
        <input
          className={styles.inputLogin}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.btnLogin} type="submit">
          Zaloguj się
        </button>
      </form>
      <p className={styles.registerInfo}>
        Jeśli nie posiadasz konta
        <span
          className={styles.goToRegisterPage}
          onClick={goToRegisterPageHandler}
        >
          Zarejestruj się
        </span>
      </p>
      <button onClick={goBackHandler} className={styles.btnLogin}>
        Wróć do strony głównej
      </button>
    </div>
  );
};

export default LoginPage;
