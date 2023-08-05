"use client";

import Button from "@/components/button/Button";
import Snackbar from "@/components/snackbar/Snackbar";
import { fetcher } from "@/lib/helper";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";

interface PageProps {
  params: {
    id: string;
  };
}

interface Inputs {
  NAMA_ALAT: string;
  KODE_UNIT: string;
  JUMLAH_ALAT: number;
}

export default function EditAlat({ params }: PageProps) {
  const [newDetailAlat, setNewDetailAlat] = useState<IDetailAlat[]>([]);
  const [removedAlat, setRemovedAlat] = useState<IDetailAlat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAdd, setIsAdd] = useState(false);

  const router = useRouter();

  const { register, reset, handleSubmit } = useForm<Inputs>({
    mode: "onChange",
  });
  const {
    data: dataAlat,
    isLoading: loadingData,
    error,
  } = useSWR("/api/get-alat/" + params.id, fetcher);
  const { mutate } = useSWRConfig();

  const inputContainerStyles = "w-full flex flex-col gap-2";
  const labelStyles = "font-bold";
  const inputStyles = "w-full rounded-md p-2 border border-gray-300";

  const alat: Alat = dataAlat ? dataAlat.result : null;
  const detailAlat = alat ? alat.detail_alat : [];

  const onEditSubmit: SubmitHandler<Inputs> = async (data) => {
    const { NAMA_ALAT, JUMLAH_ALAT, KODE_UNIT } = data;
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_EDIT_DETAIL_ALAT!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NAMA_ALAT: NAMA_ALAT,
          JUMLAH_ALAT: JUMLAH_ALAT,
          KODE_UNIT: KODE_UNIT,
          REMOVED_ALAT: removedAlat,
          ID_ALAT: params.id,
        }),
      });

      const response = await res.json();
      if (!response.ok) {
        setIsLoading(false);
        setMessage(response.message);
      } else {
        setIsLoading(false);
        setSuccess(response.message);
        setRemovedAlat([]);
        setNewDetailAlat([]);
        reset();
        router.push("/barang");
        mutate("/api/get-alat/" + params.id);
      }
    } catch (err) {
      setIsLoading(false);
      setMessage("Terjadi kesalahan...");
      console.error(err);
    }
  };

  function hapusDetail(x: IDetailAlat) {
    if (removedAlat.length > 0 && removedAlat.includes(x)) {
      setRemovedAlat((prev) => [...prev]);
    } else {
      const updatedDetail =
        newDetailAlat.length > 0
          ? newDetailAlat.filter((detail) => detail !== x)
          : detailAlat.filter((detail) => detail !== x);
      setRemovedAlat((prev) => [...prev, x]);
      setNewDetailAlat(updatedDetail);
    }
  }

  function showDetailAlat() {
    if (removedAlat.length > 0) {
      return newDetailAlat;
    } else {
      return detailAlat;
    }
  }

  function renderNewAlatInputs() {
    return (
      <>
        <div className={inputContainerStyles}>
          <label htmlFor="kodeUnit">Kode Unit Alat</label>
          <input
            type="text"
            id="kodeUnit"
            className={inputStyles}
            required
            placeholder="AC"
            maxLength={2}
            {...register("KODE_UNIT")}
          />
        </div>
        <div className={inputContainerStyles}>
          <label htmlFor="jumlahAlat">Jumlah Alat</label>
          <input
            type="number"
            id="jumlahAlat"
            className={inputStyles}
            required
            placeholder="1"
            min={1}
            {...register("JUMLAH_ALAT", {
              valueAsNumber: true,
            })}
          />
        </div>
      </>
    );
  }

  if (loadingData) {
    return <p className="text-gray-500 italic">Loading alat...</p>;
  }

  if (error) {
    return (
      <p className="text-gray-500 italic">Gagal mendapatkan data alat...</p>
    );
  }

  if (dataAlat) {
    return (
      <div className="w-full flex flex-col gap-8 p-8">
        {message && <Snackbar variant="ERROR" message={message} />}
        {success && <Snackbar variant="SUCCESS" message={success} />}
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">Edit Alat</p>
          <p className="text-gray-500">
            Silahkan edit alat dengan menggunakan data yang valid.
          </p>
        </div>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onEditSubmit)}
        >
          {!isAdd && (
            <>
              <div className={inputContainerStyles}>
                <label htmlFor="nama_alat" className={labelStyles}>
                  Nama Alat
                </label>
                <input
                  className={inputStyles}
                  type="text"
                  id="nama_alat"
                  defaultValue={alat?.NAMA_ALAT ?? ""}
                  placeholder="Nama alat..."
                  {...register("NAMA_ALAT")}
                  required
                />
              </div>
              {showDetailAlat().map((detail) => (
                <div
                  key={detail.KODE_ALAT}
                  className="w-full flex flex-row gap-4 items-center"
                >
                  <input
                    className={inputStyles}
                    type="text"
                    value={detail.KODE_ALAT}
                    disabled
                  />
                  <Button
                    type="button"
                    variants="ERROR"
                    onClick={() => hapusDetail(detail)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {removedAlat.length < 1 && (
                <Button
                  variants="PRIMARY"
                  fullWidth
                  type="button"
                  onClick={() => setIsAdd(true)}
                >
                  Tambah Alat Baru
                </Button>
              )}
            </>
          )}
          {isAdd && renderNewAlatInputs()}

          <Button
            variants="ACCENT"
            type="submit"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Simpan"}
          </Button>
        </form>
      </div>
    );
  }
}
