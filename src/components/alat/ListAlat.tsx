"use client";

import { VARIABEL_ALAT } from "@/lib/constants";
import { fetcher } from "@/lib/helper";
import useSWR from "swr";
import Button from "../button/Button";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import ShowModal from "../utils/ShowModal";
import { useSession } from "next-auth/react";
import Loading from "../indikator/Loading";
import TextField from "../inputs/TextField";

interface ComponentProps {
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ListAlat({ setSuccess, setMessage }: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [idAlat, setIdAlat] = useState<string | null>(null);
  const [alatToUpdate, setAlatToUpdate] = useState<Alat | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [hasilPencarian, setHasilPencarian] = useState<Alat[] | null>(null);

  const variabelUmum = VARIABEL_ALAT.filter(
    (variabel) => variabel.id !== "aksi"
  ).filter((variabel) => variabel.id !== "jumlah_alat_tidak_layak");
  const variabelAdmin = VARIABEL_ALAT.filter(
    (variabel) => variabel.id !== "jumlah_alat_tidak_layak"
  );

  const { data: session } = useSession();

  function hideModal() {
    setIdAlat(null);
    setModalShown(null);
  }

  function hapusAlat(idAlat: string) {
    setModalShown("hapus-alat");
    setIdAlat(idAlat);
  }

  function editAlat(idAlat: string, alat: Alat) {
    setModalShown("edit-alat");
    setIdAlat(idAlat);
    setAlatToUpdate(alat);
  }

  async function cariAlat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (searchQuery) {
      setIsLoading(true);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_CARI_ALAT!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        });

        const response = await res.json();
        if (!response.ok) {
          setIsLoading(false);
          setHasilPencarian([]);
        } else {
          setIsLoading(false);
          setHasilPencarian(response.result);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setHasilPencarian(null);
    }
  }

  const {
    data: hasilAlat,
    isLoading: hasilAlatLoading,
    error,
    isValidating,
  } = useSWR("/api/list-alat", fetcher);

  function variabelTabel() {
    return session?.user.ROLE === "ADMIN" ? variabelAdmin : variabelUmum;
  }

  if (hasilAlatLoading || isValidating || isLoading) {
    return (
      <div className="w-full grid place-items-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return "Gagal mendapatkan data alat";
  }

  if (hasilAlat && hasilPencarian === null) {
    if (hasilAlat.result.length > 0) {
      return (
        <div className="w-full flex flex-col gap-4">
          <form
            className="w-full px-4 border border-gray-300 rounded-md flex flex-row gap-4 overflow-hidden"
            onSubmit={cariAlat}
          >
            <TextField
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none px-0 py-0"
              placeholder="Cari alat..."
            />
            <button type="submit">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
            </button>
          </form>
          <table className="w-full rounded-md overflow-hidden">
            <thead className="border border-gray-300 bg-orange-700 text-white font-medium">
              <tr>
                {variabelTabel().map((variabel: VariabelBarang) => (
                  <td
                    key={variabel.id}
                    className="text-center px-2 py-2 border border-gray-300"
                  >
                    <b>{variabel.name}</b>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasilAlat.result.map((alat: Alat, idx: number) => (
                <tr key={alat.ID_ALAT}>
                  <td className="text-center border border-gray-300 px-2 py-2">
                    <p>{idx + 1}.</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{alat.ID_ALAT}</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{alat.NAMA_ALAT}</p>
                  </td>
                  <td className="text-center border border-gray-300 px-2 py-2">
                    <p>{alat.detail_alat.length}</p>
                  </td>
                  <td className="text-center border border-gray-300 px-2 py-2">
                    <p>{alat.UNIT_ALAT}</p>
                  </td>
                  {session?.user?.ROLE === "ADMIN" && (
                    <>
                      <td className="border border-gray-300 px-2 py-2">
                        <div className="w-full flex flex-row items-center justify-center gap-2">
                          <Button
                            variants="ACCENT"
                            onClick={() => editAlat(alat.ID_ALAT, alat)}
                          >
                            <PencilIcon className="w-4 h-4 text-white" />
                          </Button>
                          <Button
                            variants="ERROR"
                            onClick={() => hapusAlat(alat.ID_ALAT)}
                          >
                            <TrashIcon className="w-4 h-4 text-white" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <ShowModal
            onClose={hideModal}
            options={modalShown}
            setSuccess={setSuccess}
            setMessage={setMessage}
            idAlat={idAlat}
            dataAlat={alatToUpdate}
          />
        </div>
      );
    } else {
      return (
        <div className="w-full">
          <p className="text-gray-500">Tidak ada data alat...</p>
        </div>
      );
    }
  }

  if (hasilPencarian) {
    if (hasilPencarian.length > 0) {
      return (
        <div className="w-full flex flex-col gap-4">
          <form
            className="w-full px-4 border border-gray-300 rounded-md flex flex-row gap-4 overflow-hidden"
            onSubmit={cariAlat}
          >
            <TextField
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none px-0 py-0"
              defaultValue={searchQuery ?? ""}
              placeholder="Cari alat..."
            />
            <button type="submit">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
            </button>
          </form>
          <table className="w-full rounded-md overflow-hidden">
            <thead className="border border-gray-300 bg-orange-700 text-white font-medium">
              <tr>
                {variabelTabel().map((variabel: VariabelBarang) => (
                  <td
                    key={variabel.id}
                    className="text-center px-2 py-2 border border-gray-300"
                  >
                    <b>{variabel.name}</b>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasilPencarian.map((alat: Alat, idx: number) => (
                <tr key={alat.ID_ALAT}>
                  <td className="text-center border border-gray-300 px-2 py-2">
                    <p>{idx + 1}.</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{alat.ID_ALAT}</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{alat.NAMA_ALAT}</p>
                  </td>
                  <td className="text-center border border-gray-300 px-2 py-2">
                    <p>{alat.detail_alat.length}</p>
                  </td>
                  <td className="text-center border border-gray-300 px-2 py-2">
                    <p>{alat.UNIT_ALAT}</p>
                  </td>
                  {session?.user?.ROLE === "ADMIN" && (
                    <>
                      <td className="border border-gray-300 px-2 py-2">
                        <div className="w-full flex flex-row items-center justify-center gap-2">
                          <Button
                            variants="ACCENT"
                            onClick={() => editAlat(alat.ID_ALAT, alat)}
                          >
                            <PencilIcon className="w-4 h-4 text-white" />
                          </Button>
                          <Button
                            variants="ERROR"
                            onClick={() => hapusAlat(alat.ID_ALAT)}
                          >
                            <TrashIcon className="w-4 h-4 text-white" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <ShowModal
            onClose={hideModal}
            options={modalShown}
            setSuccess={setSuccess}
            setMessage={setMessage}
            idAlat={idAlat}
            dataAlat={alatToUpdate}
          />
        </div>
      );
    } else {
      return (
        <div className="w-full flex flex-col gap-4">
          <form
            className="w-full px-4 border border-gray-300 rounded-md flex flex-row gap-4 overflow-hidden"
            onSubmit={cariAlat}
          >
            <TextField
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none px-0 py-0"
              defaultValue={searchQuery ?? ""}
              placeholder="Cari alat..."
            />
            <button type="submit">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
            </button>
          </form>
          <p className="text-gray-500">Alat tidak ditemukan...</p>
        </div>
      );
    }
  }
}
