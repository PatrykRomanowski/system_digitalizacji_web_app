import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import HeaderAdmin from "./headerAdmin";
import { useNavigate } from "react-router-dom";

import ShowUser from "./showUser";
import DeleteUser from "./deleteUser";
import SettingAdmin from "./settingsForAdmin";

import { adminActions } from "../storage/admin-context";

import { firebaseRealtime } from "../firebase";
import { ref, get } from "firebase/database";

import styles from "./mainPageAdmin.module.css";

const MainPageAdmin = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actualRef = `/users/`;
        const realtimeDatabaseFolderRef = ref(firebaseRealtime, actualRef);

        const snapshot = await get(realtimeDatabaseFolderRef);
        const data = snapshot.val();

        console.log(data);

        for (const oneValue in data) {
          console.log(data[oneValue].diskSpaceUsed);
          dispatch(
            adminActions.addValue({
              xd: parseFloat(data[oneValue].diskSpaceUsed),
            })
          );
          dispatch(
            adminActions.addAllocatedSpace({
              allocatedSpace: parseFloat(data[oneValue].allocatedDiskSpace),
            })
          );
        }
      } catch {}
    };
    fetchData();
  }, []);

  const [actualPage, setActualPage] = useState();

  const navigate = useNavigate();

  const onClickNav = (data) => {
    console.log(data);
    if (data === "deleteUser") {
      setActualPage("deleteUser");
    } else if (data === "showUser") {
      setActualPage("showUser");
    } else if (data === "showSetting") {
      setActualPage("showSetting");
    }
  };

  const logoutHandler = () => {
    navigate("/logoutUser");
  };

  let pageComponent;

  if (actualPage === "showUser") {
    pageComponent = <ShowUser />;
  } else if (actualPage === "deleteUser") {
    pageComponent = <DeleteUser />;
  } else if (actualPage === "showSetting") {
    pageComponent = <SettingAdmin />;
  }

  return (
    <div>
      <HeaderAdmin onClickNav={onClickNav} logoutHandler={logoutHandler} />
      <div>{pageComponent}</div>
    </div>
  );
};

export default MainPageAdmin;
