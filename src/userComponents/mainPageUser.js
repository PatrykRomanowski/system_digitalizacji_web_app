import React, { useState } from "react";

import HeaderUser from "./headerUser";

// import styles from "./mainPageUser.module.css";

import SettingUserComponent from "./settingUserComponent";
import ShowFileComponent from "./showFileComponent";
import AddFileComponent from "./addFileComponent";

const MainPageUser = () => {
  const [actualPage, setActualPage] = useState();
  const onClickNav = (data) => {
    console.log(data);
    if (data === "addFile") {
      setActualPage(<AddFileComponent />);
    } else if (data === "showFile") {
      setActualPage(<ShowFileComponent />);
    } else {
      setActualPage(<SettingUserComponent />);
    }
  };

  return (
    <div>
      <HeaderUser onClickNav={onClickNav} />
      <div>{actualPage}</div>
    </div>
  );
};

export default MainPageUser;
