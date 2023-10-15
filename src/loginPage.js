import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get, child } from "firebase/database";
import { useDispatch } from "react-redux";

import { auth2 } from "./firebase";
import { firebaseRealtime } from "./firebase";

import { userActions } from "./storage/user-context";
import { useNavigate } from "react-router-dom";

import styles from "./loginPage.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [loginResult, setLoginResult] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goBackHandler = () => {
    navigate("/");
  };

  const goToRegisterPageHandler = () => {
    navigate("/register");
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth2, email, password).then(
        (userInfo) => {
          const userId = userInfo.user.uid;
          console.log(userId);

          dispatch(userActions.login({ userEmail: email, userId: userId }));

          const userRef = ref(firebaseRealtime, `/users/${userId}`);

          get(child(userRef, "/isAdmin")).then((isAdmin) => {
            console.log(isAdmin.val());
            if (isAdmin.val() === true) {
              navigate("/adminPanel");
            } else {
              const allocatedDiscSpacePromise = get(
                //pobieranie informacji o wykorzystanych i przydzielonych danych
                child(userRef, "/allocatedDiskSpace")
              );
              const diskSpacesUsePromise = get(
                child(userRef, "/diskSpaceUsed")
              );
              const userIsActivePromise = get(child(userRef, "/isActive"));

              Promise.all([
                allocatedDiscSpacePromise,
                diskSpacesUsePromise,
                userIsActivePromise,
              ]).then((snapshots) => {
                dispatch(
                  userActions.addAdditionalInfoAboutUser({
                    allocatedDiskSpace: snapshots[0].val(),
                    discSpacesUse: snapshots[1].val(),
                    isActive: snapshots[2].val(),
                  })
                );
              });

              get(child(userRef, "/dataCategory")).then((snapshot) => {
                const dataArray = snapshot.val();
                console.log(dataArray);
                dispatch(
                  userActions.addDocCategories({ value: dataArray.documents })
                );
                dispatch(
                  userActions.addRecipesCategories({
                    value: dataArray.receipt,
                  })
                );
              });

              navigate("/userPanel");
            }
          });
        }
      );
    } catch {
      console.log("nie udało się zalogować!!!");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.formLogin} onSubmit={loginHandler}>
        <p className={styles.inputText}>WPISZ LOGIN:</p>
        <input
          className={styles.inputLogin}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="email-input"
        />
        <p className={styles.inputText}>WPISZ HASŁO:</p>
        <input
          className={styles.inputLogin}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="password-input"
        />
        <button className={styles.btnLogin} type="submit">
          Zaloguj
        </button>
      </form>
      <p className={styles.registerInfo}>
        Jeśli nie posiadasz konta
        <span
          className={styles.goToRegisterPage}
          onClick={goToRegisterPageHandler}
          data-testid="button-register"
        >
          Zarejestruj się
        </span>
      </p>
      <button
        onClick={goBackHandler}
        data-testid="button-back"
        className={styles.btnLogin}
      >
        Wróć do strony głównej
      </button>
    </div>
  );
};

export default LoginPage;
