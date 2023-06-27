import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeaderUser from "./headerUser";
import SettingUserComponent from "./settingUserComponent";
import ShowFileComponent from "./showFileComponent";
import AddFileComponent from "./addFileComponent";

const MainPageUser = () => {
  const [actualPage, setActualPage] = useState("");
  const navigate = useNavigate();

  const onClickNav = (data) => {
    console.log(data);
    if (data === "addFile") {
      setActualPage("addFile");
    } else if (data === "showFile") {
      setActualPage("showFile");
    } else if (data === "showSettings") {
      setActualPage("showSettings");
    }
  };

  const logoutHandler = () => {
    navigate("/logoutUser");
  };

  let pageComponent;

  if (actualPage === "addFile") {
    pageComponent = <AddFileComponent />;
  } else if (actualPage === "showFile") {
    pageComponent = <ShowFileComponent />;
  } else if (actualPage === "showSettings") {
    pageComponent = <SettingUserComponent />;
  }

  return (
    <div>
      <HeaderUser onClickNav={onClickNav} logoutHandler={logoutHandler} />
      <div>{pageComponent}</div>
    </div>
  );
};

export default MainPageUser;
