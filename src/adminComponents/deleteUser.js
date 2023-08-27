import React from "react";

import { auth2 } from "../firebase";

import { deleteUser } from "firebase/auth";

const DeleteUser = () => {
  const deleteUserHandler = async () => {
    const uid = "m1UGZi9xLIczZqD4vjpEsO5QkFs2";
    await deleteUser(auth2, uid)
      .then(() => {
        console.log("użytkownik został usunięty");
      })
      .catch((error) => {
        console.error("Błąd", error);
      });
  };

  return (
    <div>
      This is deleteUser!!!
      <button onClick={deleteUserHandler}>Delete User</button>
    </div>
  );
};

export default DeleteUser;
