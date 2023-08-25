import React from "react";

import { useSelector, useDispatch } from "react-redux";

import styles from "./settingForAdmin.module.css";

const SettingAdmin = () => {
  const allSpaceUsed = useSelector(
    (state) => state.adminStatus.allDiscSpaceUse
  );
  const allSpaceAllocated = useSelector(
    (state) => state.adminStatus.allAllocatedSpace
  );

  return (
    <div className={styles.settingUserContainer}>
      <div className={styles.settingUserDescription}>Dane w użyciu:</div>
      <div className={styles.setingUserDataValueText}>
        {allSpaceUsed.toFixed(2)} MB
      </div>
      <div className={styles.settingUserDescription}>Przydzielone dane</div>
      <div className={styles.setingUserDataValueText}>
        {allSpaceAllocated} MB
      </div>
    </div>
  );
};

export default SettingAdmin;
