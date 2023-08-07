import React from "react";

import { useSelector } from "react-redux";

import styles from "./settingUserComponent.module.css";

const SettingUserComponent = () => {
  const useData = useSelector((state) => state.userStatus.discSpacesUse);
  const allcocatedData = useSelector(
    (state) => state.userStatus.allocatedDiscSpace
  );

  return (
    <div className={styles.settingUserContainer}>
      <div className={styles.settingUserDescription}>Aktualnie użyte dane:</div>
      <div className={styles.setingUserDataValueText}>
        {useData.toFixed(2)} MB
      </div>
      <div className={styles.settingUserDescription}>Przydzielone dane:</div>
      <div className={styles.setingUserDataValueText}>{allcocatedData} MB</div>
      <div className={styles.descriptionWithButton}>
        jeśli chcesz zwiększyć swoje dane
      </div>
      <div className={styles.button}>kliknij tutaj!</div>
    </div>
  );
};

export default SettingUserComponent;
