import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { listAll, ref, getDownloadURL } from "firebase/storage";

import { myStorage } from "../../firebase";

import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import styles from "./showGallery.module.css";

import { useSelector, useDispatch } from "react-redux";

const ShowGalleryBook = () => {
  const [imageList, setImageList] = useState([]);
  const [siteCounter, setSiteCounter] = useState(0);
  const [currentSite, setCurrentSite] = useState(0);
  const [allUrls, setAllUrls] = useState();
  const [nextPage, setNextPage] = useState(0);
  const [getActualPhotoIndexInArray, setGetActualPhotoIndexInArray] =
    useState(1);
  const [NumberOfSiteInGallery] = useState(1);
  const [prevIndex, setPrevIndex] = useState(null);

  const siteSelectedByUser = useSelector(
    (state) => state.userStatus.actualSite
  );

  const navigate = useNavigate();

  const backHandler = () => {
    navigate("/userPanel");
  };

  const activeGalleryRef = useSelector(
    (state) => state.userStatus.actualGalleryRef
  );

  const currentPageHandler = (currentIndex) => {
    setGetActualPhotoIndexInArray(currentIndex);
    console.log("current index: " + currentIndex);
    if (currentIndex === 0) {
      if (currentSite === 0) {
        setCurrentSite((prevSite) => prevSite + 1);
        setCurrentSite((prevSite) => prevSite - 1);
      } else {
        setCurrentSite((prevSite) => prevSite - 1);
        setNextPage(-1);
      }
    } else if (currentIndex === 2) {
      if (siteCounter <= currentSite) {
        setCurrentSite((prevSite) => prevSite);
      } else {
        setCurrentSite((prevSite) => prevSite + 1);
        setNextPage(1);
      }
    } else if (currentIndex === 1) {
      if (prevIndex === 2) {
        setCurrentSite((prevSite) => prevSite - 1);
        setNextPage(-1);
      } else {
        setCurrentSite((prevSite) => prevSite + 1);
        setNextPage(1);
      }
    }
    setPrevIndex(currentIndex);
  };

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const storageRef = ref(myStorage, activeGalleryRef);
        setCurrentSite(siteSelectedByUser);

        listAll(storageRef).then((res) => {
          const imageUrls = res.items.map((item) =>
            getDownloadURL(item).then((url) => ({
              original: url,
              thumbnail: url,
              originalClass: "showPhoto",
              thumbnailClass: "showPhoto-thumbnail",
            }))
          );

          const imageLength = imageUrls.length;
          setSiteCounter(imageLength);
          setAllUrls(imageUrls);
          console.log(allUrls);
          // console.log(imageLength);

          const actualPhotos = [];

          if (siteSelectedByUser !== 0) {
            actualPhotos.push(imageUrls[siteSelectedByUser - 1]);
            actualPhotos.push(imageUrls[siteSelectedByUser]);
            actualPhotos.push(imageUrls[siteSelectedByUser + 1]);
          } else {
            actualPhotos.push(imageUrls[siteSelectedByUser]);
            actualPhotos.push(imageUrls[siteSelectedByUser + 1]);
          }
          Promise.all(actualPhotos).then((urls) => setImageList(urls));
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchImg();
  }, []);

  useEffect(() => {
    console.log(currentSite);
    console.log("NextPage: " + nextPage);
    console.log("SiteCounter: " + siteCounter);

    const actualPhotos = [];
    if (nextPage === 1) {
      if (siteCounter > currentSite + 1) {
        actualPhotos.push(imageList[1]);
        actualPhotos.push(imageList[2]);
        actualPhotos.push(allUrls[currentSite + 1]);
        Promise.all(actualPhotos).then((urls) => setImageList(urls));
        setGetActualPhotoIndexInArray(1);
        console.log("!!!");
      } else {
        // actualPhotos.push(allUrls[currentSite - 2]);
        actualPhotos.push(imageList[1]);
        actualPhotos.push(imageList[2]);
        Promise.all(actualPhotos).then((urls) => setImageList(urls));
        setGetActualPhotoIndexInArray(1);
      }
    } else if (nextPage === -1) {
      if (currentSite !== 0) {
        actualPhotos.push(allUrls[currentSite - 1]);
        actualPhotos.push(imageList[0]);
        actualPhotos.push(imageList[1]);
        Promise.all(actualPhotos).then((urls) => setImageList(urls));
        setGetActualPhotoIndexInArray(1);
        console.log("xxx");
      } else {
        actualPhotos.push(imageList[0]);
        actualPhotos.push(imageList[1]);
        actualPhotos.push(imageList[2]);
        Promise.all(actualPhotos).then((urls) => setImageList(urls));
        setGetActualPhotoIndexInArray(0);
      }
    }
  }, [currentSite]);

  console.log(activeGalleryRef);
  return (
    <div className={styles.showPhotosContainer}>
      <button className={styles.showPhotoButton} onClick={backHandler}>
        POWRÓT
      </button>

      <div className="custom-image-gallery">
        <ImageGallery
          startIndex={getActualPhotoIndexInArray}
          showIndex={true}
          items={imageList}
          showThumbnails={true}
          showFullscreenButton={true}
          showPlayButton={true}
          showNav={true}
          slideInterval={2000}
          thumbnailPosition="bottom"
          onSlide={currentPageHandler}
          infinite={false}
        />
      </div>
    </div>
  );
};

export default ShowGalleryBook;
