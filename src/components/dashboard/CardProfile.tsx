"use client";

import Loading from "../indikator/Loading";
import { UserIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";

export default function CardAlat() {
  const { data: session, status } = useSession();

  return (
    <div className="w-80 rounded-md overflow-hidden flex flex-row gap-4 items-center px-4 py-4 shadow-lg border border-blue-200 text-neutral-700">
      {status === "loading" && <Loading />}

      {session && (
        <>
          <div className="px-2 py-2 rounded-full border border-blue-500 grid place-items-center">
            <UserIcon className="w-12 h-12 text-blue-500" />
          </div>
          <div className="flex flex-col gap-2">
            <p>Login sebagai</p>
            <b>{session.user.name}</b>
            <p>
              {session.user.ROLE === "USER"
                ? "KEPALA PROYEK"
                : session.user.ROLE}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
