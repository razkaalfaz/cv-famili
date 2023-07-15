"use client";

import Button from "@/components/button/Button";
import Snackbar from "@/components/snackbar/Snackbar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Inputs {
  USERNAME: string;
  PASSWORD: string;
  NAME: string;
  ROLE: string;
}

export default function TambahUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { handleSubmit, register, reset } = useForm<Inputs>({
    mode: "onChange",
  });

  const tambahUser: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_TAMBAH_USER!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

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

  const inputStyles =
    "w-full rounded-md border border-gray-300 overflow-hidden px-2 py-2";
  const labelStyles = "text-gray-500";
  const inputContainerStyles = "w-full flex flex-col gap-2";

  const { data: session } = useSession();

  if (session && session.user.ROLE !== "ADMIN") {
    return "Anda tidak mempunyai akses untuk halaman ini!";
  } else {
    return (
      <form
        className="w-full px-8 py-8 flex flex-col gap-8"
        onSubmit={handleSubmit(tambahUser)}
      >
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-semibold">Tambahkan User</p>
          <p className="text-lg">
            Silahkan isi detail user yang akan anda tambahkan.
          </p>
          <div className="w-28 rounded-md bg-orange-700 h-1" />
        </div>

        <div className={inputContainerStyles}>
          <label htmlFor="NAME" className={labelStyles}>
            Nama user
          </label>
          <input
            id="NAME"
            type="text"
            className={inputStyles}
            {...register("NAME")}
            placeholder="Nama..."
            required
          />
        </div>

        <div className={inputContainerStyles}>
          <label htmlFor="USERNAME" className={labelStyles}>
            Username
          </label>
          <input
            id="USERNAME"
            type="text"
            className={inputStyles}
            {...register("USERNAME")}
            placeholder="Username..."
            required
          />
        </div>

        <div className={inputContainerStyles}>
          <label htmlFor="PASSWORD" className={labelStyles}>
            Password
          </label>
          <input
            id="PASSWORD"
            type="password"
            className={inputStyles}
            {...register("PASSWORD")}
            placeholder="Password..."
            required
          />
        </div>

        <div className={inputContainerStyles}>
          <label htmlFor="ROLE" className={labelStyles}>
            Role user
          </label>
          <select
            id="ROLE"
            className={inputStyles}
            {...register("ROLE")}
            required
          >
            <option value="">Pilih role user...</option>
            <option value="PERALATAN">Petugas Peralatan</option>
            <option value="USER">User</option>
          </select>
        </div>
        <Button variants="PRIMARY" disabled={isLoading} fullWidth>
          Simpan
        </Button>

        {message && <Snackbar variant="ERROR" message={message} />}
        {success && <Snackbar variant="SUCCESS" message={success} />}
      </form>
    );
  }
}
