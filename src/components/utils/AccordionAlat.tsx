"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface ComponentProps {
  dataAlat: Alat;
  setSelectedAlat: React.Dispatch<React.SetStateAction<string[]>>;
  setUncheckedAlat: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAlat: string[];
  uncheckedAlat: string[];
  isEdit: boolean;
  dataPermintaan: Permintaan | null;
}

export default function AccordionAlat({
  dataAlat,
  setSelectedAlat,
  setUncheckedAlat,
  uncheckedAlat,
  selectedAlat,
  isEdit,
  dataPermintaan,
}: ComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedStyles =
    "cursor-pointer w-full rounded-md p-2 bg-orange-500 text-white";
  const basicStyles = "cursor-pointer w-full p-2 text-neutral-800";

  const toggleSelectedAlat = (kodeAlat: string) => {
    const isSelected = selectedAlat.includes(kodeAlat);

    if (!isSelected) {
      setSelectedAlat((prev) => [...prev, kodeAlat]);
      const selectAlat = uncheckedAlat.filter(
        (kode: string) => kodeAlat !== kode
      );
      setUncheckedAlat(selectAlat);
    } else {
      const removeSelectedAlat = selectedAlat.filter(
        (kode: string) => kodeAlat !== kode
      );
      setUncheckedAlat((prev) => [...prev, kodeAlat]);
      setSelectedAlat(removeSelectedAlat);
    }
  };

  const alatTersedia = dataAlat.detail_alat.filter(
    (detail) => detail.STATUS === "TERSEDIA"
  );
  const currentAlat = dataPermintaan?.detail_permintaan.map(
    (detail) => detail.detail_alat
  );

  const showedAlat = isEdit
    ? alatTersedia.concat(currentAlat ?? [])
    : dataAlat.detail_alat.filter((detail) => detail.STATUS === "TERSEDIA");
  return (
    <div className="w-full flex flex-col rounded-md p-2 border border-gray-300 gap-4">
      <div
        className="w-full p-2 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p>{dataAlat.NAMA_ALAT}</p>
        <ChevronDownIcon className="w-4 h-4" />
      </div>

      {isOpen && (
        <>
          <div className="w-full h-px bg-gray-300" />
          <div className="w-full flex flex-col gap-4">
            {alatTersedia.map((detail) => (
              <div
                key={detail.KODE_ALAT}
                className={
                  selectedAlat.includes(detail.KODE_ALAT)
                    ? selectedStyles
                    : basicStyles
                }
                onClick={() => toggleSelectedAlat(detail.KODE_ALAT)}
              >
                <p>{detail.KODE_ALAT}</p>
              </div>
            ))}

            {isEdit && (
              <>
                <div className="w-full h-px relative bg-gray-300">
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">
                    Alat Dipilih
                  </p>
                </div>
                {currentAlat &&
                  currentAlat.map((detail) => (
                    <div
                      key={detail?.KODE_ALAT}
                      className={
                        selectedAlat.includes(detail?.KODE_ALAT)
                          ? selectedStyles
                          : basicStyles
                      }
                      onClick={() => toggleSelectedAlat(detail?.KODE_ALAT)}
                    >
                      <p>{detail?.KODE_ALAT}</p>
                    </div>
                  ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
