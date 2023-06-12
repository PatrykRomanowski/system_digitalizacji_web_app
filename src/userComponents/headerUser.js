import React from "react";

import { useNavigate } from "react-router-dom";

import styles from "./headerUser.module.css";

const HeaderUser = ({ onClickInNav }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    navigate("/logoutUser");
  };

  const handleOnClickInNav = (data) => {
    console.log("Kliknięto:", data);

    if (onClickInNav) {
      console.log("XD");
      onClickInNav(data);
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerText}>User Panel</div>
      <div className={styles.navContainer}>
        <button
          onClick={() => handleOnClickInNav("addFile")}
          className={styles.navButton}
        >
          Dodaj pliki
        </button>
        <button
          onClick={() => handleOnClickInNav("showFile")}
          className={styles.navButton}
        >
          Przeglądaj pliki
        </button>
        <button
          onClick={() => handleOnClickInNav("showSettings")}
          className={styles.navButton}
        >
          Ustawienia
        </button>
      </div>
      <button onClick={logoutHandler} className={styles.logoutButton}>
        Wyloguj
      </button>
    </div>
  );
};

export default HeaderUser;
