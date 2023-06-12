import React from "react";

import { useNavigate } from "react-router-dom";

import styles from "./headerAdmin.module.css";

const HeaderUser = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    navigate("/logoutAdmin");
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerText}>Admin Panel</div>
      <div className={styles.navContainer}>
        <button className={styles.navButton}>Przeglądaj Użytkowników</button>
        <button className={styles.navButton}>Usuń Użytkowników</button>
        <button className={styles.navButton}>Ustawienia</button>
      </div>
      <button onClick={logoutHandler} className={styles.logoutButton}>
        Wyloguj
      </button>
    </div>
  );
};

export default HeaderUser;
