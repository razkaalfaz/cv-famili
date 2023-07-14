"use client";

import { NAVIGATION_TABS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../button/Button";
import { signOut } from "next-auth/react";

export default function NavigationTabs() {
  const pathname = usePathname();

  const baseLinkStyles =
    "w-full px-2 py-2 grid place-items-center border border-gray-300 bg-opacity-95 hover:bg-sky-300 rounded-md overflow-hidden";
  const activeLinkStyles =
    baseLinkStyles + " bg-sky-300 text-neutral-800 hover:bg-opacity-100";

  if (pathname === "/") {
    return null;
  } else {
    return (
      <div className="w-64 min-h-screen shrink-0 flex flex-col gap-4 border border-gray-300 px-4 py-4">
        <div className="w-full px-2 py-2 grid place-items-center font-bold text-lg">
          CV Famili
        </div>
        {NAVIGATION_TABS.map((tab: Tab) => (
          <Link
            href={tab.url}
            key={tab.id}
            className={pathname === tab.url ? activeLinkStyles : baseLinkStyles}
          >
            {tab.name}
          </Link>
        ))}
        <Button variants="ERROR" onClick={() => signOut()} fullWidth>
          Logout
        </Button>
      </div>
    );
  }
}
