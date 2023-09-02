import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth2 } from "./firebase";
import { firebaseRealtime } from "./firebase";

import { useNavigate } from "react-router-dom";

import styles from "./registerPage.module.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const [sendIsSuccess, setSendIsSuccess] = useState(false);
  const [statusBarIsActive, setStatusBarIsActive] = useState();

  // const [registerResult, setRegisterResult] = useState(null);

  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate("/login");
  };

  const showHiddenStatusBar = () => {
    setTimeout(() => {
      setStatusBarIsActive(true);
    }, 1000); // Po 3 sekundach zmień sendIsSuccess na true (symulacja sukcesu)
    setTimeout(() => {
      setStatusBarIsActive(false);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth2, email, password).then(
        (userData) => {
          const data = {
            userId: userData.user.uid,
            isAdmin: false,
            allocatedDiskSpace: 1024,
            diskSpaceUsed: 0,
            dataCategory: {
              documents: ["medyczne", "rachunki", "samochodowe"],
              receipt: ["rtv i agd", "spożywcze", "ubrania"],
            },
            email: email,
            isActive: true,
          };

          const userId = userData.user.uid; // pobranie identyfikatora zarejestrowanego uzytkownika
          const userRef = ref(firebaseRealtime, `/users/${userId}`); // pobranie referencji do ścieżki w firebase

          set(userRef, data)
            .then(() => {
              console.log("Dane zostały zapisane");
              setSendMessage("Użytkownik został porawnie zarejestrowany");
              setSendIsSuccess(true);
              showHiddenStatusBar();
            })
            .catch((err) => {
              console.log("błąd podczas zapisu danych");
            });
        }
      );
      setTimeout(() => {
        navigate("/login");
      }, 4000); // Odczekaj 4000ms (4 sekundy) przed nawigacją do "/login"

      console.log("Rejestracja powiodła się");

      // setRegisterResult("success");
    } catch (error) {
      setSendMessage("wystąpił błąd podczas rejestracji użytkownika");
      setSendIsSuccess(false);
      showHiddenStatusBar();
      console.log("Rejestracja nie powiodła się.", error);
      // setRegisterResult("failure");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <form className={styles.registerComponent} onSubmit={handleSubmit}>
        <p className={styles.inputText}> WPISZ LOGIN: </p>{" "}
        <input
          className={styles.inputLogin}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
        <p className={styles.inputText}> WPISZ HASŁO: </p>{" "}
        <input
          className={styles.inputLogin}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />{" "}
        <button className={styles.btnRegister} type="submit">
          Zarejestruj się{" "}
        </button>{" "}
      </form>{" "}
      <button onClick={goBackHandler} className={styles.btnRegister}>
        Wróć do logowania{" "}
      </button>{" "}
      <div
        className={`${styles.statusBar} ${
          sendIsSuccess ? styles.successStatusBar : styles.errorStatusBar
        } ${statusBarIsActive ? "" : styles.statusBarHidden}`}
      >
        {sendMessage}{" "}
      </div>{" "}
    </div>
  );
};

export default RegisterPage;
