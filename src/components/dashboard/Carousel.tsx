"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CAROUSEL_ASSETS as assets } from "@/lib/constants";

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevClick = useCallback(() => {
    setActiveIndex(activeIndex === 0 ? assets.length - 1 : activeIndex - 1);
  }, [activeIndex]);

  const handleNextClick = useCallback(() => {
    setActiveIndex(activeIndex === assets.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex]);

  useEffect(() => {
    const handleAutoPlay = () => {
      handleNextClick();
    };
    const intervalID = setInterval(handleAutoPlay, 3000);

    return () => clearInterval(intervalID);
  }, [handleNextClick]);

  return (
    <div className="w-full h-96 rounded-md overflow-hidden relative flex flex-col items-center justify-center z-30">
      <Image
        src={assets[activeIndex]}
        fill
        className="object-cover -z-20"
        alt={`carousel-${activeIndex}`}
      />
      <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-t from-black opacity-50 -z-10" />
      <div className="w-full h-full flex flex-col gap-2 z-20 text-white text-center items-center justify-center">
        <p className="text-4xl font-bold">CV. Famili Sejahtera Utama</p>
        <p className="text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing.
        </p>
      </div>
    </div>
  );
}
