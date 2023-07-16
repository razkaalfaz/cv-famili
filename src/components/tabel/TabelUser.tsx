"use client";

import { fetcher } from "@/lib/helper";
import useSWR from "swr";
import Loading from "../indikator/Loading";
import { USERS_TABLE_VARIABLES } from "@/lib/constants";
import { useState } from "react";
import ShowModal from "../utils/ShowModal";
import Button from "../button/Button";
import Snackbar from "../snackbar/Snackbar";

export default function TabelUser() {
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const {
    data: users,
    isLoading,
    isValidating,
    error,
  } = useSWR("/api/list-user", fetcher);

  if (isLoading || isValidating) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full grid place-items-center">
        <p className="text-gray-500">Gagal mendapatkan data user...</p>
      </div>
    );
  }

  function deleteUser(ID_USER: number) {
    setUserId(ID_USER);
    setModalShown("hapus-user");
    setMessage(null);
    setSuccess(null);
  }

  function hideModal() {
    setModalShown(null);
    setUserId(null);
  }

  if (users) {
    const dataUser = users.result;
    if (dataUser.length > 0) {
      return (
        <>
          <table className="w-full rounded-md overflow-hidden">
            <thead className="border border-white bg-orange-700 text-white font-medium">
              <tr>
                {USERS_TABLE_VARIABLES.map(
                  (variabel: { id: string; name: string }) => (
                    <td
                      key={variabel.id}
                      className="text-center px-2 py-2 border border-white"
                    >
                      <b>{variabel.name}</b>
                    </td>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {dataUser
                .filter((user: User) => user.ROLE !== "ADMIN")
                .map((user: User, idx: number) => (
                  <tr key={user.ID_USER}>
                    <td className="text-center border border-gray-300 px-2 py-2">
                      {idx + 1}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {user.NAME}
                    </td>
                    <td className="text-center border border-gray-300 px-2 py-2">
                      {user.USERNAME}
                    </td>
                    <td className="text-center border border-gray-300 px-2 py-2">
                      {user.ROLE}
                    </td>
                    <td className="grid place-items-center border border-gray-300 px-2 py-2">
                      <Button
                        variants="ERROR"
                        fullWidth
                        onClick={() => deleteUser(user.ID_USER)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {message && (
            <Snackbar
              variant="ERROR"
              message={message}
              autoHide
              duration={3000}
            />
          )}
          {success && (
            <Snackbar
              variant="SUCCESS"
              message={success}
              autoHide
              duration={3000}
            />
          )}

          <ShowModal
            onClose={hideModal}
            options={modalShown}
            setMessage={setMessage}
            setSuccess={setSuccess}
            idUser={userId}
          />
        </>
      );
    } else {
      return (
        <div className="w-full grid place-items-center text-gray-500">
          Tidak ada data user ditemukan...
        </div>
      );
    }
  }
}
