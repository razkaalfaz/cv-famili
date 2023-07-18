"use client";

import { VARIABEL_PILIHAN_ALAT } from "@/lib/constants";
import { useRef } from "react";

interface ComponentProps {
  alat: Alat[];
  onCheckboxClicked: (
    event: React.ChangeEvent<HTMLInputElement>,
    item: BarangPermintaan
  ) => void;
}

export default function ListPilihanAlat({
  alat,
  onCheckboxClicked,
}: ComponentProps) {
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleInputClick = (index: number) => {
    inputRef.current[index]?.click();
  };

  return (
    <div className="w-full flex flex-row items-center flex-wrap gap-8">
      <table className="w-full border border-gray-300">
        <thead className="bg-orange-700 text-white">
          <tr>
            {VARIABEL_PILIHAN_ALAT.map((variabel) => (
              <td
                className="border border-gray-300 px-2 py-2"
                key={variabel.id}
              >
                {variabel.name}
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {alat.map((dataAlat, index) => (
            <tr
              key={dataAlat.ID_ALAT}
              className="cursor-pointer hover:bg-orange-50"
              onClick={() => handleInputClick(index)}
            >
              <td className="px-2 py-2 border border-gray-300">
                <input
                  type="checkbox"
                  name={dataAlat.ID_ALAT}
                  className="w-full h-full accent-orange-700"
                  id={dataAlat.ID_ALAT}
                  ref={(ref) => (inputRef.current[index] = ref)}
                  value={dataAlat.ID_ALAT}
                  onChange={(event) =>
                    onCheckboxClicked(event, {
                      ID_BARANG: event.target.value,
                      NAMA_BARANG: dataAlat.NAMA_ALAT,
                      UNIT_BARANG: dataAlat.UNIT_ALAT,
                    })
                  }
                />
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {dataAlat.ID_ALAT}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {dataAlat.NAMA_ALAT}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {dataAlat.JUMLAH_ALAT} {dataAlat.UNIT_ALAT}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {alat.length < 1 && (
        <p className="text-gray-500">Tidak ada alat tersedia...</p>
      )}
    </div>
  );
}
