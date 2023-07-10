import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeaderUser from "./headerUser";
import SettingUserComponent from "./settingUserComponent";
import ShowFileComponent from "./showFileComponent";
import AddFileComponent from "./addFileComponent";

import ShowReceiptCategory from "./fileCategory/showReceiptCategory";
import ShowDocumentCategory from "./fileCategory/showDocumentCategory";
import ShowBookCategory from "./fileCategory/showBookCategory";

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

  const setCategoryHandler = (props) => {
    setActualPage(props);
  };

  const setShowFileCategoryHandler = (props) => {
    setActualPage("showFile");
  };

  let pageComponent;

  if (actualPage === "addFile") {
    pageComponent = <AddFileComponent />;
  } else if (actualPage === "showFile") {
    pageComponent = <ShowFileComponent checkCategory={setCategoryHandler} />;
  } else if (actualPage === "showSettings") {
    pageComponent = <SettingUserComponent />;
  } else if (actualPage === "documentCategory") {
    pageComponent = (
      <ShowDocumentCategory setShowFileCategory={setShowFileCategoryHandler} />
    );
  } else if (actualPage === "receiptCategory") {
    pageComponent = (
      <ShowReceiptCategory setShowFileCategory={setShowFileCategoryHandler} />
    );
  } else if (actualPage === "bookCategory") {
    pageComponent = (
      <ShowBookCategory setShowFileCategory={setShowFileCategoryHandler} />
    );
  }

  return (
    <div>
      <HeaderUser onClickNav={onClickNav} logoutHandler={logoutHandler} />
      <div>{pageComponent}</div>
    </div>
  );
};

export default MainPageUser;
