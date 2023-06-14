import { Buffer } from 'buffer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const sliderStyles = {
  position: "relative",
  height: "400px",
  margin: "0 auto",
  maxWidth: "900px",
};

const slideStyles = {
  width: "100%",
  height: "100%",
  borderRadius: "10px",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const arrowStyles = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "30px",
  color: "black",
  zIndex: 1,
  cursor: "pointer",
};

const rightArrowStyles = {
  ...arrowStyles,
  right: "10px",
  color: "gray", // Ajoutez cette ligne pour définir la couleur des flèches en gris
};

const leftArrowStyles = {
  ...arrowStyles,
  left: "10px",
  color: "gray", // Ajoutez cette ligne pour définir la couleur des flèches en gris
};

const dotsContainerStyles = {
  display: "flex",
  justifyContent: "center",
  marginTop: "10px",
  color: "gray", // Ajoutez cette ligne pour définir la couleur des flèches en gris

};

const dotStyle = {
  margin: "0 3px",
  cursor: "pointer",
  fontSize: "12px",
  color: "gray", // Ajoutez cette ligne pour définir la couleur des flèches en gris

};

const ImageSlider = ({ slides }) => {
  const [PremImage, setPremImage] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/getPremierImage/${slides}`)
      .then(res => setPremImage(res.data));
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? PremImage.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const goToNext = () => {
    const isLastSlide = currentIndex === PremImage.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  const imageData = PremImage[currentIndex]?.src?.data;
  const backgroundImage = imageData ? `url(data:image/png;base64,${Buffer.from(imageData).toString('base64')})` : '';

  const slideStylesWidthBackground = {
    ...slideStyles,
    backgroundImage,
    maxWidth: "100%",
    maxHeight: "100%",
  };

  return (
    <div style={sliderStyles}>
      <div>
        <div onClick={goToPrevious} style={leftArrowStyles}>
          ❰
        </div>
        <div onClick={goToNext} style={rightArrowStyles}>
          ❱
        </div>
      </div>
      <div style={slideStylesWidthBackground}></div>
      <div style={dotsContainerStyles}>
        {PremImage.map((slide, slideIndex) => (
          <div
            style={dotStyle}
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
          >
            ●
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
