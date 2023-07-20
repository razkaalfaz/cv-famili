"use client";

import { NAVIGATION_TABS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../button/Button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

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

          {session && session.user.ROLE === "ADMIN" && (
            <div className="flex flex-row items-center gap-4">
              <Link
                href="/users"
                className={
                  pathname === "/users" ? activeLinkStyles : baseLinkStyles
                }
              >
                Users
              </Link>

              <Link
                href="/permintaan/laporan"
                className={
                  pathname === "/permintaan/laporan"
                    ? activeLinkStyles
                    : baseLinkStyles
                }
              >
                Laporan
              </Link>

              <Link
                href="/laporan-perbaikan"
                className={
                  pathname === "/laporan-perbaikan"
                    ? activeLinkStyles
                    : baseLinkStyles
                }
              >
                Laporan Perbaikan
              </Link>
            </div>
          )}

          {session && session.user.ROLE === "PERALATAN" && (
            <Link
              href="/pengajuan_perbaikan"
              className={
                pathname === "/pengajuan_perbaikan"
                  ? activeLinkStyles
                  : baseLinkStyles
              }
            >
              Pengajuan Perbaikan
            </Link>
          )}

          <Button variants="ERROR" onClick={() => logoutHandler()}>
            Logout
          </Button>
        </div>
      </div>
    );
  }
}
