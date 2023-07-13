"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";

interface ComponentProps {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalsContainer({
  title,
  description,
  onClose,
  children,
}: ComponentProps) {
  return (
    <div className="w-full min-h-screen fixed top-0 left-0 z-10">
      <div
        className="w-full min-h-screen bg-black bg-opacity-50 fixed top-0 left-0 z-10"
        onClick={() => onClose()}
      />
      <div className="w-11/12 max-h-full lg:w-1/3 px-8 py-8 flex flex-col gap-4 bg-white rounded-xl overflow-y-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-full flex justify-between">
          <p className="font-bold text-xl">{title}</p>
          <div className="self-end flex justify-end items-center bg-gray-300 bg-opacity-0 hover:bg-opacity-30 rounded-md">
            <XMarkIcon
              className="w-8 h-8 text-primary cursor-pointer"
              onClick={() => onClose()}
            />
          </div>
        </div>
        <p>{description}</p>
        {children}
      </div>
    </div>
  );
}
