"use client";

import { fetcher } from "@/lib/helper";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import Button from "../button/Button";

interface Inputs {
  ID_TRANSPORTASI: string;
}

interface ComponentProps {
  permintaan: Permintaan | null;
  isOpen: boolean;
  onClose: () => void;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function KirimPesanan({
  permintaan,
  isOpen,
  onClose,
  setMessage,
  setSuccess,
}: ComponentProps) {
  const [dataTransportasi, setDataTransportasi] = useState<
    Transportasi[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, reset, register } = useForm<Inputs>({
    mode: "onChange",
  });
  const {
    data: armada,
    isLoading: loadingArmada,
    error,
  } = useSWR("/api/list_armada", fetcher);

  const { mutate } = useSWRConfig();

  const inputContainerStyles = "flex flex-col gap-2";
  const labelContainerStyles = "flex flex-col gap-px";
  const labelStyles = "font-semibold";
  const subtitleStyles = "text-sm text-gray-500";
  const inputStyles =
    "px-2 py-2 outline-none border border-gray-300 rounded-md";

  function armadaChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
    if (armada && armada.result) {
      const dataArmada: Armada[] = armada.result;
      const selectedArmadaId = event.target.value;
      const selectedArmada = dataArmada.find(
        (armada) => armada.ID_ARMADA === selectedArmadaId
      );
      const transportationsData = selectedArmada?.transportasi;

      setDataTransportasi(transportationsData ?? null);
    }
  }

  const kirimPermintaan: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_KIRIM_PERMINTAAN!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID_PERMINTAAN: permintaan?.ID_PERMINTAAN,
          ID_TRANSPORTASI: data.ID_TRANSPORTASI,
        }),
      });

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage(response.message);
      } else {
        setIsLoading(false);
        setSuccess(response.message);
        mutate("/api/semua_permintaan");
        reset();
        onClose();
      }
    } catch (err) {
      setIsLoading(false);
      setMessage("Terjadi kesalahan...");
      console.error(err);
    }
  };

  return isOpen ? (
    <div className="w-full h-screen fixed top-0 left-0 z-30 bg-black bg-opacity-50 grid place-items-center">
      <div className="px-4 py-4 rounded-lg bg-white text-black flex flex-col gap-4">
        <div className="w-full flex flex-row justify-between items-center">
          <p className="text-2xl font-semibold">Kirim Permintaan</p>
          <div
            className="px-2 py-2 rounded-md hover:bg-gray-50 grid place-items-center cursor-pointer"
            onClick={onClose}
          >
            <XMarkIcon className="w-8 h-8" />
          </div>
        </div>

        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(kirimPermintaan)}
        >
          <div className={inputContainerStyles}>
            <div className={labelContainerStyles}>
              <label htmlFor="armada" className={labelStyles}>
                Armada
              </label>
              <p className={subtitleStyles}>
                Silahkan pilih armada untuk pengiriman
              </p>
            </div>
            <select
              id="armada"
              required
              defaultValue=""
              onChange={armadaChangeHandler}
              className={inputStyles}
            >
              <option value="">Pilih armada...</option>
              {loadingArmada && (
                <option value="" disabled>
                  Loading armada...
                </option>
              )}
              {armada && armada.result && (
                <>
                  {armada.result.map((armada: Armada) => (
                    <option key={armada.ID_ARMADA} value={armada.ID_ARMADA}>
                      {armada.NAMA_ARMADA} -{" "}
                      {
                        armada.transportasi.filter(
                          (transportasi) => transportasi.STATUS === "TERSEDIA"
                        ).length
                      }{" "}
                      transportasi tersedia
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {dataTransportasi && (
            <div className={inputContainerStyles}>
              <div className={labelContainerStyles}>
                <label htmlFor="transportasi" className={labelStyles}>
                  Transportasi
                </label>
                <p className={subtitleStyles}>
                  Silahkan pilih transportasi untuk pengiriman
                </p>
              </div>
              <select
                id="transportasi"
                required
                defaultValue=""
                {...register("ID_TRANSPORTASI")}
                className={inputStyles}
              >
                <option value="">Pilih transportasi...</option>
                {loadingArmada && (
                  <option value="" disabled>
                    Loading transportasi...
                  </option>
                )}
                {dataTransportasi.map((transportasi: Transportasi) => (
                  <option
                    key={transportasi.ID_TRANSPORTASI}
                    value={transportasi.ID_TRANSPORTASI}
                  >
                    {transportasi.NAMA_TRANSPORTASI}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            variants="ACCENT"
            type="submit"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Kirim"}
          </Button>
        </form>
      </div>
    </div>
  ) : null;
}
