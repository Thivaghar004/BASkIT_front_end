"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/images/sale1.png",
  "/images/sale2.jpg",
  "/images/sale3.jpg",
];

const Slider = () => {
  const swiperRef = useRef(null); 

  return (
    <div className="relative w-full h-[400px] mt-5">
    
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)} 
        className="w-full h-full"
        style={{"--swiper-pagination-color": "green","--swiper-pagination-bullet-active-color": "#008000","--swiper-pagination-bullet-inactive-opacity": "0.6", "--swiper-pagination-bullet-active-opacity": "1", }}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[400px]">
              <Image
                src={src}
                alt={`Sale Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition z-50"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition z-50"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Slider;
