import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { myStorage } from "../../firebase";
import { firebaseRealtime } from "../../firebase";
import { ref, get, child } from "firebase/database";

import styles from "./showDocumentCategory.module.css";

const ShowDocumentCategory = (props) => {
  const userId = useSelector((state) => state.userStatus.userId);

  const [allCategory, setAllCategory] = useState([]);
  const [allItem, setAllItem] = useState([{}]);
  const [sortDescriptionValue, setSortDescriptionValue] = useState("");
  const [sortItem, setSortItem] = useState([{}]);
  const [searchCategoryInput, setSearchCategoryInput] = useState();

  const setShowFileCategory = () => {
    props.setShowFileCategory();
  };

  const handleSort = () => {
    const sortedItems = allItem.filter((item) => {
      if (item.itemDescription) {
        return item.itemDescription
          .toLowerCase()
          .includes(sortDescriptionValue.toLowerCase());
      }
      return false;
    });

    const additionalSorted = sortedItems.filter((item) => {
      if (searchCategoryInput) {
        if (item.itemKategory === searchCategoryInput) {
          return item;
        }
        return false;
      }
      return item;
    });

    setSortItem(additionalSorted);
  };

  const sortDescriptionValueHandler = (event) => {
    setSortDescriptionValue(event.target.value);
  };

  const searchCategoryOption = (event) => {
    setSearchCategoryInput(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCategoryRef = ref(
          firebaseRealtime,
          `/users/${userId}/document`
        );
        const snapshot = await get(getCategoryRef);
        const data = snapshot.val();

        const categories = []; // zmienna pomocnicza do zapisania kategorii
        const items = [];

        for (const categoryKey in data) {
          const category = data[categoryKey];
          categories.push(categoryKey);

          for (const itemKey in category) {
            const item = category[itemKey];
            items.push({
              itemId: itemKey,
              itemDescription: item.description,
              itemSize: item.size[0],
              itemKategory: categoryKey,
            });
            console.log(items);
          }
        }
        setAllCategory(categories);
        setAllItem(items);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    console.log(allItem);
    console.log(allCategory);
  }, []);

  useEffect(() => {
    handleSort();
  }, [sortDescriptionValue, searchCategoryInput]);

  const categoryItem = allCategory.map((item) => {
    return <option value={item}>{item}</option>;
  });

  const showAllItem = allItem.map((item) => {
    return (
      <div className={styles.itemContainer}>
        <div style={{ flex: "6" }}>
          <p>Opis</p>
          <div className={styles.itemDescription}>{item.itemDescription}</div>
        </div>
        <div style={{ flex: "1" }}>
          <p>kategoria</p>
          <div className={styles.itemCategory}>{item.itemKategory}</div>
        </div>
        <div style={{ flex: "1" }}>
          <p>rozmiar</p>
          <div className={styles.itemSize}>
            {typeof item.itemSize === "number"
              ? `${item.itemSize.toFixed(3)} MB`
              : ""}
          </div>
        </div>
      </div>
    );
  });

  const showSortAllItem = sortItem.map((item) => {
    //posortowane dane
    return (
      <div className={styles.itemContainer}>
        <div style={{ flex: "6" }}>
          <p>Opis</p>
          <div className={styles.itemDescription}>{item.itemDescription}</div>
        </div>
        <div style={{ flex: "1" }}>
          <p>kategoria</p>
          <div className={styles.itemCategory}>{item.itemKategory}</div>
        </div>
        <div style={{ flex: "1" }}>
          <p>rozmiar</p>
          <div className={styles.itemSize}>
            {typeof item.itemSize === "number"
              ? `${item.itemSize.toFixed(3)} MB`
              : ""}
          </div>
        </div>
      </div>
    );
  });

  console.log(showAllItem);

  return (
    <div className={styles.documentCategoryContainer}>
      <div className={styles.inputContainer}>
        <div>
          <p>Wybierz kategorię</p>
          <select
            className="inputStyle"
            value={searchCategoryInput}
            onChange={searchCategoryOption}
          >
            <option value="">Wybierz...</option>
            {categoryItem}
          </select>
        </div>
        <div>
          <p>Wyszukaj po opisie</p>
          <input
            type="text"
            value={sortDescriptionValue}
            onChange={sortDescriptionValueHandler}
            className={styles.inputModal}
          />
        </div>
      </div>

      <div className={styles.yourDocumentsText}>TWOJE DOKUMENTY</div>
      <div className={styles.itemsContainer}>
        {sortDescriptionValue || searchCategoryInput
          ? showSortAllItem
          : showAllItem}
      </div>
      {/* <div className={styles.itemsContainer}></div> */}

      <button className={styles.goBackButton} onClick={setShowFileCategory}>
        WRÓĆ DO WSZYSTKICH KATEGORII
      </button>
    </div>
  );
};

export default ShowDocumentCategory;
