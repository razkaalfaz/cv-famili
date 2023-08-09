"use client";

import { fetcher } from "@/lib/helper";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import Button from "../button/Button";
import Loading from "../indikator/Loading";
import Snackbar from "../snackbar/Snackbar";

interface Inputs {
  KODE_ALAT: string;
  JUMLAH_ALAT: number;
  KETERANGAN: string;
  TINGKAT_KERUSAKAN: string;
}

export default function FormPerbaikan() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedAlat, setSelectedAlat] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<string[] | []>([]);

  const { data: alat, isLoading: loadingData } = useSWR(
    "/api/list-alat",
    fetcher
  );

  const { handleSubmit, reset, register } = useForm<Inputs>({
    mode: "onChange",
  });

  const pengajuanPerbaikan: SubmitHandler<Inputs> = async (data) => {
    const { KETERANGAN, TINGKAT_KERUSAKAN } = data;
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_PENGAJUAN_PERBAIKAN!,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ID_ALAT: selectedAlat,
            SELECTED_ALAT: selectedDetail,
            KETERANGAN: KETERANGAN,
            TINGKAT_KERUSAKAN: TINGKAT_KERUSAKAN,
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
        reset();
      }
    } catch (err) {
      console.error(err);
    }
  };

  function showDetailAlat() {
    if (selectedAlat !== null) {
      const dataAlat: Alat = alat?.result?.find(
        (alat: Alat) => alat.ID_ALAT === selectedAlat
      );
      const detailAlat = dataAlat.detail_alat.filter(
        (detail) =>
          detail.STATUS === "RUSAK" && !detail.detail_perbaikan?.ID_PERBAIKAN
      );
      return (
        <div className="w-full flex flex-col gap-4">
          <p className={labelStyles}>Silahkan pilih alat di bawah ini.</p>
          {detailAlat?.map((detail) => (
            <div
              className="flex flex-row gap-2 items-center"
              key={detail?.KODE_ALAT}
            >
              <input
                type="checkbox"
                value={detail?.KODE_ALAT}
                id={detail?.KODE_ALAT}
                onChange={onDetailAlatChanges}
              />
              <label htmlFor={detail?.KODE_ALAT}>{detail?.KODE_ALAT}</label>
            </div>
          ))}

          <div className={inputContainer}>
            <label htmlFor="tingkat_kerusakan" className={labelStyles}>
              Tingkat Kerusakan
            </label>
            <select
              required
              className={inputStyles}
              {...register("TINGKAT_KERUSAKAN")}
            >
              <option value="">
                Silahkan pilih tingkat kerusakan pada alat...
              </option>
              <option value="BERAT">Berat</option>
              <option value="RINGAN">Ringan</option>
            </select>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  function onAlatChanges(ID_ALAT: string) {
    setSelectedAlat(ID_ALAT);
    setSelectedDetail([]);
  }

  function onDetailAlatChanges(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked, value } = event.target;

    if (checked) {
      setSelectedDetail((prev) => [...prev, value]);
    } else {
      const updatedDetail = selectedDetail.filter(
        (kodeAlat) => kodeAlat !== value
      );
      setSelectedDetail(updatedDetail);
    }
  }

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
          <select
            onChange={(event) => onAlatChanges(event.target.value)}
            required
            className={inputStyles}
          >
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

      {selectedAlat && showDetailAlat()}

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
