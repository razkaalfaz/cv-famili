"use client";

import { fetcher } from "@/lib/helper";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import Button from "../button/Button";
import Loading from "../indikator/Loading";
import Snackbar from "../snackbar/Snackbar";

interface Inputs {
  ID_ALAT: string;
  JUMLAH_ALAT: number;
  KETERANGAN: string;
}

export default function FormPerbaikan() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    data: alat,
    isLoading: loadingData,
    isValidating,
  } = useSWR("/api/list-alat", fetcher);

  const { handleSubmit, reset, register } = useForm<Inputs>({
    mode: "onChange",
  });

  const pengajuanPerbaikan: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_PENGAJUAN_PERBAIKAN!,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage(response.message);
      } else {
        setIsLoading(false);
        setSuccess(response.message);
        reset();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const inputContainer = "flex flex-col gap-2";
  const labelStyles = "text-sm text-gray-500";
  const inputStyles = "px-2 py-2 outline-none border border-gray-300";

  return (
    <form
      className="w-full flex flex-col gap-8"
      onSubmit={handleSubmit(pengajuanPerbaikan)}
    >
      <div className="w-full flex flex-col gap-4">
        <div className={inputContainer}>
          <label htmlFor="id_alat" className={labelStyles}>
            Alat yang harus diperbaiki
          </label>
          <select {...register("ID_ALAT")} required className={inputStyles}>
            <option value="">
              Silahkan pilih alat yang harus diperbaiki...
            </option>
            {loadingData ? (
              <option value="">Loading...</option>
            ) : (
              <>
                {alat?.result.map((alat: Alat) => (
                  <option key={alat.ID_ALAT} value={alat.ID_ALAT}>
                    {alat.NAMA_ALAT}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className={inputContainer}>
          <label htmlFor="jumlah_alat" className={labelStyles}>
            Jumlah alat yang harus diperbaiki
          </label>
          <input
            id="jumlah_alat"
            className={inputStyles}
            type="number"
            required
            {...register("JUMLAH_ALAT")}
            min={1}
            placeholder="1"
          />
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className={inputContainer}>
          <label htmlFor="keterangan" className={labelStyles}>
            Keterangan
          </label>
          <textarea
            id="keterangan"
            className={inputStyles}
            required
            cols={3}
            placeholder="Alat ini harus diperbaiki karena..."
            {...register("KETERANGAN")}
          />
        </div>
      </div>

      <Button variants="PRIMARY" fullWidth type="submit" disabled={isLoading}>
        {isLoading ? "Memproses..." : "Kirim"}
      </Button>

      {success && (
        <Snackbar
          variant="SUCCESS"
          message={success}
          autoHide
          duration={5000}
        />
      )}
      {message && (
        <Snackbar
          variant="SUCCESS"
          message={message}
          autoHide
          duration={5000}
        />
      )}
    </form>
  );
}
