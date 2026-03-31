import { useEffect, useState } from "react";
import { fetchHeroBanners } from "../services/heroService";

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const getBanners = async () => {
      try {
        const res = await fetchHeroBanners();
        setBanners(res.banners || []);
      } catch (err) {
        setBanners([]);
      }
    };
    getBanners();
  }, []);

  useEffect(() => {
    if (current >= banners.length) {
      setCurrent(0);
    }
  }, [current, banners.length]);

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % banners.length),
      3000,
    );
    return () => clearInterval(timer);
  }, [banners.length]);

  // Scroll to Bestseller section on click
  const handleBannerClick = () => {
    const el = document.getElementById("bestseller");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md cursor-pointer"
      onClick={handleBannerClick}
      title="See Bestsellers"
    >
      {/* 16:9 frame keeps stable responsive layout across breakpoints */}
      <div className="relative w-full aspect-[20/9] bg-[#F7F7F7]">
        {banners.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No banners
          </div>
        ) : (
          banners.map((banner, i) => (
            <img
              key={banner._id || i}
              src={banner.imageUrl || banner.url || banner.image}
              alt={`Offer ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
            />
          ))
        )}
      </div>

      {/* Center Slider Dots */}
      <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(i);
            }}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-primary scale-100 sm:scale-110"
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400/60 hover:bg-gray-400"
            }`}
            aria-label={`Go to banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
