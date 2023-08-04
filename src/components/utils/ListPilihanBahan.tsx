"use client";

import { VARIABEL_PILIHAN_BAHAN } from "@/lib/constants";
import { useCallback, useRef } from "react";

interface ComponentProps {
  bahan: Bahan[];
  onCheckboxClicked: (
    event: React.ChangeEvent<HTMLInputElement>,
    item: BarangPermintaan
  ) => void;
  selectedBahan: string[];
}

export default function ListPilihanAlat({
  bahan,
  onCheckboxClicked,
  selectedBahan,
}: ComponentProps) {
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleInputClick = (index: number) => {
    inputRef.current[index]?.click();
  };

  const checkSelectedBahan = useCallback(
    (idBahan: string) => {
      var checked = false;
      for (var i = 0; i < (selectedBahan.length ?? 0); i++) {
        if (selectedBahan[i] === idBahan) {
          checked = true;
          break;
        }
      }

      return checked;
    },
    [selectedBahan]
  );

  return (
    <div className="w-full flex flex-row items-center flex-wrap gap-8">
      <table className="w-full border border-gray-300">
        <thead className="bg-orange-700 text-white">
          <tr>
            {VARIABEL_PILIHAN_BAHAN.map((variabel) => (
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
          {bahan.map((dataBahan, index) => (
            <tr
              key={dataBahan.ID_BAHAN}
              className="cursor-pointer hover:bg-orange-50"
              onClick={() => handleInputClick(index)}
            >
              <td className="px-2 py-2 border border-gray-300">
                <input
                  type="checkbox"
                  name={dataBahan.ID_BAHAN}
                  className="w-full h-full accent-orange-700"
                  id={dataBahan.ID_BAHAN}
                  ref={(ref) => (inputRef.current[index] = ref)}
                  value={dataBahan.ID_BAHAN}
                  checked={checkSelectedBahan(dataBahan.ID_BAHAN)}
                  disabled={checkSelectedBahan(dataBahan.ID_BAHAN)}
                  onChange={(event) =>
                    onCheckboxClicked(event, {
                      ID_BARANG: event.target.value,
                      NAMA_BARANG: dataBahan.NAMA_BAHAN,
                      UNIT_BARANG: dataBahan.UNIT_BAHAN,
                    })
                  }
                />
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {dataBahan.ID_BAHAN}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {dataBahan.NAMA_BAHAN}
              </td>
              <td className="px-2 py-2 border border-gray-300">
                {dataBahan.STOCK_BAHAN} {dataBahan.UNIT_BAHAN}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bahan.length < 1 && (
        <p className="text-gray-500">Tidak ada bahan tersedia...</p>
      )}
    </div>
  );
}
