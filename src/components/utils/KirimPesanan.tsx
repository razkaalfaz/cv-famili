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
  opsi: string;
}

export default function KirimPesanan({
  permintaan,
  isOpen,
  onClose,
  setMessage,
  setSuccess,
  opsi,
}: ComponentProps) {
  const [dataTransportasi, setDataTransportasi] = useState<
    Transportasi[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlat, setSelectedAlat] = useState<string[]>([]);

  const { handleSubmit, reset, register } = useForm<Inputs>({
    mode: "onChange",
  });
  const {
    data: armada,
    isLoading: loadingArmada,
    error,
  } = useSWR("/api/list_armada", fetcher);

  const { data: dataAlat, isLoading: loadingAlat } = useSWR(
    "/api/list-alat",
    fetcher
  );

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
      const allTransportationsData = selectedArmada?.transportasi;

      setDataTransportasi(allTransportationsData ?? null);
    }
  }

  function alatChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedAlat((prev) => [...prev, value]);
    } else {
      const updatedSelectedAlat = selectedAlat.filter((x) => x !== value);
      setSelectedAlat(updatedSelectedAlat);
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
          SELECTED_ALAT: selectedAlat,
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
        mutate("/api/list-alat");
        reset();
        onClose();
      }
    } catch (err) {
      setIsLoading(false);
      setMessage("Terjadi kesalahan...");
      console.error(err);
    }
  };

  const ambilBarang: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_AMBIL_BARANG!, {
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
        mutate("/api/list-alat");
        reset();
        onClose();
      }
    } catch (err) {
      setIsLoading(false);
      setMessage("Terjadi kesalahan...");
      console.error(err);
    }
  };

  function renderPilihanAlat() {
    if (permintaan && opsi === "pengiriman" && dataAlat) {
      const dataPermintaan = permintaan.detail_permintaan_alat;
      const alat: Alat[] = dataAlat.result;
      const availableAlat = (idAlat: string) =>
        alat.find((alat) => alat.ID_ALAT === idAlat);

      const totalAlatTersedia = (idAlat: string) => {
        if (availableAlat(idAlat)) {
          const detailAlat = availableAlat(idAlat)?.detail_alat;
          const alatTersedia =
            detailAlat?.filter((detail) => detail.STATUS === "TERSEDIA") ?? [];

          return alatTersedia.length;
        } else {
          return 0;
        }
      };

      const conditionalStyles = (isEnough: boolean) =>
        isEnough ? "font-bold text-green-950" : "font-bold text-red-500";

      return dataPermintaan.map((permintaan) => (
        <div
          key={permintaan.ID_PERMINTAAN_ALAT}
          className="w-full flex flex-col gap-2"
        >
          <label
            className={conditionalStyles(
              totalAlatTersedia(permintaan.ID_ALAT) > permintaan.JUMLAH_ALAT
            )}
          >
            {permintaan.alat.NAMA_ALAT} - {permintaan.JUMLAH_ALAT}{" "}
            {permintaan.alat.UNIT_ALAT}
            {totalAlatTersedia(permintaan.ID_ALAT) < permintaan.JUMLAH_ALAT &&
              " - Jumlah alat yang tersedia tidak cukup untuk memenuhi permintaan ini!"}
          </label>
          <div className="w-full grid grid-cols-2 items-center gap-2">
            {availableAlat(permintaan.ID_ALAT)
              ?.detail_alat.filter((detail) => detail.STATUS === "TERSEDIA")
              .slice(0, permintaan.JUMLAH_ALAT)
              .map((detail) => (
                <div
                  className="flex flex-row items-center gap-2"
                  key={detail.KODE_ALAT}
                >
                  <input
                    type="checkbox"
                    value={detail.KODE_ALAT}
                    onChange={alatChangeHandler}
                    disabled={
                      detail.ID_ALAT === permintaan.ID_ALAT &&
                      selectedAlat.filter((x) =>
                        x.includes(detail.KODE_ALAT.substring(0, 2))
                      ).length > permintaan.JUMLAH_ALAT
                    }
                  />
                  <p>{detail.KODE_ALAT}</p>
                </div>
              ))}
          </div>
        </div>
      ));
    } else {
      return null;
    }
  }

  function cekJumlah() {
    if (permintaan) {
      const detailPermintaanAlat = permintaan.detail_permintaan_alat;
      const jumlahDetailPermintaan = detailPermintaanAlat
        .map((detail) => detail.JUMLAH_ALAT)
        .reduce((total, num) => total + num, 0);
      return jumlahDetailPermintaan;
    } else {
      return -1;
    }
  }

  function hideModal() {
    setSelectedAlat([]);
    setDataTransportasi(null);

    onClose();
  }
  return isOpen ? (
    <div className="w-full h-screen fixed top-0 left-0 z-30 bg-black bg-opacity-50 grid place-items-center">
      <div className="w-1/2 px-4 py-4 rounded-lg bg-white text-black flex flex-col gap-4">
        <div className="w-full flex flex-row justify-between items-center">
          <p className="text-2xl font-semibold">
            {opsi === "pengiriman" ? "Kirim Permintaan" : "Ambil Barang"}
          </p>
          <div
            className="px-2 py-2 rounded-md hover:bg-gray-50 grid place-items-center cursor-pointer"
            onClick={hideModal}
          >
            <XMarkIcon className="w-8 h-8" />
          </div>
        </div>

        <form
          className="flex flex-col gap-2"
          onSubmit={
            opsi === "pengiriman"
              ? handleSubmit(kirimPermintaan)
              : handleSubmit(ambilBarang)
          }
        >
          {opsi === "pengiriman" && (
            <div className={inputContainerStyles}>
              <div className={labelContainerStyles}>
                <label className={labelStyles}>Alat</label>
                <p className={subtitleStyles}>
                  Silahkan pilih alat yang akan dikirimkan
                </p>
              </div>

              {renderPilihanAlat()}
            </div>
          )}
          <div className={inputContainerStyles}>
            <div className={labelContainerStyles}>
              <label htmlFor="armada" className={labelStyles}>
                Armada
              </label>
              <p className={subtitleStyles}>
                Silahkan pilih armada untuk{" "}
                {opsi === "pengiriman" ? "pengiriman" : "pengambilan barang"}
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
                  Silahkan pilih transportasi untuk{" "}
                  {opsi === "pengiriman" ? "pengiriman" : "pengambilan barang"}
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
                {dataTransportasi
                  .filter((transportasi) => transportasi.STATUS === "TERSEDIA")
                  .map((transportasi: Transportasi) => (
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
            disabled={
              isLoading ||
              (opsi === "pengiriman" && selectedAlat.length < cekJumlah())
            }
          >
            {isLoading ? "Memproses..." : "Kirim"}
          </Button>
        </form>
      </div>
    </div>
  ) : null;
}
