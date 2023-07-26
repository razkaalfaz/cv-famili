"use client";

import Button from "@/components/button/Button";
import Snackbar from "@/components/snackbar/Snackbar";
import { fetcher } from "@/lib/helper";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

interface Inputs {
  NAMA_TRANSPORTASI: string;
  ID_ARMADA: string;
  JUMLAH_TRANSPORTASI: number;
}

export default function TambahTransportasi() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { handleSubmit, reset, register } = useForm<Inputs>({
    mode: "onChange",
  });

  const {
    data: armada,
    isLoading: loadingArmada,
    error,
  } = useSWR("/api/list_armada", fetcher);

  const tambahTransportasi: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_TAMBAH_TRANSPORTASI!,
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

  const inputContainerStyles = "flex flex-col gap-2";
  const labelContainerStyles = "flex flex-col gap-px";
  const labelStyles = "font-bold";
  const subtitleStyles = "text-sm text-gray-500";
  const inputStyles =
    "px-2 py-2 w-full outline-none border border-gray-300 rounded-md";

  return (
    <div className="w-full flex flex-col gap-8 px-8 py-8">
      <div className="w-full flex flex-col gap-2">
        <p className="text-2xl font-medium">Tambah Transportasi</p>
        <div className="w-32 h-px bg-orange-500" />
      </div>

      <form
        onSubmit={handleSubmit(tambahTransportasi)}
        className="flex flex-col gap-4"
      >
        <div className={inputContainerStyles}>
          <div className={labelContainerStyles}>
            <label htmlFor="nama_transportasi" className={labelStyles}>
              Nama Transportasi
            </label>
            <p className={subtitleStyles}>
              Silahkan isi dengan nama tranportasi seperti: truk, pickup, dll.
            </p>
          </div>
          <input
            className={inputStyles}
            type="text"
            required
            id="nama_transportasi"
            placeholder="Nama transportasi..."
            {...register("NAMA_TRANSPORTASI")}
          />
        </div>

        <div className={inputContainerStyles}>
          <div className={labelContainerStyles}>
            <label htmlFor="jumlah_transportasi" className={labelStyles}>
              Jumlah Transportasi
            </label>
            <p className={subtitleStyles}>
              Silahkan isi dengan jumlah transportasi yang tersedia.
            </p>
          </div>
          <input
            className={inputStyles}
            type="number"
            min={1}
            required
            id="jumlah_transportasi"
            placeholder="1"
            {...register("JUMLAH_TRANSPORTASI", {
              valueAsNumber: true,
            })}
          />
        </div>

        <div className={inputContainerStyles}>
          <div className={labelContainerStyles}>
            <label htmlFor="armada" className={labelStyles}>
              Armada
            </label>
            <p className={subtitleStyles}>
              Silahkan pilih armada yang menampung transportasi ini.
            </p>
          </div>
          <select required className={inputStyles} {...register("ID_ARMADA")}>
            <option value="">Pilih armada...</option>
            {loadingArmada && (
              <option value="" disabled>
                Loading...
              </option>
            )}
            {armada && armada.result && (
              <>
                {armada.result.map((armada: Armada) => (
                  <option key={armada.ID_ARMADA} value={armada.ID_ARMADA}>
                    {armada.NAMA_ARMADA}
                  </option>
                ))}
              </>
            )}
            {error && (
              <option value="" disabled>
                Gagal mendapatkan data armada
              </option>
            )}
          </select>
        </div>

        <Button variants="PRIMARY" type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Memproses..." : "Simpan"}
        </Button>
      </form>

      {message && <Snackbar variant="ERROR" message={message} />}
      {success && <Snackbar variant="SUCCESS" message={success} />}
    </div>
  );
}
