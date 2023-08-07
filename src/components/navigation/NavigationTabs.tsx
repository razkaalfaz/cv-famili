"use client";

import {
  ADMIN_DROPDOWN_TABS,
  NAVIGATION_TABS,
  PERALATAN_DROPDOWN_TABS,
  ROUTES,
} from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../button/Button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Dropdown from "./dropdown/Dropdown";

export default function NavigationTabs() {
  const pathname = usePathname();

  const baseLinkStyles = "px-2 py-2 grid place-items-center";
  const activeLinkStyles =
    baseLinkStyles + " font-bold border-b-2 border-b-orange-700";

  const { data: session } = useSession();

  const { update } = useSession();

  function logoutHandler() {
    signOut();
    update();
  }

  if (pathname === "/") {
    return null;
  } else {
    return (
      <div className="w-full shrink-0 flex flex-row justify-between items-center border border-gray-300 px-4 py-4">
        <div className="flex flex-row items-center gap-4 px-2 py-2">
          <Image src="/logo.png" width={64} height={64} alt="logo" />
          <div className="flex flex-col">
            <p className="text-orange-700 font-semibold">FAMILI</p>
            <p className="text-sm">CV. Famili Sejahtera Utama</p>
          </div>
        </div>
        {session && session.user.ROLE === "USER" && (
          <div className="flex flex-row items-center gap-4">
            {NAVIGATION_TABS.map((tab: Tab) => (
              <Link
                href={tab.url}
                key={tab.id}
                className={
                  pathname === tab.url ? activeLinkStyles : baseLinkStyles
                }
              >
                {tab.name}
              </Link>
            ))}

            <Link
              href={ROUTES.BARANG.PENGAJUAN_ALAT}
              className={
                pathname === ROUTES.BARANG.PENGAJUAN_ALAT
                  ? activeLinkStyles
                  : baseLinkStyles
              }
            >
              Pengajuan alat baru
            </Link>

            <Button variants="ERROR" onClick={() => logoutHandler()}>
              Logout
            </Button>
          </div>
        )}

        {session && session.user.ROLE === "ADMIN" && (
          <div className="flex flex-row items-center gap-4">
            <Link
              className={
                pathname === "/dashboard" ? activeLinkStyles : baseLinkStyles
              }
              href="/dashboard"
            >
              Dashboard
            </Link>

            <Dropdown
              dropdownName="Permintaan"
              dropdownData={ADMIN_DROPDOWN_TABS.PERMINTAAN}
            />
            <Dropdown
              dropdownName="Data"
              dropdownData={ADMIN_DROPDOWN_TABS.DATA}
            />
            <Dropdown
              dropdownName="Laporan"
              dropdownData={ADMIN_DROPDOWN_TABS.LAPORAN}
            />

            <Button variants="ERROR" onClick={() => logoutHandler()}>
              Logout
            </Button>
          </div>
        )}

        {session && session.user.ROLE === "PERALATAN" && (
          <div className="flex flex-row items-center gap-4">
            <Link
              className={
                pathname === "/dashboard" ? activeLinkStyles : baseLinkStyles
              }
              href="/dashboard"
            >
              Dashboard
            </Link>

            <Dropdown
              dropdownName="Permintaan"
              dropdownData={PERALATAN_DROPDOWN_TABS.PERMINTAAN}
            />
            <Dropdown
              dropdownName="Data"
              dropdownData={PERALATAN_DROPDOWN_TABS.DATA}
            />

            <Button variants="ERROR" onClick={() => logoutHandler()}>
              Logout
            </Button>
          </div>
        )}
      </div>
    );
  }
}
