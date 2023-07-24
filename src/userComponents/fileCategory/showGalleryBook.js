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
  const [allSiteDownload, setAllSiteDownload] = useState(false);

  const navigate = useNavigate();

  const backHandler = () => {
    navigate("/userPanel");
  };

  const activeGalleryRef = useSelector(
    (state) => state.userStatus.actualGalleryRef
  );

  const sliderIndex = (currentIndex) => {
    if (currentSite < siteCounter - 2 && !allSiteDownload) {
      console.log(currentIndex);
      setCurrentSite(currentIndex);

      const nextPhotosUrl = [allUrls[currentSite + 2]];
      Promise.all(nextPhotosUrl).then((urls) => {
        console.log(urls);
        setImageList((prevImageList) => [...prevImageList, urls[0]]);
      });
      console.log(imageList);
    }

    if (currentSite === siteCounter) {
      setAllSiteDownload(true);
    }
  };

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const storageRef = ref(myStorage, activeGalleryRef);

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
          console.log(imageLength);

          const actualPhotos = [];
          actualPhotos.push(imageUrls[0]);
          actualPhotos.push(imageUrls[1]);

          Promise.all(actualPhotos).then((urls) => setImageList(urls));
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchImg();
  }, []);

  console.log(activeGalleryRef);
  return (
    <div className={styles.showPhotosContainer}>
      <button className={styles.showPhotoButton} onClick={backHandler}>
        POWRÓT
      </button>
      <div className="custom-image-gallery">
        <ImageGallery
          startIndex={currentSite}
          showIndex={true}
          items={imageList}
          showThumbnails={true}
          showFullscreenButton={true}
          showPlayButton={true}
          showNav={true}
          slideInterval={2000}
          thumbnailPosition="bottom"
          onSlide={sliderIndex}
        />
      </div>
    </div>
  );
};

export default ShowGalleryBook;
