import React from "react";

import { useNavigate } from "react-router-dom";

import styles from "./headerUser.module.css";

const HeaderUser = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    navigate("/logoutUser");
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerText}>User Panel</div>
      <div className={styles.navContainer}>
        <button className={styles.navButton}>Dodaj pliki</button>
        <button className={styles.navButton}>Przeglądaj pliki</button>
        <button className={styles.navButton}>Ustawienia</button>
      </div>
      <button onClick={logoutHandler} className={styles.logoutButton}>
        Wyloguj
      </button>
    </div>
  );
};

export default HeaderUser;
