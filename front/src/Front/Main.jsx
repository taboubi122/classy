
import React, { useRef,useState, useEffect } from 'react';
import 'react-slideshow-image/dist/styles.css'

const slideImages = [
  {
    url:
      "https://img.freepik.com/photos-gratuite/salon-coiffure-feminine-faisant-coiffure-pour-femme-blonde-dans-salon-beaute_176420-4458.jpg?size=626&ext=jpg&ga=GA1.2.387282990.1668097406",
    caption: "Slide 1",
  },
  {
    url:
      "https://img.freepik.com/photos-premium/femmes-tenant-pinceaux-maquillage_23-2148332535.jpg?w=900",
    caption: "Slide 2",
  },
  {
    url:
      "https://img.freepik.com/photos-gratuite/femme-coupe-cheveux-homme-au-salon_23-2147737062.jpg?size=626&ext=jpg&ga=GA1.2.387282990.1668097406",
    caption: "Slide 3",
  },
  {
    url:
      "https://img.freepik.com/photos-gratuite/concept-entreprise-vue-cote-fond-sombre-bois-mains-organisant-cube-bois-comme-pile_176474-8919.jpg?size=338&ext=jpg",
    caption: "Slide 4",
  },
];
const text = [
  {
    caption: "Slide 1",
    titre: "Coiffure",
    descrip: "Envie de changer de tête ou simplement de rafraîchir votre coupe ? Vous avez besoin des conseils d'un expert pour sublimer votre style.",
  },
  {
    caption: "Slide 2",
    titre: "Institut de beauté",
    descrip: "Vos envies de bien-être ont besoin d'être assouvies rapidement et  surement.",
  },
  {
    caption: "Slide 3",
    titre: "Barbier",
    descrip: "Vous rêvez d’une barbe bien dessinée,que l’on chouchoute votre visage et que l’on dompte votre moustache.",
  },
  {
    caption: "Slide 4",
    titre: "Manicure",
    descrip: "On raconte que les mains sont le reflet de la façon dont on prend soin de soi.",
  },
];
const colors = [
 "black",
 "black",
 "black",
 "black",
];
const delay = 3000
const Main = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === colors.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );
    return () => {
      resetTimeout();
    };
  }, [index]);

  const handleSlideClick = (idx) => {
    setIndex(idx);
  };

  return (
    <section className="main">
      <div className="container">
        <h2>Découvrez nos Professionnels</h2>
        <div className="cont">
          <div className="slideshow">
            <div
              className="slideshowSlider"
              style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
            >
              {slideImages.map((slideImage, idx) => (
                <div
                  key={idx}
                  className="slide"
                  style={{ backgroundImage: `url(${slideImage.url})` }}
                  onClick={() => handleSlideClick(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSlideClick(idx);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                />
              ))}
            </div>
          </div>
          <div className="slideshow">
            <div className="slideshowSlider" style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
            >
                {slideImages.map((slideImage, idx) => (
                <div className="slide" key={idx}>
                  <div className="image" style={{ backgroundImage: `url(${slideImage.url})` }} />
                  <div className="description">
                    <h3>{text[idx].titre}</h3>
                    <p  className="h3">{text[idx].descrip}</p>
                
                </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="slideshowDots">
          {colors.map((_, idx) => (
            <div
              key={idx}
              className={`slideshowDot${index === idx ? " active" : ""}`}
              role="button"
              onClick={() => handleSlideClick(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSlideClick(idx);
                }
              }}
              tabIndex={0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Main;
