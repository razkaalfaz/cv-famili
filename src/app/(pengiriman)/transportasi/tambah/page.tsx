"use client";

import Button from "@/components/button/Button";
import Snackbar from "@/components/snackbar/Snackbar";
import { fetcher } from "@/lib/helper";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

interface Inputs {
  ID_ARMADA: string;
}

export default function TambahTransportasi() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [jumlahTransportasi, setJumlahTransportasi] = useState(1);
  const [dataTransportasi, setDataTransportasi] = useState<ITransportasi[]>([
    { namaTransportasi: "", platNomor: "" },
  ]);
  const { handleSubmit, reset, register } = useForm<Inputs>({
    mode: "onChange",
  });
  const router = useRouter();

  const {
    data: armada,
    isLoading: loadingArmada,
    error,
  } = useSWR("/api/list_armada", fetcher);

  const tambahTransportasi: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);

    const { ID_ARMADA } = data;
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_TAMBAH_TRANSPORTASI!,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ID_ARMADA: ID_ARMADA,
            TRANSPORTASI: dataTransportasi,
          }),
        }
      );

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage(response.message);
      } else {
        setIsLoading(false);
        setSuccess(response.message);
        router.push("/transportasi");
        reset();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJumlahTransportasiChange = (value: number) => {
    const newJumlahTransportasi = jumlahTransportasi + value;
    setJumlahTransportasi(
      newJumlahTransportasi > 0 ? newJumlahTransportasi : 0
    );

    setDataTransportasi((prevData) => {
      const newDataTransportasi = prevData.slice(
        0,
        Math.min(prevData.length, newJumlahTransportasi)
      );

      if (newJumlahTransportasi > prevData.length) {
        return [
          ...newDataTransportasi,
          ...Array(newJumlahTransportasi - prevData.length).fill({
            nama: "",
            platNomor: "",
          }),
        ];
      }

      return newDataTransportasi;
    });
  };

  const handleDataTransportasiChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = event.target;

    setDataTransportasi((prevData) =>
      prevData.map((data, i) =>
        i === index ? { ...data, [name]: value } : data
      )
    );
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
            <label htmlFor="jumlah_transportasi" className={labelStyles}>
              Jumlah Transportasi
            </label>
            <p className={subtitleStyles}>
              Silahkan isi dengan jumlah transportasi yang tersedia.
            </p>
          </div>
          <div className="w-full flex flex-row gap-2 items-center">
            <input
              className={inputStyles}
              type="number"
              min={1}
              value={jumlahTransportasi}
              required
              id="jumlah_transportasi"
              placeholder="1"
              disabled
            />
            <Button
              type="button"
              variants="ACCENT"
              onClick={() => handleJumlahTransportasiChange(1)}
            >
              <PlusIcon className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variants="ERROR"
              onClick={() => handleJumlahTransportasiChange(-1)}
            >
              <MinusIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {dataTransportasi.map((data, index) => (
          <div key={index}>
            <div className="w-full flex flex-row gap-2 items-center">
              <input
                type="text"
                name="namaTransportasi"
                placeholder="Nama transportasi..."
                value={data.namaTransportasi}
                onChange={(event) => handleDataTransportasiChange(event, index)}
                required
                className={inputStyles}
              />
              <input
                type="text"
                name="platNomor"
                placeholder="Plat nomor..."
                value={data.platNomor}
                onChange={(event) => handleDataTransportasiChange(event, index)}
                required
                className={inputStyles}
              />
            </div>
          </div>
        ))}

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
