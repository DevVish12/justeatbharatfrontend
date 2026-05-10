import { useEffect, useState } from "react";

const STATIC_BANNERS = [
  {
    _id: "banner-1",
    imageUrl: "./imgi_2_hero-banner-1-i3JAIU9E.jpg",
  },
  {
    _id: "banner-2",
    imageUrl: "./imgi_3_hero-banner-2-Dlq_BaZu.jpg",
  },
  {
    _id: "banner-3",
    imageUrl: "./imgi_4_hero-banner-3-BvIF6OSO.jpg",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    setBanners(STATIC_BANNERS);
  }, []);

  useEffect(() => {
    if (current >= banners.length) {
      setCurrent(0);
    }
  }, [current, banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const handleBannerClick = () => {
    const el = document.getElementById("bestseller");

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      onClick={handleBannerClick}
      title="See Bestsellers"
      className="
        relative
        w-full
        min-w-0

        aspect-[3/2]

        overflow-hidden
        rounded-xl
        sm:rounded-2xl

        border
        border-gray-200/70

        shadow-[0_4px_20px_rgba(0,0,0,0.15)]

        bg-white
        cursor-pointer
      "
    >
      {/* No Banner */}
      {banners.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
          No banners available
        </div>
      ) : (
        banners.map((banner, i) => (
          <img
            key={banner?._id || i}
            src={banner?.imageUrl || banner?.url || banner?.image}
            alt={`Banner ${i + 1}`}
            loading="lazy"
            draggable={false}
            className={`
              absolute
              inset-0

              w-full
              h-full

              object-cover
              object-center

              transition-opacity
              duration-700
              ease-in-out

              ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}
            `}
          />
        ))
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-20 pointer-events-none" />

      {/* Slider Dots */}
      {banners.length > 1 && (
        <div
          className="
            absolute
            bottom-3
            left-1/2
            -translate-x-1/2
            z-30

            flex
            items-center
            gap-2
          "
        >
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(i);
              }}
              aria-label={`Go to banner ${i + 1}`}
              className={`
                rounded-full
                transition-all
                duration-300

                ${
                  i === current
                    ? "w-6 h-2 bg-orange-500"
                    : "w-2 h-2 bg-white/70 hover:bg-white"
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;