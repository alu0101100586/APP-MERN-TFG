import React from 'react';
import Slider from 'react-slick';
import { Image } from 'semantic-ui-react';
import { image } from '../../../assets';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.scss';

export function Carousel() {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed : 5000,
  };

  const slides = [
    {
      imageSlide: image.Musical_Studio,
      caption: 'Descubre nuevos artistas y sus trabajos',
    },
    {
      imageSlide: image.Pianist,
      caption: 'Apoya a sus campañas de crowdfunding',
    },
    {
      imageSlide: image.Guitarist,
      caption: 'si eres artistas, ¡comparte la tuya!',
    },
    // Agrega más slides según sea necesario
  ];

  return (
    <div className="carousel">
    <Slider {...settings}>
      {slides.map((slide, index) => (
        <div key={index}>
          <div className="image-container">
            <Image src={slide.imageSlide} />
            <p>{slide.caption}</p>
          </div>
        </div>
      ))}
    </Slider>
  </div>
  )
}
