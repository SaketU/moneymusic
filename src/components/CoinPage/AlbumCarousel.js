import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const AlbumCarousel = ({ albums }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div style={{ marginTop: "2rem", padding: "0 1rem" }}>
      <h3 style={{ textAlign: "center", color: "var(--white)", marginBottom: "1rem" }}>
        Albums
      </h3>
      <Slider {...settings}>
        {albums.map((album, index) => (
          <div key={index} style={{ padding: "0 8px" }}>
            <img
              src={album.album_image}
              alt={album.name}
              style={{
                width: "100%",
                maxWidth: "200px",
                margin: "0 auto",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            />
            <p style={{ textAlign: "center", marginTop: "0.5rem", color: "var(--white)" }}>
              {album.name}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AlbumCarousel;
