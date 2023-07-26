"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface ComponentProps {
  dropdownName: string;
  dropdownData: Tab[];
}

export default function Dropdown({
  dropdownName,
  dropdownData,
}: ComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const baseLinkStyles = "w-full px-2 py-2 hover:bg-orange-300 rounded-md";
  const activeLinkStyles = baseLinkStyles + " font-bold bg-orange-300";

  const pathname = usePathname();

  const baseDropdownStyles =
    "px-2 py-2 rounded-md flex flex-row gap-2 items-center text-black relative hover:bg-orange-300 cursor-pointer";
  const activeDropdownStyles = baseDropdownStyles + " bg-orange-300";

  return (
    <div
      className={isOpen ? activeDropdownStyles : baseDropdownStyles}
      onClick={() => setIsOpen((prev) => !prev)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <p>{dropdownName}</p>
      <ChevronDownIcon className="w-4 h-4" />

      <div className="w-full h-12 absolute top-0 left-0" />

      <div
        className={
          isOpen
            ? "w-max px-4 py-4 rounded-md bg-white border border-gray-300 flex flex-col items-start gap-4 absolute top-12 -left-[125%] z-50"
            : "hidden"
        }
      >
        {dropdownData.map((link) => (
          <Link
            href={link.url}
            className={
              pathname === link.url ? activeLinkStyles : baseLinkStyles
            }
            key={link.id}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
