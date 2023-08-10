"use client";

import React, { useState } from "react";
import Button from "../button/Button";
import ModalsContainer from "../modal/ModalsContainer";
import { useSWRConfig } from "swr";

interface ComponentProps {
  permintaan: Permintaan | null;
  isOpen: boolean;
  onClose: () => void;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
}

interface KeteranganRusak {
  [key: string]: string;
}

interface TingkatKerusakan {
  [key: string]: string;
}

export default function VerifikasiPengembalian({
  permintaan,
  onClose,
  setMessage,
  setSuccess,
  isOpen,
}: ComponentProps) {
  const [isBroken, setIsBroken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [brokenAlat, setBrokenAlat] = useState<IDetailAlat[]>([]);
  const [keteranganRusak, setKeteranganRusak] = useState<KeteranganRusak>({});
  const [tingkatKerusakan, setTingkatKerusakan] = useState<TingkatKerusakan>(
    {}
  );

  const { mutate } = useSWRConfig();

  async function verifikasiPengembalian(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);

    try {
      const alatRusak: AlatRusak[] = [];

      if (isBroken) {
        brokenAlat.forEach((alat) => {
          const _keteranganRusak = keteranganRusak[alat.KODE_ALAT];
          const _tingkatKerusakan = tingkatKerusakan[alat.KODE_ALAT];
          alatRusak.push({
            ID_ALAT: alat.ID_ALAT,
            KETERANGAN_RUSAK: _keteranganRusak,
            TINGKAT_KERUSAKAN: _tingkatKerusakan,
            KODE_UNIT_ALAT: alat.KODE_ALAT,
          });
        });
      }

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_VERIFIKASI_PENGEMBALIAN!,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            permintaan: permintaan,
            ID_USER: permintaan?.ID_USER,
            IS_BROKEN: isBroken,
            ALAT_RUSAK: alatRusak,
          }),
        }
      );

      const response = await res.json();
      if (!response.ok) {
        setIsLoading(false);
        setMessage(response.message);
        setSuccess(null);
      } else {
        setIsLoading(false);
        setMessage(null);
        setSuccess(response.message);
        hideModal();
        mutate("/api/list-perbaikan");
      }
    } catch (err) {
      setIsLoading(false);
      setSuccess(null);
      setMessage("Terjadi kesalahan...");
      console.error(err);
    }
  }

  function onBrokenChanged(value: string) {
    if (value === "y") {
      setIsBroken(true);
    } else {
      setBrokenAlat([]);
      setKeteranganRusak({});
      setTingkatKerusakan({});
      setIsBroken(false);
    }
  }
  function registerBrokenAlat(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked, value } = event.target;

    if (permintaan) {
      const detailAlat = permintaan.detail_permintaan.map(
        (detail) => detail.detail_alat
      );
      const brokenDetailAlat = detailAlat.find(
        (detail) => detail.KODE_ALAT === value
      );

      if (brokenDetailAlat) {
        if (checked) {
          setBrokenAlat((prev) => [...prev, brokenDetailAlat]);
        } else {
          const updatedBrokenAlat = brokenAlat.filter(
            (curr) => curr.KODE_ALAT !== value
          );
          var updatedKeteranganRusak = keteranganRusak;
          var updatedTingkatKerusakan = tingkatKerusakan;
          delete updatedKeteranganRusak[value];
          delete updatedTingkatKerusakan[value];

          setTingkatKerusakan(updatedTingkatKerusakan);
          setKeteranganRusak(updatedKeteranganRusak);
          setBrokenAlat(updatedBrokenAlat);
        }
      }
    }
  }
  function registerKeteranganRusak(
    event: React.ChangeEvent<HTMLTextAreaElement>,
    kodeAlat: string
  ) {
    const { value } = event.target;
    setKeteranganRusak((prev) => ({ ...prev, [kodeAlat]: value }));
  }
  function registerTingkatKerusakan(
    event: React.ChangeEvent<HTMLSelectElement>,
    kodeAlat: string
  ) {
    const { value } = event.target;
    setTingkatKerusakan((prev) => ({ ...prev, [kodeAlat]: value }));
  }

  function renderAlatRusakInput(detail_alat: IDetailAlat) {
    return (
      <div className="w-max flex flex-row items-center gap-2 justify-between">
        <input
          type="checkbox"
          value={detail_alat.KODE_ALAT}
          id={detail_alat.KODE_ALAT}
          onChange={registerBrokenAlat}
          required={brokenAlat.length < 1}
        />
        <label htmlFor={detail_alat.KODE_ALAT}>
          {detail_alat.KODE_ALAT} - {detail_alat.alat.NAMA_ALAT}
        </label>

        {brokenAlat.includes(detail_alat) && (
          <>
            <textarea
              className="w-full p-2 rounded-md outline-none border border-gray-300"
              cols={4}
              id="keteranganRusak"
              placeholder="Keterangan Kerusakan"
              onChange={(event) =>
                registerKeteranganRusak(event, detail_alat.KODE_ALAT)
              }
              required
            />

            <select
              id="tingkatKerusakan"
              className="w-full p-2 rounded-md outline-none border border-gray-300"
              onChange={(event) =>
                registerTingkatKerusakan(event, detail_alat.KODE_ALAT)
              }
              required
            >
              <option value="">Tingkat Kerusakan...</option>
              <option value="RINGAN">Ringan</option>
              <option value="BERAT">Berat</option>
            </select>
          </>
        )}
      </div>
    );
  }

  function hideModal() {
    onBrokenChanged("n");
    onClose();
  }

  return isOpen ? (
    <ModalsContainer
      title="Verifikasi Pengembalian"
      description="Silahkan verifikasi pengembalian yang diterima dari kepala proyek."
      onClose={hideModal}
    >
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={verifikasiPengembalian}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="isBroken">Apakah ada alat yang rusak?</label>
          <select
            id="isBroken"
            onChange={(event) => onBrokenChanged(event.target.value)}
            required
            className="w-full p-2 rounded-md outline-none border border-gray-300"
          >
            <option value="n">Tidak</option>
            <option value="y">Ya</option>
          </select>
        </div>

        {isBroken && permintaan && (
          <>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="alatRusak">Silahkan pilih alat yang rusak</label>
              {permintaan.detail_permintaan.map((detail) => (
                <div
                  key={detail.ID_DETAIL_PERMINTAAN}
                  className="w-full flex flex-col gap-4"
                >
                  {renderAlatRusakInput(detail.detail_alat)}
                </div>
              ))}
            </div>
          </>
        )}

        <Button variants="ACCENT" fullWidth disabled={isLoading} type="submit">
          {isLoading ? "Memverifikasi..." : "Verifikasi"}
        </Button>
        <Button
          variants="SECONDARY"
          fullWidth
          disabled={isLoading}
          type="button"
          onClick={() => onClose()}
        >
          Batal
        </Button>
      </form>
    </ModalsContainer>
  ) : null;
}
