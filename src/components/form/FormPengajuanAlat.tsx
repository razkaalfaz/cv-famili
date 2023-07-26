"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../button/Button";
import Snackbar from "../snackbar/Snackbar";
import { useSession } from "next-auth/react";

interface Inputs {
  NAMA_ALAT: string;
  JUMLAH_ALAT: number;
  DESKRIPSI: string;
}

export default function FormPengajuanAlat() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: session } = useSession();

  const { handleSubmit, register, reset } = useForm<Inputs>({
    mode: "onChange",
  });

  const submitAlat: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    if (session?.user) {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_PENGAJUAN_ALAT!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, ID_USER: session.user.ID_USER }),
        });

        const response = await res.json();

        if (!response.ok) {
          setIsLoading(false);
          setMessage(response.message);
          reset();
        } else {
          setIsLoading(false);
          setSuccess(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setMessage("Anda tidak mempunyai akses untuk melakukan pengajuan.");
      setIsLoading(false);
    }
  };

  const inputStyles =
    "px-2 py-2 w-full rounded-md outline-none border border-gray-300";
  const inputContainerStyles = "flex flex-col gap-2";
  const labelStyles = "text-neutral-950";
  const subtitleStyles = "text-gray-500 text-sm";

  return (
    <>
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(submitAlat)}
      >
        <div className={inputContainerStyles}>
          <label htmlFor="nama_alat" className={labelStyles}>
            Nama Alat
          </label>
          <p className={subtitleStyles}>
            Silahkan isi dengan nama alat yang dibutuhkan
          </p>
          <input
            className={inputStyles}
            id="nama_alat"
            {...register("NAMA_ALAT")}
            placeholder="Nama alat..."
          />
        </div>

        <div className={inputContainerStyles}>
          <label htmlFor="jumlah_alat" className={labelStyles}>
            Jumlah Alat
          </label>
          <p className={subtitleStyles}>
            Silahkan isi dengan jumlah alat yang dibutuhkan
          </p>
          <input
            min={1}
            className={inputStyles}
            id="jumlah_alat"
            {...register("JUMLAH_ALAT", {
              valueAsNumber: true,
            })}
            placeholder="1"
          />
        </div>

        <div className={inputContainerStyles}>
          <label htmlFor="deskripsi" className={labelStyles}>
            Deskripsi
          </label>
          <p className={subtitleStyles}>
            Silahkan isi dengan keterangan mengapa alat ini dibutuhkan
          </p>
          <textarea
            cols={4}
            className={inputStyles}
            id="deskripsi"
            {...register("DESKRIPSI")}
            placeholder="Deskripsi..."
          />
        </div>

        <Button variants="PRIMARY" fullWidth type="submit" disabled={isLoading}>
          Kirim
        </Button>
      </form>

      {message && <Snackbar variant="ERROR" message={message} />}
      {success && <Snackbar variant="SUCCESS" message={success} />}
    </>
  );
}
