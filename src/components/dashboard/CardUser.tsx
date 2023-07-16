"use client";

import { fetcher } from "@/lib/helper";
import useSWR from "swr";
import Loading from "../indikator/Loading";
import { UserIcon } from "@heroicons/react/24/solid";

export default function CardAlat() {
  const {
    data: users,
    isLoading,
    isValidating,
    error,
  } = useSWR("/api/list-user", fetcher);

  const dataUsers = users?.result;

  return (
    <div className="w-80 rounded-md overflow-hidden flex flex-row justify-between items-center px-4 py-4 shadow-lg border border-blue-200 text-neutral-700">
      {isValidating || (isLoading && <Loading />)}

      {dataUsers && (
        <>
          <div className="flex flex-col gap-2">
            <b className="text-4xl text-blue-500">{dataUsers.length}</b>
            <p>Jumlah total pengguna</p>
          </div>

          <div className="px-2 py-2 rounded-full border border-blue-500 grid place-items-center">
            <UserIcon className="w-12 h-12 text-blue-500" />
          </div>
        </>
      )}
    </div>
  );
}
