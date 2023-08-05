"use client";

interface ComponentProps {
  permintaan: Permintaan[];
}

export default function TabelPermintaan({ permintaan }: ComponentProps) {
  function ColumnAlat({
    dataPermintaan,
    children,
  }: {
    dataPermintaan: Permintaan;
    children: React.ReactNode;
  }) {
    if (
      dataPermintaan.detail_permintaan
        .map((detail) => detail.detail_alat !== null)
        .includes(true)
    ) {
      return <td className="p-2">{children}</td>;
    } else {
      return null;
    }
  }
  return (
    <div className="flex flex-col overflow-x-auto">
      {permintaan.map((permintaan) => (
        <table key={permintaan.ID_PERMINTAAN} className="min-w-full">
          <thead className="bg-orange-500 text-white font-bold border border-gray-300">
            <tr>
              <th scope="col" className="p-2">
                No.
              </th>
              <th scope="col" className="p-2">
                ID Permintaan
              </th>
              <th scope="col" className="p-2">
                Nama Proyek
              </th>
              <th scope="col" className="p-2">
                Lokasi Proyek
              </th>
              {<ColumnAlat dataPermintaan={permintaan}>Alat</ColumnAlat>}
              <th scope="col" className="p-2">
                Bahan
              </th>
            </tr>
          </thead>
        </table>
      ))}
    </div>
  );
}
