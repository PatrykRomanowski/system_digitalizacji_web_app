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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToBookGallery = (props) => {
    navigate("/showGalleryBook");
    const actualRef = `/users/${userId}/books/${props}`;
    const actualCategory = "bookCategory";
    dispatch(navActions.setActualCategory({ actual: actualCategory }));
    dispatch(userActions.setActualGalleryRef({ xd: actualRef }));
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
        onClick={() => goToBookGallery(book.itemId)}
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
    </div>
  );
};

export default ShowBookCategory;
