import React, { useState } from "react";

import HeaderUser from "./headerUser";
import AddFileComponent from "./addFileComponent";
import ShowFileComponent from "./showFileComponent";
import ShowUserSettingsComponent from "./showUserSettingsComponent";

import styles from "./mainPageUser.module.css";

const MainPageUser = () => {
  const [actualPage, setActualPage] = useState("addFile");

  const onNavClick = (data) => {
    setActualPage(data);
  };

  let renderedComponent;

  if (actualPage === "showFile") {
    renderedComponent = <ShowFileComponent />;
  } else if (actualPage === "addFile") {
    renderedComponent = <AddFileComponent />;
  } else if (actualPage === "showSettings") {
    renderedComponent = <ShowUserSettingsComponent />;
  }

  return (
    <div>
      <HeaderUser onClickInNav={onNavClick} />
      {renderedComponent}
      <div></div>
    </div>
  );
};

export default MainPageUser;
