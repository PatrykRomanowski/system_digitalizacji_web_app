import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { firebaseRealtime } from "../../firebase";
import { myStorage } from "../../firebase";
import {
  listAll,
  ref as refStorage,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

import { ref, get } from "firebase/database";

import { navActions } from "../../storage/nav-context";
import { userActions } from "../../storage/user-context";

import styles from "./showBookCategory.module.css";

const ShowBookCategory = (props) => {
  const userId = useSelector((state) => state.userStatus.userId);

  const [allBooks, setAllBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalButtonDisabled, setModalButtonDisabled] = useState(true);
  const [pageSelectedByUser, setPageSelectedByUser] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showModalHandler = (props) => {
    setShowModal(true);
    const actualRef = `/users/${userId}/books/${props}`;
    const actualCategory = "bookCategory";
    dispatch(navActions.setActualCategory({ actual: actualCategory }));
    dispatch(userActions.setActualGalleryRef({ xd: actualRef }));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const goToBookGallery = () => {
    dispatch(
      userActions.setActualSiteOfBook({ actual: pageSelectedByUser - 1 })
    );
    navigate("/showGalleryBook");
  };

  const buttonDisabledHandler = (value) => {
    if (value) {
      setModalButtonDisabled(false);
    } else {
      setModalButtonDisabled(true);
    }
  };

  const pageSelectedByUserHandler = (event) => {
    const value = event.target.value;
    const numberValue = parseInt(value);

    setPageSelectedByUser(numberValue);
    buttonDisabledHandler(numberValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getBooksRef = ref(firebaseRealtime, `/users/${userId}/books`);
        const snapshot = await get(getBooksRef);
        const data = snapshot.val();

        // console.log(data);

        const books = [];

        for (const bookKey in data) {
          const book = data[bookKey];

          const getStorageRef = refStorage(
            myStorage,
            `/users/${userId}/books/${bookKey}`
          );

          const res = await listAll(getStorageRef);
          if (res.items.length > 0) {
            const firstFileRef = res.items[0];

            try {
              const url = await getDownloadURL(firstFileRef);

              books.push({
                itemId: bookKey,
                bookAuthor: book.author,
                bookTitle: book.title,
                bookDescription: book.description,
                bookSize: book.size,
                bookImage: url,
              });
            } catch (error) {
              console.log("Błąd podczas pobierania URL obrazka:", error);
            }
          } else {
            console.log("w folderze nie ma plików");
          }
        }

        setAllBooks(books);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [userId]);

  const showAllBooks = allBooks.map((book) => {
    return (
      <div
        onClick={() => showModalHandler(book.itemId)}
        // onClick={showModalHandler}
        className={styles.bookContainer}
        key={book.itemId}
      >
        <div className={styles.bookAuthor}>{book.bookAuthor}</div>
        <div className={styles.bookTitle}>{book.bookTitle}</div>

        <img
          className={styles.titleImage}
          src={book.bookImage}
          alt="Obrazek książki"
        />
      </div>
    );
  });

  const setShowFileCategory = () => {
    props.setShowFileCategory();
  };

  return (
    <div className={styles.bookCategoryContainer}>
      <div className={styles.allBooksContainer}>{showAllBooks}</div>
      <button className={styles.goBackButton} onClick={setShowFileCategory}>
        WRÓĆ DO WSZYSTKICH KATEGORII
      </button>
      {showModal ? (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <div className={styles.inputContainer}>
              <p className={styles.textInfo}>
                WYBIERZ STRONĘ OD KTÓREJ CHCESZ ZACZĄĆ
              </p>
              <input
                type="number"
                value={pageSelectedByUser}
                onChange={pageSelectedByUserHandler}
                className={styles.inputModal}
              ></input>
            </div>
            <button
              disabled={modalButtonDisabled}
              className={styles.modalButton}
              onClick={() => goToBookGallery()}
            >
              Wyświetl Książkę
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ShowBookCategory;
